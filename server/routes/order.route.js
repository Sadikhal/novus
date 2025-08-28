import express from "express";
import { verifySeller, verifyToken, verifyTokenAndAdmin, verifyUser } from "../middleware/verifyTokens.js";
import { intent, confirm, customerWiseOrders, SellerWiseOrders, getOrderProduct, deleteOrders, getOrders, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/user/:userId", verifyToken,verifyUser, customerWiseOrders);
router.get("/:orderId", verifyToken, getOrderProduct);
router.get("/seller/:id", verifyToken,verifySeller, SellerWiseOrders);
router.post("/create-payment-intent", verifyToken, intent);
router.put("/confirm", verifyToken, confirm);
router.delete("/:id", verifyToken,verifyTokenAndAdmin, deleteOrders);
router.get("/", verifyToken,verifyTokenAndAdmin, getOrders);
router.put("/:id", verifyToken,verifySeller, updateOrder);

export default router;


