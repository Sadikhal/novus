// user.routes.js
import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
  getUsers,
  updateAddress,
  deleteAddress,
  addOrUpdateAddress,
  addAddress,
  getNotificationNumber,
  getSellers,
  getUserDetails
} from "../controllers/user.controller.js";
import { verifyUser, verifyToken, verifyTokenAndAdmin } from "../middleware/verifyTokens.js";

const router = express.Router();

router.get("/notifications", verifyToken, getNotificationNumber);
router.post("/address", verifyToken, addAddress);
router.put("/address/:addressId", verifyToken, updateAddress);
router.delete("/address/:addressId", verifyToken, deleteAddress);

router.put('/update/:id',verifyToken, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/profile", verifyToken, getUser);

router.get("/:id", verifyTokenAndAdmin, getUserDetails);
router.get("/", verifyTokenAndAdmin, getUsers);
router.get("/sellers", verifyTokenAndAdmin, getSellers);
router.post("/addresses", verifyToken, addOrUpdateAddress);

export default router;