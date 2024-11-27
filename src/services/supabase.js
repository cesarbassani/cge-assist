import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função de teste para listar documentos
export async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .limit(1);

    if (error) throw error;

    console.log('Conexão bem sucedida!', data);
    return true;
  } catch (error) {
    console.error('Erro na conexão:', error);
    return false;
  }
}

export async function uploadDocument(file, embedding) {
  try {
    console.log(`Processing document: ${file.name}`);
    console.log('Iniciando upload do documento:', file.name);
    
    // Extrair texto do documento
    const text = await file.text();
    
    // Salvar documento e embedding
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          name: file.name,
          content: text,
          embedding: embedding,
          metadata: {
            type: file.type,
            size: file.size,
            uploaded_at: new Date().toISOString()
          },
        }
      ])
      .select();

    if (error) throw error;
    
    console.log(`Document uploaded successfully: ${file.name}`);
    return data[0];
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }
}

export async function searchSimilarDocuments(embedding, threshold = 0.7, limit = 5) {
  try {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      similarity_threshold: threshold,
      match_count: limit
    });

    if (error) throw error;
    
    console.log(`Found ${data.length} similar documents`);
    return data;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw new Error(`Failed to search documents: ${error.message}`);
  }
}

export async function getDocuments() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
}

export async function getAllDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}