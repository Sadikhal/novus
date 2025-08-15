import express from 'express';
import { getBrandData, getBrandPerformance, getBrandProductSales,getBrandRevenuePerformance, getBrandsPerformance, getBrandsRevenuePerformance, getChartData,getFinancialData,getProductSales,getProductsPerformance,getProductsSalesPerformance,getProductsSold,getProfitData,getUserStats,getProductsRevenueTrends, getCustomerPurchases, getDashboardStats, getBrandStats, getProductStats, getCustomerStats } from '../controllers/stats.controller.js';
import { verifySeller, verifyToken, verifyTokenAndAdmin } from '../middleware/verifyTokens.js';

const router = express.Router();

router.get('/', verifyTokenAndAdmin, getChartData);
router.get('/users', verifyTokenAndAdmin, getUserStats);
router.get('/revenue', verifyTokenAndAdmin, getFinancialData);
router.get('/profits', verifyTokenAndAdmin, getProfitData);

router.get('/brands', verifyTokenAndAdmin, getBrandPerformance);
router.get('/brands-performance', verifyTokenAndAdmin, getBrandsPerformance);
router.get('/brands-revenue-performance', verifyTokenAndAdmin, getBrandsRevenuePerformance);

router.get('/orders', verifyTokenAndAdmin, getProductsSold);
router.get('/products-revenue-trends', verifyTokenAndAdmin, getProductsRevenueTrends);
router.get('/products-revenue-performance', verifyTokenAndAdmin, getProductsPerformance);
router.get('/products-sales-performance', verifyTokenAndAdmin, getProductsSalesPerformance);
router.get('/product/:productId/performance', verifySeller, getProductSales
);

router.get('/brand/:brandId/revenue-performance', verifySeller, getBrandRevenuePerformance
);

router.get('/brand/:brandId/product-sales', getBrandProductSales);
router.get('/performance/:brandId',verifySeller, getBrandData);
router.get('/customer/:customerId', verifyToken, getCustomerPurchases);
router.get('/dashboard', verifyTokenAndAdmin, getDashboardStats);
router.get('/brand-dashboard/:brandId', verifySeller, getBrandStats);
router.get('/product-stats/:productId', verifySeller, getProductStats);
router.get('/customer-stats/:customerId', verifyTokenAndAdmin, getCustomerStats);

export default router;  


