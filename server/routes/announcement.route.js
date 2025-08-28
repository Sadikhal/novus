import express from 'express';
import { createAnnouncement, deleteAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement } from '../controllers/announcement.controller.js';
import { verifyToken, verifyTokenAndAdmin } from '../middleware/verifyTokens.js';



const router = express.Router();

router.post('/',verifyToken,verifyTokenAndAdmin,createAnnouncement);
router.get("/",getAnnouncements);
router.get("/:id",getAnnouncement);
router.put("/:id",verifyToken,verifyTokenAndAdmin,updateAnnouncement);
router.delete("/:id",verifyToken, verifyTokenAndAdmin,deleteAnnouncement);

export default router;