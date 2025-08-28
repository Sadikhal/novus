import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js';
import { verifyToken, verifyTokenAndAdmin } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/',verifyToken,verifyTokenAndAdmin,createCategory);
router.get("/",getCategories);
router.get("/:id",getCategory);
router.put("/:id",verifyToken,verifyTokenAndAdmin,updateCategory);
router.delete("/:id",verifyToken,verifyTokenAndAdmin,deleteCategory);

export default router;