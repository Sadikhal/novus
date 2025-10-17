import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { createError } from "../lib/createError.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Brand from "../models/brand.model.js";

const getDateFormat = (period) => {
  switch(period) {
    case 'daily': return '%Y-%m-%d';
    case 'monthly': return '%Y-%m';
    case 'weekly': return '%G-%V';
    case 'yearly': return '%Y';
    default: return '%Y-%m-%d';
  }
};




const getDateRange = (period) => {
  const now = new Date();
  switch(period) {
    case 'daily':
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      return { start: startOfDay, end: endOfDay };
    case 'weekly':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return { start: startOfWeek, end: endOfWeek };
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return { start: startOfMonth, end: endOfMonth };
    case 'yearly':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      endOfYear.setHours(23, 59, 59, 999);
      return { start: startOfYear, end: endOfYear };
    default:
      return { start: new Date(0), end: new Date() };
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalProductsSold: { $sum: "$quantity" }
        }
      }
    ]);

    const totalProducts = await Product.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Order.aggregate([
      { 
        $match: { 
          isCompleted: true,
          createdAt: { $gte: startOfToday, $lte: endOfToday } 
        } 
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$total" },
          todayProductsSold: { $sum: "$quantity" }
        }
      }
    ]);

    const todayProducts = await Product.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const stats = {
      total: {
        revenue: totalOrders[0]?.totalRevenue || 0,
        products: totalProducts,
        productsSold: totalOrders[0]?.totalProductsSold || 0,
        profit: totalOrders[0]?.totalRevenue * 0.017 
      },
      today: {
        revenue: todayOrders[0]?.todayRevenue || 0,
        products: todayProducts,
        productsSold: todayOrders[0]?.todayProductsSold || 0,
        profit: todayOrders[0]?.todayRevenue * 0.017
      }
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

export const getBrandStats = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const totalOrders = await Order.aggregate([
      { 
        $match: { 
          isCompleted: true,
          brandId: new mongoose.Types.ObjectId(brand._id)
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalProductsSold: { $sum: "$quantity" }
        }
      }
    ]);

    const totalProducts = await Product.countDocuments({ 
      brandId: brand._id 
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Order.aggregate([
      { 
        $match: { 
          isCompleted: true,
          brandId: new mongoose.Types.ObjectId(brand._id),
          createdAt: { $gte: startOfToday, $lte: endOfToday } 
        } 
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$total" },
          todayProductsSold: { $sum: "$quantity" }
        }
      }
    ]);

    const todayProducts = await Product.countDocuments({
      brandId: brand._id,
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

   
   
   const aggregation = await Product.aggregate([
         {
           $match: {
             brandId: new mongoose.Types.ObjectId(brand._id),
             rating: { $gt: 0 } 
           }
         },
         {
           $group: {
             _id: null,
             totalProducts: { $sum: 1 },
             totalRating: { $sum: "$rating" },
             averageRating: { $avg: "$rating" }
           }
         },
         {
           $project: {
             _id: 0,
             totalProducts: 1,
             averageRating: { $round: ["$averageRating", 1] } 
           }
         }
       ]);
   
       const result = aggregation[0] || {
         totalProducts: 0,
         averageRating: 0
       };
   
    const stats = {
      performance: {
        totalProducts: result.totalProducts,
        averageRating: result.averageRating
      },
      brand,
      total: {
        revenue: totalOrders[0]?.totalRevenue || 0,
        products: totalProducts,
        productsSold: totalOrders[0]?.totalProductsSold || 0,
        profit: (totalOrders[0]?.totalRevenue || 0) * 0.10
      },
      today: {
        revenue: todayOrders[0]?.todayRevenue || 0,
        products: todayProducts,
        productsSold: todayOrders[0]?.todayProductsSold || 0,
        profit: (todayOrders[0]?.todayRevenue || 0) * 0.10
      }
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching brand stats:", err);
    res.status(500).json({ error: "Failed to fetch brand statistics" });
  }
};


export const getCustomerStats = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const aggregation = await Order.aggregate([
      {
        $match: {
          customerId: new mongoose.Types.ObjectId(customerId),
          isCompleted: true
        }
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
          todayOrders: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $gte: ["$createdAt", startOfToday] },
                    { $lte: ["$createdAt", endOfToday] }
                  ]
                },
                "$quantity",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalRevenue: 1,
          todayOrders: 1,
          totalProfit: { $multiply: ["$totalRevenue", 0.10] }
        }
      }
    ]);

    const stats = aggregation[0] || {
      totalProducts: 0,
      todayOrders: 0,
      totalRevenue: 0,
      totalProfit: 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.log(`Customer stats error: ${err.message}`);
    next(createError(500, 'Failed to retrieve customer statistics'));
  }
};


