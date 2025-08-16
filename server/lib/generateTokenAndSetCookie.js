import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      isAdmin: user.role === "admin",
      isSeller: user.role === "seller",
    },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "None", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return token;
};
