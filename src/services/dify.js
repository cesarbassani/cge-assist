import axios from 'axios';

const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL;
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

if (!DIFY_API_URL || !DIFY_API_KEY) {
  throw new Error('Missing Dify environment variables');
}

const difyAxios = axios.create({
  baseURL: DIFY_API_URL,
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

async function handleDifyResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function generateEmbedding(text) {
  try {
    console.log('Generating embedding for text...');
    const response = await difyAxios.post('/embeddings', { input: text });
    console.log('Embedding generated successfully');
    return response.data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

export async function getChatResponse(messages, temperature = 0.7) {
  try {
    console.log('Getting chat response...');
    const response = await difyAxios.post('/chat/completions', {
      messages,
      temperature,
      max_tokens: 1000
    });
    console.log('Chat response received successfully');
    return response.data;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw new Error(`Failed to get chat response: ${error.message}`);
  }
}