// middleware/autoRefresh.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../lib/generateTokenAndSetCookie.js";
import { hashToken } from "../lib/helper.js";


export const autoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken || !refreshToken) return next();

    try {
      jwt.verify(accessToken, process.env.JWT_KEY);
      return next();
    } catch (err) {
      if (err.name !== "TokenExpiredError") return next();
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const userId = decoded.id;
      const hashedIncoming = hashToken(refreshToken);

      const user = await User.findOneAndUpdate(
        { _id: userId, refreshTokens: hashedIncoming },
        { $pull: { refreshTokens: hashedIncoming } },
        { new: true }
      );

      if (!user) {
        await User.updateOne({ _id: userId }, { $set: { refreshTokens: [] } });
        console.warn(`[SECURITY] Refresh token reuse detected for user ${userId}. All tokens revoked.`);
        return next();
      }
      await generateTokenAndSetCookie(res, user);

      return next();
    } catch (refreshErr) {
      return next();
    }
  } catch (outerErr) {
    console.error("Auto-refresh middleware error:", outerErr);
    return next();
  }
};

export default autoRefresh;

