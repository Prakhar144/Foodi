import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (error, derivedKey) => {
    if (error) return reject(error);
    return resolve(`${salt}:${derivedKey.toString('hex')}`);
  });
});

export const verifyPassword = async (password, storedHash) => {
  const [salt] = String(storedHash || '').split(':');
  if (!salt) return false;

  const candidate = await hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(storedHash));
};

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const publicUser = ({ id, name, email }) => ({ id, name, email });
