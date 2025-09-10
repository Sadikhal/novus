import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {

   const isActualAdmin = user._id.toString() === process.env.ADMIN_ID;

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      isAdmin: isActualAdmin,
      isSeller: user.role === "seller",
    },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
 });
  return token;
};
