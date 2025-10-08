import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  limit: 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8, 
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/register attempts, please wait a while.",
  },
});
