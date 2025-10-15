import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { hashToken } from "./helper.js";

const generateTokenAndSetCookie = async (res, user, opts = {}) => {
  const accessExpiresIn = opts.accessExpiresIn || "30m";
  const refreshExpiresIn = opts.refreshExpiresIn || "7d";

  const isActualAdmin = user._id.toString() === process.env.ADMIN_ID;

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      isAdmin: isActualAdmin,
      isSeller: user.role === "seller",
      isVerified: !!user.isVerified,
    },
    process.env.JWT_KEY,
    { expiresIn: accessExpiresIn }
  );

  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshExpiresIn,
  });

  const hashedRefreshToken = hashToken(refreshToken);

  try {
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          refreshTokens: {
            $each: [hashedRefreshToken],
            $position: 0,
            $slice: 5,
          },
        },
      }
    );
  } catch (dbErr) {
    console.error("Failed to store refresh token:", dbErr);
  }

  const cookieOptionsAccess = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 60 * 1000, 
    path: "/",
  };

  const cookieOptionsRefresh = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: "/",
  };

  if (!res.headersSent) {
    try {
      res.cookie("token", accessToken, cookieOptionsAccess);
      res.cookie("refreshToken", refreshToken, cookieOptionsRefresh);
    } catch (cookieErr) {
      console.warn("Failed to set auth cookies:", cookieErr);
    }
  } else {
    console.warn("Headers already sent — skipping cookie set");
  }

  return { accessToken, refreshToken };
};

export default generateTokenAndSetCookie;
