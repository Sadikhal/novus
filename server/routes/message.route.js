import express from "express";
import {
  createMessage,
  updateMessage,
  deleteMessage,
  reactToMessage,
  getMessages
} from "../controllers/message.controller.js";
import { verifyToken} from "../middleware/verifyTokens.js"

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.delete("/:id", verifyToken, deleteMessage);
router.post("/:id", verifyToken, createMessage);
router.put("/:id", verifyToken,updateMessage );
router.post("/react/:messageId", verifyToken, reactToMessage);

export default router;
