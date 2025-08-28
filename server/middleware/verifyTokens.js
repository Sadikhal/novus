import jwt from 'jsonwebtoken';
import { createError } from '../lib/createError.js';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return next(createError(401, 'Not authenticated'));

    const payload = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(payload.id).select('-password');
    if (!user) return next(createError(403, 'User no longer exists'));

    req.user = user;
    req.userId = user._id.toString();
    req.isAdmin = user.role === 'admin' && req.userId === process.env.ADMIN_ID;
    req.isSeller = user.role === 'seller';
    req.isCustomer = user.role === 'user';

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(createError(403, 'Invalid token'));
    }
    if (err.name === 'TokenExpiredError') {
      return next(createError(403, 'Token expired'));
    }
    next(err);
  }
};


export const verifyUser = (req, res, next) => {
  if (req.isAdmin || req.userId === req.params.id || req.userId === req.params.userId) {
    next();
  } else {
    return next(createError(403, "You are not authorized to access this resource"));
  }
};

export const verifyTokenAndAdmin = (req, res, next) => {
  if (req.isAdmin) next();
  else return next(createError(403, "Admin access only"));
};

export const verifySeller = (req, res, next) => {
  if (req.isAdmin || req.isSeller) next();
  else return next(createError(403, "Seller access only"));
};
