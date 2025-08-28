import express from 'express';
import { getBrandData, getBrandPerformance, getBrandProductSales,getBrandRevenuePerformance, getBrandsPerformance, getBrandsRevenuePerformance, getChartData,getFinancialData,getProductSales,getProductsPerformance,getProductsSalesPerformance,getProductsSold,getProfitData,getUserStats,getProductsRevenueTrends, getCustomerPurchases, getDashboardStats, getBrandStats, getProductStats, getCustomerStats } from '../controllers/stats.controller.js';
import { verifyToken, verifySeller,verifyTokenAndAdmin } from '../middleware/verifyTokens.js';

const router = express.Router();

router.get('/', verifyToken,verifyTokenAndAdmin, getChartData);
router.get('/users', verifyToken,verifyTokenAndAdmin, getUserStats);
router.get('/revenue', verifyToken,verifyTokenAndAdmin, getFinancialData);
router.get('/profits', verifyToken,verifyTokenAndAdmin, getProfitData);

router.get('/brands', verifyToken,verifyTokenAndAdmin, getBrandPerformance);
router.get('/brands-performance', verifyToken,verifyTokenAndAdmin, getBrandsPerformance);
router.get('/brands-revenue-performance', verifyToken,verifyTokenAndAdmin, getBrandsRevenuePerformance);

router.get('/orders', verifyToken,verifyTokenAndAdmin, getProductsSold);
router.get('/products-revenue-trends', verifyToken,verifyTokenAndAdmin, getProductsRevenueTrends);
router.get('/products-revenue-performance', verifyToken,verifyTokenAndAdmin, getProductsPerformance);
router.get('/products-sales-performance', verifyToken,verifyTokenAndAdmin, getProductsSalesPerformance);
router.get('/product/:productId/performance', verifyToken,verifySeller, getProductSales
);

router.get('/brand/:brandId/revenue-performance', verifyToken,verifySeller, getBrandRevenuePerformance
);

router.get('/brand/:brandId/product-sales', getBrandProductSales);
router.get('/performance/:brandId',verifyToken,verifySeller, getBrandData);
router.get('/customer/:customerId', verifyToken, getCustomerPurchases);
router.get('/dashboard', verifyToken,verifyTokenAndAdmin, getDashboardStats);
router.get('/brand-dashboard/:brandId', verifyToken,verifySeller, getBrandStats);
router.get('/product-stats/:productId', verifyToken,verifySeller, getProductStats);
router.get('/customer-stats/:customerId', verifyToken,verifyTokenAndAdmin, getCustomerStats);

export default router;  


