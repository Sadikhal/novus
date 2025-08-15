import express from 'express';
import { createAnnouncement, deleteAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement } from '../controllers/announcement.controller.js';
import { verifyTokenAndAdmin } from '../middleware/verifyTokens.js';



const router = express.Router();

router.post('/',verifyTokenAndAdmin,createAnnouncement);
router.get("/",getAnnouncements);
router.get("/:id",getAnnouncement);
router.put("/:id",verifyTokenAndAdmin,updateAnnouncement);
router.delete("/:id",verifyTokenAndAdmin,deleteAnnouncement);

export default router;