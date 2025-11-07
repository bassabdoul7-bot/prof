import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
