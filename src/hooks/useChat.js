import { useState } from 'react';
import { searchSimilarDocuments } from '../services/supabase';
import { getEmbedding, getChatCompletion } from '../services/dify';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content) => {
    try {
      setLoading(true);
      // Adiciona mensagem do usuário
      setMessages(prev => [...prev, { role: 'user', content }]);

      // Gera embedding para a pergunta
      const embedding = await getEmbedding(content);

      // Busca documentos similares
      const similarDocs = await searchSimilarDocuments(embedding);
      
      // Prepara o contexto combinando os documentos relevantes
      const context = similarDocs
        .map(doc => doc.content)
        .join('\n\n');

      // Obtém resposta do Dify
      const response = await getChatCompletion(context, content);
      
      // Adiciona resposta do assistente
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.choices[0].message.content,
        sources: similarDocs.map(doc => doc.name)
      }]);

    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
}