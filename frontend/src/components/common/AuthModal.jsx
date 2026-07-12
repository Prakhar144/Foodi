import { useState } from 'react';
import { UserRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
  const { signup, login, isSubmitting } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = mode === 'signup' ? await signup(form) : await login(form);
    if (success) onClose();
  };

  const isSignup = mode === 'signup';

  return (
    <div
      id="auth-overlay"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={(e) => e.target.id === 'auth-overlay' && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
        noValidate
      >
        <button
          id="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <UserRound className="mb-4 text-orange-600" size={30} />
        <h2 className="text-2xl font-black">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isSignup
            ? 'Sign up to place and pay for demo orders.'
            : 'Log in to place and pay for your order.'}
        </p>

        <div className="mt-5 space-y-3">
          {isSignup && (
            <input
              id="auth-name"
              name="name"
              required
              minLength={2}
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
            />
          )}
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
          />
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            placeholder="Password (6+ characters)"
            className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
          />
        </div>

        <button
          id="auth-submit"
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-orange-600 py-3 font-bold text-white disabled:opacity-70"
        >
          {isSubmitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignup ? 'Already have an account?' : 'New to Foodie?'}{' '}
          <button
            id="auth-switch"
            type="button"
            onClick={() => onSwitchMode(isSignup ? 'login' : 'signup')}
            className="font-bold text-orange-600 hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
