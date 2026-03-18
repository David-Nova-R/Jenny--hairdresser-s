'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Login successful, close modal
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-[400px] p-8 relative">
        {/* Close button X */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-6 text-center">Connexion</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F4D03F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Switch to register */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Pas encore de compte?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#D4AF37] hover:underline font-semibold"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
