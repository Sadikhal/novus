import express from 'express';
import { createEvent, deleteEvent, getEvents, getEvent, updateEvent } from '../controllers/event.controller.js';
import { verifyTokenAndAdmin } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/',verifyTokenAndAdmin,createEvent);
router.get("/",getEvents);
router.get("/:id",getEvent);
router.put("/:id",verifyTokenAndAdmin,updateEvent);
router.delete("/:id",verifyTokenAndAdmin,deleteEvent);

export default router;