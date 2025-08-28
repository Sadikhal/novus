import express from 'express';
import { createEvent, deleteEvent, getEvents, getEvent, updateEvent } from '../controllers/event.controller.js';
import { verifyToken, verifyTokenAndAdmin } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/',verifyToken,verifyTokenAndAdmin,createEvent);
router.get("/",getEvents);
router.get("/:id",getEvent);
router.put("/:id",verifyToken,verifyTokenAndAdmin,updateEvent);
router.delete("/:id",verifyToken,verifyTokenAndAdmin,deleteEvent);

export default router;