import express from "express";
import {
  getSingleConversation,
  getConversations,
  createConversation,
  readConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken} from "../middleware/verifyTokens.js"

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.get("/:conversationId", verifyToken, getSingleConversation);
router.post("/", verifyToken, createConversation);
router.put("/read/:conversationId", verifyToken, readConversation);

export default router;
