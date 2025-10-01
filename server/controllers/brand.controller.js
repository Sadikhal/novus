import { createError } from "../lib/createError.js";
import Brand from "../models/brand.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";


export const createBrand = async (req, res, next) => { 
  try {
    const sellerId = req.userId;

    const user = await User.findById(sellerId)
    const existingNameBrand = await Brand.findOne({ name: req.body.name });
    if (existingNameBrand) {
      return next(createError(400, "Brand name is already taken"));
    }

    const existingSellerBrand = await Brand.findOne({ sellerId });
    if (existingSellerBrand) {
      return next(createError(400, "Seller can only have one brand"));
    }

    const brand = new Brand({ 
      sellerId,
      email:user.email,
      ...req.body,
    });

    const savedBrand = await brand.save();

    if (user.role !== "seller") {
      user.role = "seller";
      await user.save();
    }
    res.status(201).json({ brand: savedBrand, user });
  } catch(error) {
    console.log(error)
    next(error);
  }
};

// get all categories
export const getBrands = async (req, res, next) => {
 try {
  const { sort = 'newest' } = req.query;
  const sortOptions = { createdAt: -1 }; 
  
  if (sort === "oldest") {
    sortOptions.createdAt = 1;
  }
  const brands = await Brand.find().sort(sortOptions);
  res.status(200).json({
   message : "All brands List",
   brands
  });
 } catch (error) {
  next(error)
 };
};


export const getSellerBrandDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sort = 'newest' } = req.query;
    const sortOptions = { createdAt: -1 };

    if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    }

    const brand = await Brand.findById(id);
    if (!brand) return next(createError(404, "Brand not found"));

    const seller = await User.findById(brand.sellerId).select('name email role _id');
    if (!seller) return next(createError(404, "Seller not found"));

    if (brand.sellerId.toString() !== req.userId && !req.isAdmin) {
      return next(createError(403, "Not authorized"));
    }

    const products = await Product.find({
      brandId: id,
      sellerId: brand.sellerId
    }).sort(sortOptions);

    const orders = await Order.find({
      brandId: id
    }).sort(sortOptions);

    let performance = {
      totalProducts: 0,
      averageRating: 0
    };

    try {
      const aggregation = await Product.aggregate([
        {
          $match: {
            brandId: new mongoose.Types.ObjectId(id),
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

      if (aggregation.length > 0) {
        performance = aggregation[0];
      }
    } catch (aggError) {
      console.error("Aggregation error:", aggError);
    }

    res.status(200).json({
      seller,
      brand,
      products,
      orders,
      performance
    });
  } catch (error) {
    console.log("Error in getSellerBrandDetails:", error);
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
     
    const brand = await Brand.findById(id);
    if (!brand) {
      return next(createError(404, "Brand not found"));
    }
    if (brand.sellerId.toString() !== req.userId && !req.isAdmin) { 
      return next(createError(403, "Not authorized to update this brand"));
    }
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      id, 
      { $set: req.body },
      { new: true }
    );
    
    res.status(200).json({
      message: "Brand updated successfully",
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error("Error updating brand:", error);
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (brand.sellerId.toString() !== req.userId && !req.isAdmin) { 
      console.log(req.isAdmin)
      return next(createError(401, "Not authorized"));
    }
    await Brand.findByIdAndDelete(id);
    res.status(200).send("brand has been deleted!");
  } catch (err) {
    console.log(err)
    next(err);
};
};


export const getSellerBrand = async (req, res , next) => {
  try {
    const brand = await Brand.find({sellerId : req.userId});
    if (!brand) next(createError(404, "brand not found"));
     
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

    res.status(200).json(
      {
        message : "brand details",
        brand,
        result
      }
    );
  } catch (error) {
    next(error);
  }
}