export const getProductStats = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const aggregation = await Order.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isCompleted: true
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
          todaySales: {
            $sum: {
              $cond: [
                { $and: [
                  { $gte: ["$createdAt", startOfToday] },
                  { $lte: ["$createdAt", endOfToday] }
                ]},
                "$quantity",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalRevenue: 1,
          todaySales: 1,
          totalProfit: { $multiply: ["$totalRevenue", 0.10] }
        }
      }
    ]);

    const stats = aggregation[0] || {
      totalSales: 0,
      todaySales: 0,
      totalRevenue: 0,
      totalProfit: 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error(`Product stats error: ${err.message}`);
    next(createError(500, 'Failed to retrieve product statistics'));
  }
};


export const getChartData = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;
    const dateFormat = getDateFormat(period);
    const productsPipeline = [
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } }
    ];

    const ordersPipeline = [
      {
        $match: { isCompleted: true }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } }
    ];

    const [productsData, ordersData] = await Promise.all([
      Product.aggregate(productsPipeline),
      Order.aggregate(ordersPipeline)
    ]);

    const mergedData = {};
    
    productsData.forEach(item => {
      mergedData[item.date] = { ...mergedData[item.date], Products: item.count };
    });
    
    ordersData.forEach(item => {
      mergedData[item.date] = { ...mergedData[item.date], Orders: item.count };
    });

    const formattedData = Object.entries(mergedData).map(([date, counts]) => ({
      name: date,
      Products: counts.Products || 0,
      Orders: counts.Orders || 0
    })).sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(formattedData);
  } catch (err) {
    next(createError(500, "Failed to fetch chart data"));
  }
};
export const getUserStats = async (req, res, next) => {
  try {
    const [totalSellers, totalCustomers] = await Promise.all([
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "user" })
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          role: { $in: ["seller", "user"] }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year"
          },
          roles: {
            $push: {
              role: "$_id.role",
              count: "$count"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          sellers: {
            $ifNull: [
              { $arrayElemAt: [
                { $filter: {
                  input: "$roles",
                  as: "r",
                  cond: { $eq: ["$$r.role", "seller"] }
                }}, 0]
              },
              { count: 0 }
            ]
          },
          customers: {
            $ifNull: [
              { $arrayElemAt: [
                { $filter: {
                  input: "$roles",
                  as: "r",
                  cond: { $eq: ["$$r.role", "user"] }
                }}, 0]
              },
              { count: 0 }
            ]
          }
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);

    res.status(200).json({
      totalSellers,
      totalCustomers,
      monthlyData
    });

  } catch (err) {
    next(createError(500, "Failed to fetch user statistics"));
  }
};


export const getFinancialData = async (req, res, next) => {
  try {
    const { period = 'daily', timeRange } = req.query;
    let startDate, endDate;
    let dateFormat, matchFormat;

    if (timeRange) {
      const [startISO, endISO] = timeRange.split('_');
      startDate = new Date(startISO);
      endDate = new Date(endISO);
      dateFormat = "%Y-%m-%d";
      matchFormat = "day";
    } else {
      const now = new Date();
      switch (period.toLowerCase()) {
        case 'daily':
          startDate = new Date(now.setDate(now.getDate() - 30));
          dateFormat = "%Y-%m-%d";
          matchFormat = "day";
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 84));
          dateFormat = "%G-W%V";
          matchFormat = "week";
          break;
        case 'monthly':
          startDate = new Date(now.setFullYear(now.getFullYear() - 2));
          dateFormat = "%Y-%m";
          matchFormat = "month";
          break;
        case 'yearly':
          startDate = new Date(0);
          dateFormat = "%Y";
          matchFormat = "year";
          break;
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Invalid period. Use daily, weekly, monthly, or yearly.'
          });
      }
      endDate = new Date();
    }

    const aggregation = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          createdAt: { 
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          revenue: { $sum: "$total" }
        }
      },
      {
        $addFields: {
          expenditure: { $multiply: ["$revenue", 0.9] },
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id",
                  { $switch: {
                    branches: [
                      { case: { $eq: [matchFormat, "week"] }, then: "-1" },
                      { case: { $eq: [matchFormat, "month"] }, then: "-01" },
                      { case: { $eq: [matchFormat, "year"] }, then: "-01-01" }
                    ],
                    default: ""
                  }}
                ]
              },
              format: {
                $switch: {
                  branches: [
                    { case: { $eq: [matchFormat, "week"] }, then: "%G-W%V-%u" },
                    { case: { $eq: [matchFormat, "month"] }, then: "%Y-%m-%d" },
                    { case: { $eq: [matchFormat, "year"] }, then: "%Y-%m-%d" }
                  ],
                  default: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          date: 1,
          revenue: 1,
          expenditure: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      period: timeRange ? 'custom' : period,
      results: aggregation.length,
      data: aggregation
    });
  } catch (err) {
    console.error(`Financial stats error: ${err.message}`);
    next(createError(500, 'Failed to retrieve financial data'));
  }
};



