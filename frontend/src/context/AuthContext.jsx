import { createContext, useCallback, useContext, useState } from 'react';
import { API_URL } from '../constants/api.js';
import { STORAGE_KEYS } from '../constants/storage.js';
import { useNotice } from './NoticeContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showNotice } = useNotice();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN) || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const persistSession = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  const signup = useCallback(async (form) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      persistSession(data.user, data.token);
      showNotice('success', `Welcome, ${data.user.name}! Your account has been created.`);
      return true;
    } catch (error) {
      showNotice('error', error.message || 'Unable to create account.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [persistSession, showNotice]);

  const login = useCallback(async (form) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      persistSession(data.user, data.token);
      showNotice('success', `Welcome back, ${data.user.name}!`);
      return true;
    } catch (error) {
      showNotice('error', error.message || 'Unable to log in.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [persistSession, showNotice]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore logout errors — clear session regardless
    }
    clearSession();
    showNotice('success', 'You have been logged out.');
  }, [token, clearSession, showNotice]);

  return (
    <AuthContext.Provider value={{ user, token, isSubmitting, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
