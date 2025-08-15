// backend/routes/notification.js
import express from 'express';
import { deleteNotification, getNotifications, markNotificationRead } from '../controllers/notification.controller.js';
import { verifyToken} from "../middleware/verifyTokens.js"

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.delete('/', verifyToken, deleteNotification);
router.put('/:id/read', verifyToken, markNotificationRead);

export default router;