import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { searchSimilarDocuments } from '../../services/supabase';
import { generateEmbedding, getChatResponse } from '../../services/dify';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      // Adiciona mensagem do usuário
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      
      // Gera embedding para a pergunta
      const embedding = await generateEmbedding(input);
      
      // Busca documentos similares
      const similarDocs = await searchSimilarDocuments(embedding);
      
      // Prepara o contexto
      const context = similarDocs
        .map(doc => doc.content)
        .join('\n\n');
      
      // Obtém resposta do chat
      const response = await getChatResponse([
        {
          role: 'system',
          content: 'Você é um assistente especializado da CGE/GO. Use apenas as informações do contexto fornecido para responder às perguntas.'
        },
        {
          role: 'user',
          content: `Contexto: ${context}\n\nPergunta: ${input}`
        }
      ]);
      
      // Adiciona resposta ao chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.choices[0].message.content,
        sources: similarDocs.map(doc => doc.name)
      }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta.'
      }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border'
            }`}>
              <p>{message.content}</p>
              {message.sources && (
                <div className="mt-2 pt-2 border-t text-sm">
                  <p className="font-medium text-gray-500">Fontes:</p>
                  {message.sources.map((source, idx) => (
                    <p key={idx} className="text-blue-500">{source}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua pergunta..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}