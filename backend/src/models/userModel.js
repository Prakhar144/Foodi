import { pool } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const findUserById = async (userId) => {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash }) => {
  const [result] = await pool.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
  return { id: result.insertId, name, email };
};
