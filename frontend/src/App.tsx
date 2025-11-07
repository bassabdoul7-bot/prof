import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface.tsx';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuthStore } from './stores/authStore';
import { authAPI, setAuthToken } from './lib/auth';
import './index.css';

function App() {
  const { isAuthenticated, token, setUser, logout } = useAuthStore();
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setAuthToken(token);
          const response = await authAPI.getProfile(token);
          setUser(response.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token, setUser, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup
        onSwitchToLogin={() => setShowSignup(false)}
        onSuccess={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onSwitchToSignup={() => setShowSignup(true)}
        onSuccess={() => {}}
      />
    );
  }

  return <ChatInterface />;
}

export default App;
