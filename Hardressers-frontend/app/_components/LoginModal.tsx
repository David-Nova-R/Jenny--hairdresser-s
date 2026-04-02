'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onSwitchToRegister }) => {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setResendMessage(null);
    setShowResendButton(false);
    setShowPassword(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setShowResendButton(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const message = error.message.toLowerCase();
        if (
          message.includes('email not confirmed') ||
          message.includes('email_not_confirmed') ||
          message.includes('not confirmed')
        ) {
          setError(tr('login_error_not_confirmed', lang));
          setShowResendButton(true);
        } else if (
          message.includes('invalid login credentials') ||
          message.includes('invalid_credentials')
        ) {
          setError(tr('login_error_credentials', lang));
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.user && !data.user.email_confirmed_at) {
        setError(tr('login_error_not_confirmed', lang));
        setShowResendButton(true);
        return;
      }

      resetForm();
      onClose();
    } catch (err: any) {
      setError(err?.message || tr('login_error_generic', lang));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError(tr('login_resend_missing_email', lang));
      return;
    }
    setResendLoading(true);
    setError(null);
    setResendMessage(null);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) { setError(error.message); return; }
      setResendMessage(tr('login_resend_success', lang));
    } catch (err: any) {
      setError(err?.message || tr('login_resend_error', lang));
    } finally {
      setResendLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-300 bg-white p-8 text-black shadow-2xl">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={tr('modal_close', lang)}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Luxury Hair</p>
          <h2 className="text-3xl font-light">{tr('login_title', lang)}</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Resend success */}
        {resendMessage && (
          <div className="mb-4 rounded-lg border border-green-400 bg-green-100 p-3 text-sm text-green-700">
            {resendMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {tr('login_email_label', lang)}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder={tr('login_email_ph', lang)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {tr('login_password_label', lang)}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-20 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-black"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#D4AF37] px-4 py-3 font-semibold text-black hover:bg-[#F4D03F] disabled:opacity-50"
          >
            {loading ? tr('login_btn_loading', lang) : tr('login_btn', lang)}
          </button>
        </form>

        {/* Resend button */}
        {showResendButton && (
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resendLoading}
            className="mt-4 w-full text-sm text-[#D4AF37] hover:underline disabled:opacity-50"
          >
            {resendLoading ? tr('login_resend_btn_loading', lang) : tr('login_resend_btn', lang)}
          </button>
        )}

        {/* Switch to register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {tr('login_no_account', lang)}{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-[#D4AF37] hover:underline"
          >
            {tr('login_switch_register', lang)}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
