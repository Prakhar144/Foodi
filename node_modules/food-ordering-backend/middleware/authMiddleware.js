import { findUserById } from '../models/userModel.js';
import { getSessionUserId } from '../services/sessionService.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const userId = getSessionUserId(token);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in before continuing.' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please log in before continuing.' });
    }

    req.authUser = user;
    req.authToken = token;
    return next();
  } catch (error) {
    return next(error);
  }
};
