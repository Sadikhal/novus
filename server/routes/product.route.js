import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, getSellerProduct, getSellerProducts, relatedProducts, searchProducts, updateProduct } from '../controllers/product.controller.js';
import { verifyToken, verifySeller } from '../middleware/verifyTokens.js';



const router = express.Router();

router.post('/',verifySeller,createProduct);
router.get("/",getProducts);
router.get("/seller",verifySeller,getSellerProducts);
router.get("/search/:keyword",searchProducts);
router.get("/related-products",relatedProducts);
router.get("/:productId",getProduct);
router.put("/:id",verifyToken,updateProduct);
router.delete("/:id",verifyToken,deleteProduct);
router.get("/seller/:id",verifySeller,getSellerProduct);

export default router;