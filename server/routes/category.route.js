import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js';
import { verifyTokenAndAdmin } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/',verifyTokenAndAdmin,createCategory);
router.get("/",getCategories);
router.get("/:id",getCategory);
router.put("/:id",verifyTokenAndAdmin,updateCategory);
router.delete("/:id",verifyTokenAndAdmin,deleteCategory);

export default router;