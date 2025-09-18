

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Brand from "../models/brand.model.js";
import { createError } from "../lib/createError.js";
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";



export const register = async (req, res, next) => {
  try {
    const { email, password, name  } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return next(createError(400, "Email already registered"));
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

      existingUser.name = name;
      existingUser.password = hash;
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

      await existingUser.save();
    const token =  generateTokenAndSetCookie(res, existingUser);
      await sendVerificationEmail(existingUser.email, verificationToken);

      return res.status(200).json({
        success: true,
        message: "New verification email sent",
        user: {
          ...existingUser._doc,
          password: undefined,
        },
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hash,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    const token = generateTokenAndSetCookie(res, user);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    next(err);
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
    if (!user) {
      return next(createError(400, "Invalid or expired verification code"));
    }
    if (user._id.toString() !== userId) {
      return next(createError(403, "Forbidden: Cannot verify another user"));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    next(createError(500, "Server error during verification"));
  }
};

export const login = async (req,res ,next) => {
  try {
    const user = await User.findOne({
      email : req.body.email });
    
      if (!user) return next(createError(404,"User not found"));
      const isCorrect = bcrypt.compareSync(req.body.password , user.password);
      if(!isCorrect) return next(createError(404,"wrong password!"));

      generateTokenAndSetCookie(res, user);
      user.lastLogin = new Date();
      await user.save();

      let brand = null;
      if (user.role === 'seller') {
        brand = await Brand.findOne({ sellerId: user._id });
    }
     const {password, ...info } = user._doc;
     res
     .status(200)
     .send({
        ...info,
        brand,
      isVerified: user.isVerified
     });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logOut = async(req, res, next) => {
  try {
    res
      .clearCookie("token", {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .status(200)
      .json({ message: "User has been logged out" });
  } catch (err) {
    next(createError(500, "Failed to log out"));
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      await user.save();
      const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetURL);
      res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
      res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password,confirmPassword } = req.body;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
   
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);
		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};
