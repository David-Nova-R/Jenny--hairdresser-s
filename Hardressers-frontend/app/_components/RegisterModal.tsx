'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import { registerUserInBackend } from '@/app/_api/appointment-api';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  show,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const { lang } = useLang();

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
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError(tr('register_error_passwords', lang));
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

      setSuccessMessage(tr('register_success_body', lang));
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
    } catch (err: any) {
      setError(err?.message || tr('register_error_generic', lang));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white text-black shadow-2xl">

        <div className="relative shrink-0 border-b border-gray-200 bg-white px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label={tr('modal_close', lang)}
            className="absolute right-4 top-4 text-2xl leading-none text-gray-400 transition-colors hover:text-black"
          >
            ✕
          </button>

          <div className="text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Luxury Hair
            </p>
            <h2 className="text-3xl font-light text-black">
              {tr('register_title', lang)}
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage ? (
            <div className="rounded-lg border border-green-400 bg-green-100 p-4 text-sm text-green-700">
              <p className="mb-2 font-semibold">
                {tr('register_success_title', lang)}
              </p>
              <p>{successMessage}</p>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onSwitchToLogin();
                }}
                className="mt-4 w-full rounded-full border border-[#D4AF37] px-4 py-2 font-semibold text-[#B8901F] transition-all hover:bg-[#D4AF37] hover:text-black"
              >
                {tr('register_go_login', lang)}
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_firstname_label', lang)}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder={tr('register_firstname_ph', lang)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_lastname_label', lang)}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder={tr('register_lastname_ph', lang)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_phone_label', lang)}
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
                  {tr('login_email_label', lang)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={tr('login_email_ph', lang)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_password_label', lang)}
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
                  {tr('register_confirm_label', lang)}
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
                {loading
                  ? tr('register_btn_loading', lang)
                  : tr('register_btn', lang)}
              </button>
            </form>
          )}
        </div>

        {!successMessage && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              {tr('register_has_account', lang)}{' '}
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onSwitchToLogin();
                }}
                className="font-semibold text-[#D4AF37] transition-colors hover:underline"
              >
                {tr('register_switch_login', lang)}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}