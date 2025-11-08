import React, { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, CheckCircle, BookOpen, Loader2, LogOut } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { chatAPI } from '../lib/api';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    subject,
    level,
    mode,
    conversationId,
    messagesRemaining,
    isLoading,
    setSubject,
    setLevel,
    setMode,
    addMessage,
    setLoading,
    setConversationId,
    setMessagesRemaining
  } = useChatStore();

  const { user, logout } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.solve({
        problem: input,
        subject,
        level,
        mode,
        conversationId: conversationId || undefined,
        userId: user?.id
      });

      const assistantMessage = {
        role: 'assistant' as const,
        content: response.solution,
        timestamp: new Date()
      };

      addMessage(assistantMessage);
      setConversationId(response.conversationId);
      setMessagesRemaining(response.messagesRemaining);
    } catch (error: any) {
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Desole, une erreur est survenue. ' + (error.response?.data?.message || 'Reessaie plus tard.'),
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    if (confirm('Es-tu sur de vouloir te deconnecter?')) {
      logout();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(to bottom, #f0fdf4, #fefce8)' }}>
      <div className="bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 p-1">
        <div className="bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Prof" className="w-20 h-20 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  Prof
                </h1>
                <p className="text-xs text-gray-600">Ton assistant educatif</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-green-700">
                Salut, {user?.name}!
              </span>
              {!user?.isPremium && messagesRemaining !== null && (
                <span className="bg-yellow-100 border border-yellow-400 px-3 py-1 rounded-full text-sm font-semibold text-yellow-800">
                  {messagesRemaining} messages
                </span>
              )}
              {user?.isPremium ? (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 rounded-full text-sm font-bold text-white shadow-md">
                  Premium
                </span>
              ) : (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition transform hover:scale-105"
                >
                  Devenir Premium
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                title="Deconnexion"
              >
                <LogOut size={20} className="text-red-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 p-2 border-2 border-green-200 rounded-lg bg-white focus:border-green-500 focus:outline-none"
            >
              <option>Mathematiques</option>
              <option>Physique-Chimie</option>
              <option>SVT</option>
              <option>Philosophie</option>
              <option>Francais</option>
              <option>Anglais</option>
              <option>Histoire-Geo</option>
              <option>Programmation</option>
              <option>Comptabilite</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="flex-1 p-2 border-2 border-yellow-200 rounded-lg bg-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="college">College (6eme-3eme) - BFEM</option>
              <option value="lycee">Lycee (2nde-Tle) - BAC</option>
              <option value="universite">Universite</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('full')}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition font-medium ${
                mode === 'full' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              <BookOpen size={18} />
              <span className="text-sm">Solution complete</span>
            </button>
            
            <button
              onClick={() => setMode('hints')}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition font-medium ${
                mode === 'hints' 
                  ? 'bg-yellow-500 text-white shadow-lg transform scale-105' 
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
              }`}
            >
              <Lightbulb size={18} />
              <span className="text-sm">Indices</span>
            </button>

            <button
              onClick={() => setMode('check')}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition font-medium ${
                mode === 'check' 
                  ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <CheckCircle size={18} />
              <span className="text-sm">Verifier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-20 p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto border-2 border-green-200">
            <div className="mb-6 flex justify-center">
              <img src="/logo.svg" alt="Prof" className="w-32 h-32 object-contain" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Jamm ak jaam, {user?.name}!
            </h2>
            <p className="text-lg text-gray-700 mb-2">Pose-moi une question ou partage ton probleme.</p>
            <p className="text-sm text-gray-600">Je vais t aider etape par etape!</p>
            <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
              <span>Fait au Senegal</span>
              <span>•</span>
              <span>Pour les eleves senegalais</span>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-white border-2 border-green-100'
              }`}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown className="prose prose-sm max-w-none prose-headings:text-green-700 prose-strong:text-green-800">
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-yellow-200 p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-yellow-600" size={20} />
                <span className="text-gray-700 font-medium">Je reflechis...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t-4 border-green-500 p-4 shadow-lg">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === 'full' ? 'Tape ton probleme ici...' :
              mode === 'hints' ? 'Decris ou tu es bloque...' :
              'Partage ta solution pour verification...'
            }
            className="flex-1 p-3 border-2 border-green-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPremiumModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                Passe Premium!
              </h2>
              <p className="text-gray-600">Debloquer toutes les fonctionnalites</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📚</span> Gratuit
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>15 messages par jour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Toutes les matieres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Solutions pas a pas</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-400 shadow-lg">
                <h3 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">⭐</span> Premium
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">★</span>
                    <span><strong>Messages illimites</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">★</span>
                    <span><strong>Reponses plus rapides</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">★</span>
                    <span><strong>Explications detaillees</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">★</span>
                    <span><strong>Support prioritaire</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 rounded-xl text-white mb-6 text-center">
              <div className="text-4xl font-bold mb-2">2,000 FCFA / mois</div>
              <div className="text-sm opacity-90">Ou 20,000 FCFA / an (economise 17%)</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Peut-etre plus tard
              </button>
              <button
                onClick={() => {
                  alert('Paiement Wave / Orange Money bientot disponible! 🇸🇳');
                  setShowPremiumModal(false);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-bold shadow-lg"
              >
                Souscrire maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}