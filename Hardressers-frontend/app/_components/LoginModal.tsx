'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [showResendButton, setShowResendButton] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setResendMessage(null);
    setShowResendButton(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setShowResendButton(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = error.message.toLowerCase();

        if (
          message.includes('email not confirmed') ||
          message.includes('email_not_confirmed') ||
          message.includes('not confirmed')
        ) {
          setError(
            "Votre adresse email n’est pas encore confirmée. Veuillez cliquer sur le lien reçu dans votre boîte mail."
          );
          setShowResendButton(true);
        } else if (
          message.includes('invalid login credentials') ||
          message.includes('invalid_credentials')
        ) {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError(error.message);
        }

        return;
      }

      if (data?.user && !data.user.email_confirmed_at) {
        setError(
          "Votre adresse email n’est pas encore confirmée. Veuillez vérifier votre boîte mail."
        );
        setShowResendButton(true);
        return;
      }

      resetForm();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    setResendLoading(true);
    setError(null);
    setResendMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setResendMessage(
        "Un nouvel email de confirmation a été envoyé. Pensez à vérifier vos courriels indésirables."
      );
    } catch (err: any) {
      setError(
        err?.message || "Impossible de renvoyer l'email de confirmation."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
  <div className="relative w-full max-w-md rounded-2xl border border-gray-300 bg-white text-black p-8 shadow-2xl">
    
    {/* Close */}
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-black"
    >
      ✕
    </button>

    {/* Header */}
    <div className="mb-6 text-center">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
        Luxury Hair
      </p>
      <h2 className="text-3xl font-light">Connexion</h2>
      <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]" />
    </div>

    {/* Error */}
    {error && (
      <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {/* Success resend */}
    {resendMessage && (
      <div className="mb-4 rounded-lg border border-green-400 bg-green-100 p-3 text-sm text-green-700">
        {resendMessage}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleLogin} className="space-y-4">
      
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#D4AF37] px-4 py-3 font-semibold text-black hover:bg-[#F4D03F] disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>

    {/* Resend */}
    {showResendButton && (
      <button
        type="button"
        onClick={handleResendEmail}
        disabled={resendLoading}
        className="mt-4 w-full text-sm text-[#D4AF37] hover:underline"
      >
        {resendLoading
          ? "Envoi de l'email..."
          : "Renvoyer l'email de confirmation"}
      </button>
    )}

    {/* Switch */}
    <p className="mt-6 text-center text-sm text-gray-600">
      Pas encore de compte ?{' '}
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="font-semibold text-[#D4AF37] hover:underline"
      >
        S'inscrire
      </button>
    </p>
  </div>
</div>
  );
};

export default LoginModal;