export const getProfitData = async (req, res, next) => {
  try {
    const { period = 'daily', timeRange } = req.query;
    let startDate, endDate;
    let dateFormat, matchFormat;

    if (timeRange) {
      const [startISO, endISO] = timeRange.split('_');
      startDate = new Date(startISO);
      endDate = new Date(endISO);
      dateFormat = "%Y-%m-%d";
      matchFormat = "day";
    } else {
      const now = new Date();
      switch (period.toLowerCase()) {
        case 'daily':
          startDate = new Date(now.setDate(now.getDate() - 30));
          dateFormat = "%Y-%m-%d";
          matchFormat = "day";
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 84)); // 12 weeks
          dateFormat = "%G-W%V";
          matchFormat = "week";
          break;
        case 'monthly':
          startDate = new Date(now.setFullYear(now.getFullYear() - 2));
          dateFormat = "%Y-%m";
          matchFormat = "month";
          break;
        case 'yearly':
          startDate = new Date(0);
          dateFormat = "%Y";
          matchFormat = "year";
          break;
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Invalid period'
          });
      }
      endDate = new Date();
    }

    const aggregation = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          createdAt: { 
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          totalProfit: { $sum: { $multiply: ["$total", 0.017] } },
          orderCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id",
                  { $switch: {
                    branches: [
                      { case: { $eq: [matchFormat, "week"] }, then: "-1" },
                      { case: { $eq: [matchFormat, "month"] }, then: "-01" },
                      { case: { $eq: [matchFormat, "year"] }, then: "-01-01" }
                    ],
                    default: ""
                  }}
                ]
              },
              format: {
                $switch: {
                  branches: [
                    { case: { $eq: [matchFormat, "week"] }, then: "%G-W%V-%u" },
                    { case: { $eq: [matchFormat, "month"] }, then: "%Y-%m-%d" },
                    { case: { $eq: [matchFormat, "year"] }, then: "%Y-%m-%d" }
                  ],
                  default: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          date: 1,
          totalProfit: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      period: timeRange ? 'custom' : period,
      results: aggregation.length,
      data: aggregation
    });
  } catch (err) {
    console.error(`Profit data error: ${err.message}`);
    next(createError(500, 'Failed to retrieve profit data'));
  }
};


