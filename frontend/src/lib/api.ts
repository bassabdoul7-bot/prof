import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface SolveRequest {
  problem: string;
  subject: string;
  level: string;
  mode: 'full' | 'hints' | 'check';
  conversationId?: string;
  userId?: string;
}

export interface SolveResponse {
  solution: string;
  conversationId: string;
  messagesRemaining: number | null;
}

export const chatAPI = {
  solve: async (data: SolveRequest): Promise<SolveResponse> => {
    const response = await api.post('/chat/solve', data);
    return response.data;
  },
  getConversations: async (userId: string) => {
    const response = await api.get(`/chat/conversations/${userId}`);
    return response.data;
  }
};

export { api };