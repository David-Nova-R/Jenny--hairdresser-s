'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { registerUserInBackend } from '@/app/_api/appointment-api';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | null;

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

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const [fieldError, setFieldError] = useState<FieldName>(null);
  const [fieldErrorMessage, setFieldErrorMessage] = useState<string | null>(null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setLoading(false);
    setMessage(null);
    setMessageType(null);
    setFieldError(null);
    setFieldErrorMessage(null);
  };

  useEffect(() => {
    if (show) resetForm();
  }, [show]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, '').slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhoneNumber = (value: string) =>
    value.replace(/\D/g, '').length === 10;

  const isValidPassword = (value: string) => {
    const hasMinLength = value.length >= 6;
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    return hasMinLength && hasNumber && hasSymbol;
  };

  const setFieldValidationError = (field: FieldName, errorMessage: string) => {
    setMessage(null);
    setMessageType(null);
    setFieldError(field);
    setFieldErrorMessage(errorMessage);

    const refMap = {
      firstName: firstNameRef,
      lastName: lastNameRef,
      phoneNumber: phoneRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
    };

    refMap[field]?.current?.focus();
  };

  const clearFieldError = (field: FieldName, value?: string) => {
    if (fieldError !== field) return;

    if (field === 'email' && value && isValidEmail(value)) {
      setFieldError(null);
      setFieldErrorMessage(null);
    }

    if (field === 'phoneNumber' && value && isValidPhoneNumber(value)) {
      setFieldError(null);
      setFieldErrorMessage(null);
    }

    if (field === 'password' && value && isValidPassword(value)) {
      setFieldError(null);
      setFieldErrorMessage(null);
    }

    if (field === 'confirmPassword' && value === password) {
      setFieldError(null);
      setFieldErrorMessage(null);
    }
  };

  const getInputClass = (field: FieldName) =>
    `w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
      fieldError === field
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-[#D4AF37]'
    }`;

  const renderFieldError = (field: FieldName) =>
    fieldError === field && fieldErrorMessage ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrorMessage}</p>
    ) : null;

  const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(null);
    setMessageType(null);
    setFieldError(null);
    setFieldErrorMessage(null);

    if (!isValidPhoneNumber(phoneNumber)) {
      setFieldValidationError('phoneNumber', tr('register_error_phone_invalid', lang));
      return;
    }

    if (!isValidEmail(email)) {
      setFieldValidationError('email', tr('register_error_email_invalid', lang));
      return;
    }

    if (!isValidPassword(password)) {
      setFieldValidationError('password', tr('register_error_password_rules', lang));
      return;
    }

    if (password !== confirmPassword) {
      setFieldValidationError('confirmPassword', tr('register_error_passwords', lang));
      return;
    }

    setLoading(true);

    try {
      await registerUserInBackend({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.replace(/\D/g, ''),
      });

      setMessage(tr('register_success_body', lang));
      setMessageType('success');
      setFieldError(null);
      setFieldErrorMessage(null);

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
    } catch (err: any) {
      setMessage(err?.message || tr('register_error_generic', lang));
      setMessageType('error');
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
          {message && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                messageType === 'success'
                  ? 'border-green-400 bg-green-100 text-green-700'
                  : 'border-red-400 bg-red-100 text-red-700'
              }`}
            >
              {messageType === 'success' && (
                <p className="mb-1 font-semibold">{tr('register_success_title', lang)}</p>
              )}
              <p>{message}</p>
            </div>
          )}

          {messageType === 'success' ? (
            <button
              type="button"
              onClick={() => {
                handleClose();
                onSwitchToLogin();
              }}
              className="w-full rounded-full border border-[#D4AF37] px-4 py-2 font-semibold text-[#B8901F] transition-all hover:bg-[#D4AF37] hover:text-black"
            >
              {tr('register_go_login', lang)}
            </button>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_firstname_label', lang)}
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder={tr('register_firstname_ph', lang)}
                  className={getInputClass('firstName')}
                />
                {renderFieldError('firstName')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_lastname_label', lang)}
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder={tr('register_lastname_ph', lang)}
                  className={getInputClass('lastName')}
                />
                {renderFieldError('lastName')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_phone_label', lang)}
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
                    clearFieldError('phoneNumber', formatted);
                  }}
                  required
                  placeholder="(514) 123-4567"
                  className={getInputClass('phoneNumber')}
                />
                {renderFieldError('phoneNumber')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('login_email_label', lang)}
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email', e.target.value);
                  }}
                  required
                  placeholder={tr('login_email_ph', lang)}
                  className={getInputClass('email')}
                />
                {renderFieldError('email')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_password_label', lang)}
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password', e.target.value);
                  }}
                  required
                  placeholder="••••••••"
                  className={getInputClass('password')}
                />
                {renderFieldError('password')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {tr('register_confirm_label', lang)}
                </label>
                <input
                  ref={confirmPasswordRef}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError('confirmPassword', e.target.value);
                  }}
                  required
                  placeholder="••••••••"
                  className={getInputClass('confirmPassword')}
                />
                {renderFieldError('confirmPassword')}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#D4AF37] px-4 py-3 font-semibold text-black transition-all hover:bg-[#F4D03F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? tr('register_btn_loading', lang) : tr('register_btn', lang)}
              </button>
            </form>
          )}
        </div>

        {messageType !== 'success' && (
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