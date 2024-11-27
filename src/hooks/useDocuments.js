import { useState } from 'react';
import { supabase } from '../services/supabase';
import { getEmbedding } from '../services/api';

export default function useDocuments() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);

  const uploadDocument = async (file) => {
    setProcessing(prev => [...prev, file.name]);

    try {
      // 1. Ler o conteúdo do arquivo
      const text = await readFileAsText(file);

      // 2. Gerar embedding via Dify
      const embedding = await getEmbedding(text);

      // 3. Upload para Supabase
      const { data, error } = await supabase.from('documents').insert({
        name: file.name,
        content: text,
        metadata: {
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString()
        },
        embedding
      });

      if (error) throw error;

      setFiles(prev => [...prev, file]);
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Erro ao processar documento: ' + error.message);
    } finally {
      setProcessing(prev => prev.filter(name => name !== file.name));
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  return {
    files,
    processing,
    uploadDocument
  };
}