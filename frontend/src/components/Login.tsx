import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-yellow-400">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Prof" className="w-24 h-24" />
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
          Prof
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Ton assistant educatif senegalais
        </p>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isLogin
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              !isLogin
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Inscription
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                required={!isLogin}
                placeholder="Entre ton nom"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none transition"
              required
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 text-white font-bold rounded-xl hover:shadow-2xl transition transform hover:scale-105 text-lg"
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Fait au Senegal avec Teranga</p>
          <p className="mt-2">Pour les eleves senegalais</p>
        </div>
      </div>
    </div>
  );
}