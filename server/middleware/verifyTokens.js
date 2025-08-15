import jwt from 'jsonwebtoken';
import { createError } from '../lib/createError.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(createError(401, 'Not authenticated'));
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, 'Invalid token'));
    
    req.user = payload;
    req.userId = payload.id;
    req.isAdmin = payload.role === 'admin';
    req.isSeller = payload.role === 'seller';
    req.isCustomer = payload.role === 'user';
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin' || req.userId === req.params.userId) {
      next();
    } else {
      return next(createError(403, "You are not authorized to access this resource"));
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not allowed to do that!"));
    }
  });
};

  export const verifySeller = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.isAdmin || req.isSeller) {
        next();
      } else {
        return next(createError(403, "You are not allowed to do that!"));
      }
    });
  };


