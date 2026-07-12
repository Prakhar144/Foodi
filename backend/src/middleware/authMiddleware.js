import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { findUserById } from '../models/userModel.js';
import { UnauthorizedError } from '../utils/errors.js';
import { catchAsync } from '../utils/catchAsync.js';

export const requireAuth = catchAsync(async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError('Please log in before continuing.');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await findUserById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User not found. Please sign up or log in.');
    }

    req.authUser = user;
    req.authToken = token;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired authentication token. Please log in again.');
  }
});
