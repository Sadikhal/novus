import jwt from 'jsonwebtoken';
import { createError } from '../lib/createError.js';



// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return next(createError(401, 'You Are not authenticated'));
//   }

//   jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
//     if (err) return next(createError(403, 'Token is not valid!'));
//     req.user = payload;
//     req.user.role = payload.role;
//     req.userId = payload.id;
//     req.isAdmin = payload.role === 'admin';
//     req.isSeller === payload.role === 'seller'
//      // Populate req.user with user data
//     next();
//   });
// };

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



  // export const verifySeller = (req, res, next) => {
  //   verifyToken(req, res, () => {
  //     try {
  //       if (req.user.role === 'admin') return next();
        
  //       if (req.user.role === 'seller' && 
  //           req.userId === req.params.sellerId) {
  //         return next();
  //       }
        
  //       return next(createError(403, "Seller authorization required"));
  //     } catch (err) {
  //       next(err);
  //     }
  //   });
  // };
  

  

  
  export const verifySeller = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.isAdmin || req.isSeller) { // Check req properties
        next();
      } else {
        return next(createError(403, "You are not allowed to do that!"));
      }
    });
  };




//   export const verifyAdmin = (req, res, next) => {
//     if (!req.user.isAdmin) return next(createError(403, 'Admin access required'));
//     next();
//   };
  
// export const verifySeller = (req, res, next) => {
//   if (!req.user.isSeller) return next(createError(403, 'Seller access required'));
//   next();
// };



// import jwt from 'jsonwebtoken';
// import { createError } from '../lib/createError.js';

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return next(createError(401, 'Authentication required'));

//   jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
//     if (err) return next(createError(403, 'Invalid or expired token'));
    
//     req.user = {
//       id: payload.id,
//       role: payload.role,
//       isAdmin: payload.role === 'admin',
//       isSeller: payload.role === 'seller'
//     };
    
//     next();
//   });
// };
