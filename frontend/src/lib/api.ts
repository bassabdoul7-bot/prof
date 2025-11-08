import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // <-- IMPORT THE STORE

// This is your existing 'api' instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- NEW CODE ---
// This adds the 'x-auth-token' to every request if you are logged in
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
// --- END NEW CODE ---

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

// We also need to export the base 'api' instance
// so your ChatInterface can use it for payment
export { api };