import { createUser, findUserByEmail } from '../models/userModel.js';
import { createSession, deleteSession } from '../services/sessionService.js';
import { hashPassword, publicUser, verifyPassword } from '../services/authService.js';

export const signup = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Enter a name, valid email, and a password of at least 6 characters.' });
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await createUser({ name, email, passwordHash });
    return res.status(201).json({ success: true, user, token: createSession(user) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    console.error('Sign-up error:', error);
    return res.status(500).json({ success: false, message: 'Unable to create your account. Check the database connection.' });
  }
};

export const login = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    return res.json({ success: true, user: publicUser(user), token: createSession(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Unable to log in. Check the database connection.' });
  }
};

export const logout = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  deleteSession(token);
  return res.json({ success: true });
};
