import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateStickerApi = async (codePayload) => {
  const response = await apiClient.post('/api/generate', codePayload);
  return response.data;
};
