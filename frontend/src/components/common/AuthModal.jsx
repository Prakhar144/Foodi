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
      className="fixed inset-0 z-50 grid place-items-center bg-black/72 p-4 backdrop-blur-md"
      onClick={(e) => e.target.id === 'auth-overlay' && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-panel relative w-full max-w-md rounded-[28px] p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
        noValidate
      >
        <button
          id="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-xl border border-white/8 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X />
        </button>

        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 text-black shadow-[0_18px_30px_rgba(212,175,55,0.25)]">
          <UserRound size={28} />
        </div>
        <h2 className="font-['Sora'] text-3xl font-bold tracking-tight">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          {isSignup
            ? 'Sign up to place and pay for demo orders.'
            : 'Log in to place and pay for your order.'}
        </p>

        <div className="mt-6 space-y-3">
          {isSignup && (
            <input
              id="auth-name"
              name="name"
              required
              minLength={2}
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="premium-input"
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
            className="premium-input"
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
            className="premium-input"
          />
        </div>

        <button
          id="auth-submit"
          type="submit"
          disabled={isSubmitting}
          className="premium-button mt-5 w-full py-3.5"
        >
          {isSubmitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <p className="mt-4 text-center text-sm text-white/55">
          {isSignup ? 'Already have an account?' : 'New to Foodie?'}{' '}
          <button
            id="auth-switch"
            type="button"
            onClick={() => onSwitchMode(isSignup ? 'login' : 'signup')}
            className="font-semibold text-amber-200 hover:text-amber-100 hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
