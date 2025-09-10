import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, getSellerProduct, getSellerProducts, relatedProducts, searchProducts, updateProduct } from '../controllers/product.controller.js';
import { verifyToken, verifySeller } from '../middleware/verifyTokens.js';



const router = express.Router();

router.post('/',verifyToken,verifySeller,createProduct);
router.get("/",getProducts);
router.get("/seller",verifyToken,verifySeller,getSellerProducts);
router.get("/search/:keyword",searchProducts);
router.get("/related-products",relatedProducts);
router.get("/:productId",getProduct);
router.put("/:id",verifyToken,verifySeller,updateProduct);
router.delete("/:id",verifyToken,verifySeller,deleteProduct);
router.get("/seller/:id",verifyToken,verifySeller,getSellerProduct);

export default router;