export const getBrandPerformance = async (req, res, next) => {
  try {
    const { period = 'daily', timeRange } = req.query;
    let startDate, endDate;
    let dateFormat, matchFormat;
    if (timeRange) {
      const [startISO, endISO] = timeRange.split('_');
      startDate = new Date(startISO);
      endDate = new Date(endISO);
      dateFormat = "%Y-%m-%d";
      matchFormat = "day";
    } else {
      const now = new Date();
      switch (period.toLowerCase()) {
        case 'daily':
          startDate = new Date(now.setDate(now.getDate() - 30));
          endDate = new Date();
          dateFormat = "%Y-%m-%d";
          matchFormat = "day";
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 84)); // 12 weeks
          endDate = new Date();
          dateFormat = "%G-W%V";
          matchFormat = "week";
          break;
        case 'monthly':
          startDate = new Date(now.setFullYear(now.getFullYear() - 2));
          endDate = new Date();
          dateFormat = "%Y-%m";
          matchFormat = "month";
          break;
        case 'yearly':
          startDate = new Date(0);
          endDate = new Date();
          dateFormat = "%Y";
          matchFormat = "year";
          break;
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Invalid period. Use daily, weekly, monthly, or yearly.'
          });
      }
    }

    // Get top and bottom brands
    const brandTotals = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$brand",
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const topBrands = brandTotals.slice(0, 15);
    const bottomBrands = brandTotals.slice(-15);
    const selectedBrands = [...topBrands, ...bottomBrands]
      .filter(b => b._id)
      .map(b => b._id);

    if (selectedBrands.length === 0) {
      return res.status(200).json({
        success: true,
        period: timeRange ? 'custom' : period,
        results: 0,
        data: []
      });
    }

    // Get time series data for selected brands
    const timeSeries = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          brand: { $in: selectedBrands },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            brand: "$brand",
            date: { $dateToString: { format: dateFormat, date: "$createdAt" } }
          },
          revenue: { $sum: "$total" }
        }
      },
      {
        $addFields: {
          parsedDate: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id.date",
                  {
                    $switch: {
                      branches: [
                        { case: { $eq: [matchFormat, "week"] }, then: "-1" },
                        { case: { $eq: [matchFormat, "month"] }, then: "-01" },
                        { case: { $eq: [matchFormat, "year"] }, then: "-01-01" }
                      ],
                      default: ""
                    }
                  }
                ]
              },
              format: {
                $switch: {
                  branches: [
                    { case: { $eq: [matchFormat, "week"] }, then: "%G-W%V-%u" },
                    { case: { $eq: [matchFormat, "month"] }, then: "%Y-%m-%d" },
                    { case: { $eq: [matchFormat, "year"] }, then: "%Y-%m-%d" }
                  ],
                  default: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          brand: "$_id.brand",
          date: "$parsedDate",
          revenue: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      period: timeRange ? 'custom' : period,
      results: timeSeries.length,
      data: timeSeries
    });
  } catch (err) {
    console.log(`Brands performance error: ${err.message}`);
    next(createError(500, 'Failed to retrieve brands performance data'));
  }
};






export const getBrandsPerformance = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', 
      sort = 'desc', 
      limit = 10,
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const brandSales = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$brandId",
          totalSold: { $sum: "$quantity" },
          ordersCount: { $sum: 1 },
          daysActive: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } }
        }
      },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brandDetails"
        }
      },
      { $unwind: "$brandDetails" },
      {
        $project: {
          _id: 0,
          brand: "$brandDetails.name",
          totalSold: 1,
          activeDays: { $size: "$daysActive" },
          avgDailySales: {
            $divide: [
              "$totalSold",
              { $size: "$daysActive" }
            ]
          }
        }
      },
      { $sort: { totalSold: sort === 'asc' ? 1 : -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json(brandSales);
  } catch (err) {
    next(createError(500, "Failed to fetch brand performance data"));
  }
};

///



export const getBrandsRevenuePerformance = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', 
      sort = 'desc', 
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$brandId",
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brandDetails"
        }
      },
      { $unwind: "$brandDetails" },
      {
        $project: {
          brand: "$brandDetails.name",
          logo: { $arrayElemAt: ["$brandDetails.logo", 0] },
          totalRevenue: 1,
          _id: 0
        }
      },
      { $sort: { totalRevenue: sort === 'asc' ? 1 : -1 } },
      { $limit: 10 }
    ];

    const brandData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(brandData);
  } catch (err) {
    next(createError(500, "Failed to fetch brand performance data"));
  }
};

export const getProductsSold = async (req, res, next) => {
  try {
    const { period = 'daily', timeRange } = req.query;
    let startDate, endDate;
    let dateFormat, matchFormat;

    if (timeRange) {
      // Handle custom date range
      const [startISO, endISO] = timeRange.split('_');
      startDate = new Date(startISO);
      endDate = new Date(endISO);
      dateFormat = "%Y-%m-%d";
      matchFormat = "day";
    } else {
      // Handle predefined periods
      const now = new Date();
      switch (period.toLowerCase()) {
        case 'daily':
          startDate = new Date(now.setDate(now.getDate() - 30));
          dateFormat = "%Y-%m-%d";
          matchFormat = "day";
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 84)); // 12 weeks
          dateFormat = "%G-W%V";
          matchFormat = "week";
          break;
        case 'monthly':
          startDate = new Date(now.setFullYear(now.getFullYear() - 2));
          dateFormat = "%Y-%m";
          matchFormat = "month";
          break;
        case 'yearly':
          startDate = new Date(0);
          dateFormat = "%Y";
          matchFormat = "year";
          break;
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Invalid period. Use daily, weekly, monthly, or yearly.'
          });
      }
      endDate = new Date();
    }

    const aggregation = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          createdAt: { 
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          totalSold: { $sum: "$quantity" }
        }
      },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id",
                  { $switch: {
                    branches: [
                      { case: { $eq: [matchFormat, "week"] }, then: "-1" },
                      { case: { $eq: [matchFormat, "month"] }, then: "-01" },
                      { case: { $eq: [matchFormat, "year"] }, then: "-01-01" }
                    ],
                    default: ""
                  }}
                ]
              },
              format: {
                $switch: {
                  branches: [
                    { case: { $eq: [matchFormat, "week"] }, then: "%G-W%V-%u" },
                    { case: { $eq: [matchFormat, "month"] }, then: "%Y-%m-%d" },
                    { case: { $eq: [matchFormat, "year"] }, then: "%Y-%m-%d" }
                  ],
                  default: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          date: 1,
          totalSold: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      period: timeRange ? 'custom' : period,
      results: aggregation.length,
      data: aggregation
    });
  } catch (err) {
    console.error(`Products sold error: ${err.message}`);
    next(createError(500, 'Failed to retrieve products sold data'));
  }
};





