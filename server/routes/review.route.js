import express from 'express';
import { verifyToken } from '../middleware/verifyTokens.js';
import { createReview, deleteReview, getReviews } from '../controllers/review.controller.js';


const router = express.Router();

router.post('/:productId',verifyToken,createReview);
router.get("/:productId",getReviews);
router.delete("/:id",verifyToken,deleteReview);

export default router;