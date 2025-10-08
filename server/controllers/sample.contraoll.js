// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Brand from "../models/brand.model.js";
import { createError } from "../lib/createError.js";
import generateTokenAndSetCookie from "../lib/generateTokenAndSetCookie.js";
import { hashToken } from "../lib/helper.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

/* ===========================
   Helper Functions
=========================== */

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Generate verification token (6 digits)
 */
const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Update existing unverified user
 */
const updateUnverifiedUser = async (user, { name, password }) => {
  const hash = await hashPassword(password);
  const verificationToken = generateVerificationToken();

  user.name = name;
  user.password = hash;
  user.verificationToken = verificationToken;
  user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();
  return verificationToken;
};

/**
 * Create new user
 */
const createNewUser = async ({ email, name, password }) => {
  const hash = await hashPassword(password);
  const verificationToken = crypto.randomInt(100000, 1000000).toString();

  const user = new User({
    email,
    password: hash,
    name,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    refreshTokens: [],
  });

  await user.save();
  return { user, verificationToken };
};

/**
 * Send verification email and set tokens
 */
const handleVerification = async (res, user, verificationToken) => {
  await sendVerificationEmail(user.email, verificationToken);
  await generateTokenAndSetCookie(res, user);
  const userPayload = { ...user._doc, password: undefined };
  return userPayload;
};

/**
 * Authenticate user credentials
 */
const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(404, "User not found");

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) throw createError(401, "Incorrect password");

  user.lastLogin = new Date();
  await user.save();

  return user;
};

/* ===========================
   Controller Functions
=========================== */

/**
 * Register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) return next(createError(400, "Email already registered"));

      const verificationToken = await updateUnverifiedUser(existingUser, { name, password });
      const userPayload = await handleVerification(res, existingUser, verificationToken);
      return res.status(200).json(userPayload);
    }

    const { user, verificationToken } = await createNewUser({ email, name, password });
    const userPayload = await handleVerification(res, user, verificationToken);

    return res.status(201).json(userPayload);
  } catch (err) {
    next(createError(500, "Registration failed"));
  }
};

/**
 * Verify Email
 */
export const verifyEmail = async (req, res, next) => {
  const { code } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findOne({
      _id: userId,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(createError(400, "Invalid or expired verification code"));
    if (user._id.toString() !== userId) return next(createError(403, "Forbidden"));

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await generateTokenAndSetCookie(res, user);
    await sendWelcomeEmail(user.email, user.name);

    const userPayload = { ...user._doc, password: undefined };
    return res.status(200).json(userPayload);
  } catch (error) {
    next(createError(500, "Server error during verification"));
  }
};

/**
 * Login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    await generateTokenAndSetCookie(res, user);

    let brand = null;
    if (user.role === "seller") {
      brand = await Brand.findOne({ sellerId: user._id });
    }

    const { password: pw, ...info } = user._doc;
    return res.status(200).json({ ...info, brand, isVerified: user.isVerified });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
export const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
          const hashed = hashToken(refreshToken);
          user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== hashed);
          await user.save();
        }
      } catch {}
    }

    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/" })
       .clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/" });

    return res.status(200).json({ success: true, message: "User has been logged out successfully" });
  } catch (err) {
    return next(createError(500, "Failed to log out"));
  }
};

/* ===========================
   Forgot & Reset Password
=========================== */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = hashToken(resetToken);

    user.resetPasswordToken = hashed;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    next(createError(500, error.message || "Error sending password reset email"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(createError(400, "Invalid or expired reset token"));

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.refreshTokens = [];
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(createError(500, error.message || "Error resetting password"));
  }
};
