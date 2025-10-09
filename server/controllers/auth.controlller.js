
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Brand from "../models/brand.model.js";
import { createError } from "../lib/createError.js";
import generateTokenAndSetCookie  from "../lib/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import { hashPassword, hashToken } from "../lib/helper.js";
import jwt from "jsonwebtoken";



export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return next(createError(400, "Email already registered"));
      }

      const hash = await hashPassword(password);
      const verificationToken = crypto.randomInt(100000, 1000000).toString();

      existingUser.name = name;
      existingUser.password = hash;
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

      await existingUser.save();

      await generateTokenAndSetCookie(res, existingUser);
      await sendVerificationEmail(existingUser.email, verificationToken);

      const userPayload = { ...existingUser._doc, password: undefined };
      return res.status(200).json(userPayload);
    }

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

    await sendVerificationEmail(user.email, verificationToken);
    await generateTokenAndSetCookie(res, user);

    const userPayload = { ...user._doc, password: undefined };
    return res.status(201).json(userPayload);
  } catch (err) {
    next(createError(500, "Registration failed"));
  }
};


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
    if (user._id.toString() !== userId)
      return next(createError(403, "Forbidden: Cannot verify another user"));

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



export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found"));

   const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(401, "Incorrect password"));

    user.lastLogin = new Date();
    await user.save();


    await generateTokenAndSetCookie(res, user);
    let brand = null;
    if (user.role === "seller") {
      brand = await Brand.findOne({ sellerId: user._id });
    }

    const { password, ...info } = user._doc;
    return res.status(200).json({
      ...info,
      brand,
      isVerified: user.isVerified,
    });
  } catch (error) {
    next(createError(500, "Login failed"));
  }
};


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
      } catch (err) {
         console.warn("Logout: refresh token verify failed:", err?.message || err);
      }
    }

    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

    return res.status(200).json({ success: true, message: "User has been logged out successfully" });
  } catch (err) {
    return next(createError(500, "Failed to log out"));
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = hashToken(resetToken);

    user.resetPasswordToken = hashed;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; 

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

     const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
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
