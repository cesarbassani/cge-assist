import React from 'react';
import { Upload, Book } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';

export default function Sidebar() {
  const { files, processing, uploadDocument } = useDocuments();

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      await uploadDocument(file);
    }
  };

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">CGE Assist</h1>
        <p className="text-sm text-gray-500">Assistente Inteligente CGE/GO</p>
      </div>

      {/* Upload Button */}
      <label className="cursor-pointer mb-6">
        <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-3 rounded-lg hover:bg-blue-100 transition-colors">
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
              <span className="truncate flex-1">{file.name}</span>
              {processing.includes(file.name) && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}