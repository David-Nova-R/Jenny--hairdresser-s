'use client';

import React, { useState } from 'react';
import { registerUserInBackend } from '@/app/_api/appointment-api';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // Call backend registration API only
      await registerUserInBackend({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });

      setSuccess(true);
      
      // Clear form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');

      // Redirect to login after a short delay
      setTimeout(() => {
        onSwitchToLogin();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
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
        <h2 className="text-2xl font-semibold mb-6 text-center">S'inscrire</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Inscription réussie! Redirection vers la connexion...
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        {/* Switch to login */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Déjà inscrit?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#D4AF37] hover:underline font-semibold"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
