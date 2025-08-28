import { createCategoryBanner, createProductBanner, deleteCategoryBanner, deleteProductBanner, getCategoryBanner, getCategoryBanners, getProductBanner, getProductBanners, updateCategoryBanner, updateProductBanner } from "../controllers/banners.controller.js";
import { verifyToken, verifyTokenAndAdmin } from "../middleware/verifyTokens.js";
import express from 'express';


const router = express.Router();

router.post ('/product',verifyToken,verifyTokenAndAdmin,createProductBanner);
router.get ('/product',getProductBanners);
router.get ('/product/:id',verifyToken,verifyTokenAndAdmin,getProductBanner);
router.put('/product/:id',verifyToken,verifyTokenAndAdmin,updateProductBanner);
router.delete('/product/:id',verifyToken,verifyTokenAndAdmin,deleteProductBanner);

router.post ('/category',verifyToken,verifyTokenAndAdmin,createCategoryBanner);
router.get('/category/:id',verifyToken,verifyTokenAndAdmin,getCategoryBanner);
router.get ('/category',getCategoryBanners);
router.put('/category/:id',verifyToken,verifyTokenAndAdmin,updateCategoryBanner);
router.delete('/category/:id',verifyToken,verifyTokenAndAdmin,deleteCategoryBanner);

export default router;