export const getProductsPerformance = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', 
      sort = 'desc', 
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const productRevenue = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$product",
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
          totalSold: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          product: "$productData.name",
          revenue: "$totalRevenue",
          unitsSold: "$totalSold"
        }
      },
      { $sort: { revenue: sort === 'asc' ? 1 : -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json(productRevenue);
  } catch (err) {
    next(createError(500, "Failed to fetch product performance data"));
  }
};




export const getProductsSalesPerformance = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', 
      sort = 'desc', 
      limit = 10,
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
          firstOrderDate: { $min: "$createdAt" },
          lastOrderDate: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $addFields: {
          daysActive: {
            $divide: [
              { $subtract: ["$lastOrderDate", "$firstOrderDate"] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $project: {
          productId: "$_id",
          productName: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.images", 0] },
          totalSold: 1,
          totalRevenue: 1,
          avgDailySales: {
            $cond: [
              { $eq: ["$daysActive", 0] },
              "$totalSold",
              { $divide: ["$totalSold", "$daysActive"] }
            ]
          }
        }
      },
      { $sort: { totalSold: sort === 'asc' ? 1 : -1 } },
      { $limit: parseInt(limit) }
    ];

    const productData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(productData);
  } catch (err) {
    next(createError(500, "Failed to fetch product performance data"));
  }
};


export const getProductsRevenueTrends = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', 
      sort = 'desc', 
      limit = 10,
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
          firstSale: { $min: "$createdAt" },
          lastSale: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $addFields: {
          daysActive: {
            $divide: [
              { $subtract: ["$lastSale", "$firstSale"] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $project: {
          productId: "$_id",
          productName: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.images", 0] },
          totalSold: 1,
          totalRevenue: 1,
          avgDailyRevenue: {
            $cond: [
              { $eq: ["$daysActive", 0] },
              "$totalRevenue",
              { $divide: ["$totalRevenue", "$daysActive"] }
            ]
          }
        }
      },
      { $sort: { totalRevenue: sort === 'asc' ? 1 : -1 } },
      { $limit: parseInt(limit) }
    ];

    const productData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(productData);
  } catch (err) {
    next(createError(500, "Failed to fetch product revenue trends"));
  }
};
// d7e8f0

export const getProductSales = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;
    const { productId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError(400, "Invalid product ID"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    const now = new Date();
    let startDate, endDate = new Date();
    let dateFormat;

    switch (period.toLowerCase()) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 30));
        dateFormat = "%Y-%m-%d";
        break;
      case 'monthly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        dateFormat = "%Y-%m";
        break;
      case 'yearly':
        startDate = new Date(0);
        dateFormat = "%Y";
        break;
      default:
        return res.status(400).json({ 
          success: false,
          message: 'Invalid period'
        });
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isCompleted: true,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id",
                  { $cond: { 
                    if: { $eq: [period, "monthly"] }, 
                    then: "-01", 
                    else: { $cond: {
                      if: { $eq: [period, "yearly"] },
                      then: "-01-01",
                      else: ""
                    }}
                  }}
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          date: 1,
          totalSold: 1,
          totalRevenue: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      product: product.name,
      period,
      data: salesData
    });

  } catch (err) {
    next(createError(500, 'Failed to retrieve product performance data'));
  }
};


