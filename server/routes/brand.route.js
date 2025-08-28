import express from 'express';
import { createBrand, deleteBrand, getBrands, getSellerBrandDetails, updateBrand, getSellerBrand } from '../controllers/brand.controller.js';
import { verifySeller, verifyToken } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/', verifyToken, createBrand);
router.get("/", getBrands);
router.get("/seller",verifyToken, verifySeller, getSellerBrand);
router.get("/:id",verifyToken, verifySeller,getSellerBrandDetails);
router.put("/:id",verifyToken, verifySeller, updateBrand);
router.delete("/:id", verifyToken, verifySeller, deleteBrand);

export default router;