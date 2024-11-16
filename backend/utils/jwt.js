import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  if (!authHeader || !token) return next(errorHandler(403, 'Not Authorized'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(403, 'Invalid token'));
  }
};

export { verifyToken };