export const getBrandRevenuePerformance = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { 
      period = 'monthly', 
      sort = 'desc', 
      limit = 10,
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          brandId: new mongoose.Types.ObjectId(brandId),
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          totalSold: 1,
          totalRevenue: 1,
          avgOrderValue: { $divide: ["$totalRevenue", "$ordersCount"] }
        }
      },
      { $sort: { totalRevenue: sort === 'asc' ? 1 : -1 } },
      { $limit: parseInt(limit) }
    ];

    const productData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(productData);
  } catch (err) {
    next(createError(500, "Failed to fetch product performance data"));
  }
};


export const getBrandProductSales = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { 
      period = 'monthly', 
      sort = 'desc', 
      limit = 10,
      timeRange 
    } = req.query;

    let dateFilter = {};
    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const { start, end } = getDateRange(period);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          brandId: new mongoose.Types.ObjectId(brandId),
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          totalSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSold: sort === 'asc' ? 1 : -1 } },
      { $limit: parseInt(limit) }
    ];

    const productData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(productData);
  } catch (err) {
    next(createError(500, "Failed to fetch product performance data"));
  }
};


export const getBrandData = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { 
      period = 'monthly', 
      timeRange 
    } = req.query;

    const dateFormat = getDateFormat(period);
    let dateFilter = {};

    if (timeRange) {
      const [startDate, endDate] = timeRange.split('_');
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const aggregationPipeline = [
      {
        $match: {
          isCompleted: true,
          brandId: new mongoose.Types.ObjectId(brandId),
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          totalRevenue: { $sum: "$total" },
          totalProductsSold: { $sum: "$quantity" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
          totalProductsSold: 1 
        }
      }
    ];

    const revenueData = await Order.aggregate(aggregationPipeline);
    res.status(200).json(revenueData);
  } catch (err) {
    next(createError(500, "Failed to fetch brand revenue data"));
  }
};

export const getCustomerPurchases = async (req, res, next) => {
  try {

    const { period = 'daily', timeRange, customerId } = req.query;
    
    if (!customerId) return next(createError(400, 'Customer ID required'));
    
    if (req.user.role !== 'admin' && req.userId !== customerId) {
      return next(createError(403, "You are not authorized to access this resource"));
    }

    let startDate, endDate;
    let dateFormat, matchFormat;

    if (timeRange) {
      const [startISO, endISO] = timeRange.split('_');
      startDate = new Date(startISO);
      endDate = new Date(endISO);
      dateFormat = "%Y-%m-%d";
      matchFormat = "day";
    } else {
      const now = new Date();
      switch (period.toLowerCase()) {
        case 'daily':
          startDate = new Date(now.setDate(now.getDate() - 30));
          dateFormat = "%Y-%m-%d";
          matchFormat = "day";
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 84)); // 12 weeks
          dateFormat = "%G-W%V"; // ISO week format
          matchFormat = "week";
          break;
        case 'monthly':
          startDate = new Date(now.setFullYear(now.getFullYear() - 2));
          dateFormat = "%Y-%m";
          matchFormat = "month";
          break;
        case 'yearly':
          startDate = new Date(0);
          dateFormat = "%Y";
          matchFormat = "year";
          break;
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Invalid period'
          });
      }
      endDate = new Date();
    }

    const aggregation = await Order.aggregate([
      {
        $match: {
          customerId: new mongoose.Types.ObjectId(customerId),
          isCompleted: true,
          createdAt: { 
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt"
            }
          },
          productCount: { $sum: "$quantity" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  "$_id",
                  { $switch: {
                    branches: [
                      { case: { $eq: [matchFormat, "week"] }, then: "-1" }, // Monday start
                      { case: { $eq: [matchFormat, "month"] }, then: "-01" },
                      { case: { $eq: [matchFormat, "year"] }, then: "-01-01" }
                    ],
                    default: ""
                  }}
                ]
              },
              format: {
                $switch: {
                  branches: [
                    { case: { $eq: [matchFormat, "week"] }, then: "%G-W%V-%u" },
                    { case: { $eq: [matchFormat, "month"] }, then: "%Y-%m-%d" },
                    { case: { $eq: [matchFormat, "year"] }, then: "%Y-%m-%d" }
                  ],
                  default: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          date: 1,
          productCount: 1,
          orderCount: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({
      success: true,
      period: timeRange ? 'custom' : period,
      results: aggregation.length,
      data: aggregation
    });
  } catch (err) {
    console.error(`Customer activity error: ${err.message}`);
    next(createError(500, 'Failed to retrieve customer data'));
  }
};