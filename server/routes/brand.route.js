import express from 'express';
import { createBrand, deleteBrand, getBrands, getSellerBrandDetails, updateBrand, getSellerBrand } from '../controllers/brand.controller.js';
import { verifySeller, verifyToken } from '../middleware/verifyTokens.js';


const router = express.Router();

router.post('/', verifyToken, createBrand);
router.get("/", getBrands);
router.get("/seller", verifySeller, getSellerBrand); // Moved above :id route
router.get("/:id", verifySeller,getSellerBrandDetails);
router.put("/:id", verifySeller, updateBrand);
router.delete("/:id", verifySeller, deleteBrand);

export default router;