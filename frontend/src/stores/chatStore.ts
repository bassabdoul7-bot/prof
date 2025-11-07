import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatStore {
  messages: Message[];
  subject: string;
  level: string;
  mode: 'full' | 'hints' | 'check';
  conversationId: string | null;
  userId: string | null;
  isPremium: boolean;
  messagesRemaining: number | null;
  isLoading: boolean;
  
  setSubject: (subject: string) => void;
  setLevel: (level: string) => void;
  setMode: (mode: 'full' | 'hints' | 'check') => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setConversationId: (id: string) => void;
  setUserId: (id: string) => void;
  setMessagesRemaining: (count: number | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  subject: 'Mathématiques',
  level: 'lycee',
  mode: 'full',
  conversationId: null,
  userId: null,
  isPremium: false,
  messagesRemaining: 15,
  isLoading: false,

  setSubject: (subject) => set({ subject }),
  setLevel: (level) => set({ level }),
  setMode: (mode) => set({ mode }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setConversationId: (id) => set({ conversationId: id }),
  setUserId: (id) => set({ userId: id }),
  setMessagesRemaining: (count) => set({ messagesRemaining: count }),
  clearMessages: () => set({ messages: [], conversationId: null })
}));
