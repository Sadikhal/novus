import crypto from "crypto";
import bcrypt from "bcryptjs";

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");


export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
