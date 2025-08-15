import { createCategoryBanner, createProductBanner, deleteCategoryBanner, deleteProductBanner, getCategoryBanner, getCategoryBanners, getProductBanner, getProductBanners, updateCategoryBanner, updateProductBanner } from "../controllers/banners.controller.js";
import { verifyTokenAndAdmin } from "../middleware/verifyTokens.js";
import express from 'express';


const router = express.Router();

router.post ('/product',verifyTokenAndAdmin,createProductBanner);
router.get ('/product',getProductBanners);
router.get ('/product/:id',verifyTokenAndAdmin,getProductBanner);
router.put('/product/:id',verifyTokenAndAdmin,updateProductBanner);
router.delete('/product/:id',verifyTokenAndAdmin,deleteProductBanner);

router.post ('/category',verifyTokenAndAdmin,createCategoryBanner);
router.get('/category/:id',verifyTokenAndAdmin,getCategoryBanner);
router.get ('/category',getCategoryBanners);
router.put('/category/:id',verifyTokenAndAdmin,updateCategoryBanner);
router.delete('/category/:id',verifyTokenAndAdmin,deleteCategoryBanner);

export default router;