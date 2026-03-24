'use client';

import React, { useState } from 'react';
import { registerUserInBackend } from '@/app/_api/appointment-api';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  show,
  onClose,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      await registerUserInBackend({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });

      setSuccessMessage(
        'Votre compte a été créé avec succès. Veuillez confirmer votre adresse email en cliquant sur le lien envoyé dans votre boîte mail avant de vous connecter.'
      );

      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white text-black shadow-2xl">
        {/* Header */}
        <div className="relative shrink-0 border-b border-gray-200 bg-white px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 text-2xl leading-none text-gray-400 transition-colors hover:text-black"
          >
            ✕
          </button>

          <div className="text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Luxury Hair
            </p>
            <h2 className="text-3xl font-light text-black">Créer un compte</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]" />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage ? (
            <div className="rounded-lg border border-green-400 bg-green-100 p-4 text-sm text-green-700">
              <p className="mb-2 font-semibold">Inscription réussie</p>
              <p>{successMessage}</p>

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="mt-4 w-full rounded-full border border-[#D4AF37] px-4 py-2 font-semibold text-[#B8901F] transition-all hover:bg-[#D4AF37] hover:text-black"
              >
                Aller à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Votre prénom"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="+1 514 123 4567"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#D4AF37] px-4 py-3 font-semibold text-black transition-all hover:bg-[#F4D03F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        {!successMessage && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-[#D4AF37] transition-colors hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;