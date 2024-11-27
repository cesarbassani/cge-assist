import React, { useState, useEffect } from 'react';
import ChatWindow from './components/chat/ChatWindow';
import { generateEmbedding } from './services/dify';
import { uploadDocument, getAllDocuments } from './services/supabase';
import { Upload, Book } from 'lucide-react';
import { testConnection } from './services/supabase';

export default function App() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [testStatus, setTestStatus] = useState(null);
  const [uploading, setUploading] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const documents = await getAllDocuments();
      setFiles(documents);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };
  
  const handleFileUpload = async (event) => {
    const newFiles = Array.from(event.target.files);
    
    for (const file of newFiles) {
      try {
        setUploading(prev => [...prev, file.name]);
        console.log(generateEmbedding);
        
        // Ler o conteúdo do arquivo
        const text = await file.text();
        console.log('Gerando embedding para:', file.name);
        
        // Gerar embedding via Dify
        const embedding = await generateEmbedding(text);
        
        // Upload para o Supabase
        await uploadDocument(file, embedding);
        
        // Recarregar lista de documentos
        await loadDocuments();
        
        console.log('Documento processado com sucesso:', file.name);
      } catch (error) {
        console.error(`Erro ao processar ${file.name}:`, error);
        alert(`Erro ao processar ${file.name}`);
      } finally {
        setUploading(prev => prev.filter(name => name !== file.name));
      }
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestStatus('testing');
      const result = await testConnection();
      setTestStatus(result ? 'success' : 'error');
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestStatus('error');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">CGE Assist</h1>
          <p className="text-sm text-gray-500">Assistente Inteligente CGE/GO</p>
        </div>

        {/* Test Connection Button */}
        <button
          onClick={handleTestConnection}
          className={`mb-4 p-2 rounded-lg text-white ${
            testStatus === 'testing' ? 'bg-yellow-500' :
            testStatus === 'success' ? 'bg-green-500' :
            testStatus === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
        >
          {testStatus === 'testing' ? 'Testando...' :
           testStatus === 'success' ? 'Conectado!' :
           testStatus === 'error' ? 'Erro na Conexão' :
           'Testar Conexão'}
        </button>
        
        {/* Upload Button */}
        <label className="cursor-pointer mb-6">
          <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-3 rounded-lg hover:bg-blue-100">
            <Upload size={20} />
            <span>Carregar Documentos</span>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>

        {/* Documents List */}
        <div className="flex-1 overflow-auto">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Documentos Carregados</h2>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <Book size={16} className="text-gray-400" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}