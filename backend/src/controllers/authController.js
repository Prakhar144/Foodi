import { createUser, findUserByEmail } from '../models/userModel.js';
import { generateToken, hashPassword, publicUser, verifyPassword } from '../services/authService.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
import { catchAsync } from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await hashPassword(password);
    const user = await createUser({ name, email, passwordHash });
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      user: publicUser(user),
      token,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ConflictError('An account with this email already exists.');
    }
    throw error;
  }
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new UnauthorizedError('Incorrect email or password.');
  }

  const token = generateToken(user);

  return res.json({
    success: true,
    user: publicUser(user),
    token,
  });
});

export const logout = (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
};
