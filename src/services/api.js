const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL;
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

export async function getEmbedding(text) {
  const response = await fetch(`${DIFY_API_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: text })
  });

  if (!response.ok) throw new Error('Failed to get embedding');
  const data = await response.json();
  return data.embedding;
}

export async function getChatResponse(messages) {
  const response = await fetch(`${DIFY_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: 'gpt-3.5-turbo' // ou outro modelo configurado no Dify
    })
  });

  if (!response.ok) throw new Error('Failed to get chat response');
  return response.json();
}