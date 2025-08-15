import ProductBanner from "../models/productBanners.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import CategoryBanner from "../models/categoryBanner.model.js";
import { createError } from "../lib/createError.js";


export const createProductBanner = async (req, res, next) => { 
  try {
    const userId = req.userId;
    const { products } = req.body;

    const productIds = products.map(p => p.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    
    if (existingProducts.length !== productIds.length) {
      return next(createError(400, "One or more product IDs are invalid"));
    }

    const productBanner = new ProductBanner({
      userId,
      ...req.body
    });
    
    const savedProductBanner = await productBanner.save();
    res.status(201).json(savedProductBanner);
  } catch(error) {
    console.log(error)
    next(error);
  }
};


export const getProductBanners = async (req, res, next) => {
  try {
    const banners = await ProductBanner.find()
      .populate({
        path: 'products.productId',
        select: 'name brand actualPrice sellingPrice discount image'
      });
    
    // Format response to include product details
    const formattedBanners = banners.map(banner => ({
      ...banner.toObject(),
      products: banner.products.map(product => ({
        ...product.toObject(),
        productId: product.productId ? {
          _id: product.productId._id,
          name: product.productId.name,
          brand: product.productId.brand,
          actualPrice: product.productId.actualPrice,
          sellingPrice: product.productId.sellingPrice,
          discount: product.productId.discount,
          image: product.productId.image
        } : null
      }))
    }));

    res.status(200).json(formattedBanners);
  } catch(error) {
    next(error);
  }
};


export const getProductBanner = async (req, res, next) => {
  try {
    const banner = await ProductBanner.findById(req.params.id).populate({
      path: 'products.productId',
      select: 'name brand actualPrice sellingPrice discount image'
    }).lean();

    if (!banner) {
      return next(createError(404, "Product banner not found"));
    }
    // Clean subdocuments and format response
    const formattedBanner = {
      ...banner,
      products: banner.products.map(product => ({
        _id: product._id,
        url: product.url,
        productId: product.productId ? {
          _id: product.productId._id,
          name: product.productId.name,
          brand: product.productId.brand,
          actualPrice: product.productId.actualPrice,
          sellingPrice: product.productId.sellingPrice,
          discount: product.productId.discount,
          image: product.productId.image
        } : null
      }))
    };

    res.status(200).json(formattedBanner);
  } catch(error) {
    next(error);
  }
};

export const updateProductBanner = async (req, res, next) => {
  try {
    const { products, ...updateData } = req.body;
    
    if (products) {
      const productIds = products.map(p => p.productId);
      const existingProducts = await Product.find({ _id: { $in: productIds } });
      
      if (existingProducts.length !== productIds.length) {
        return next(createError(400, "One or more product IDs are invalid"));
      }
    }

    const updatedBanner = await ProductBanner.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );

   
    if (products) {
      updatedBanner.products = products;
      await updatedBanner.save();
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    next(error);
  }
};


export const deleteProductBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductBanner.findByIdAndDelete(id);
    res.status(200).send("Banner has been deleted!");
  } catch (err) {
    next(err);
};
};

export const createCategoryBanner = async (req, res, next) => { 
  try {
    const { title, categories } = req.body;
    const userId = req.userId; 
   
    const categoryData = await Promise.all(
      categories.map(async item => {
        const category = await Category.findById(item.categoryId);
        return {
          categoryId: item.categoryId,
          image: item.image,
          url: item.url,
          name: category.name,
          title: item.title,
          title2: item.title2 || ''
        };
      })
    );

    const newBanner = new CategoryBanner({
      userId,
      title,
      categories: categoryData,
      isActive: true
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCategoryBanners = async (req, res, next) => {
  try {
    const banners = await CategoryBanner.find({});
    res.status(200).json(banners);
  } catch (err) {
    console.log(err)
     next(err);
  }
};


export const getCategoryBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banners = await CategoryBanner.findById(id);
    res.status(200).json(banners);
  } catch (err) {
     next(err);
  }
};


export const updateCategoryBanner = async (req, res,next) => {
  try {
    const categoryBanner = await CategoryBanner.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body,
      },
      { new : true }
    );
    res.status(200).json(categoryBanner);
  } catch (error) {
    res.status(500).json(error);

  };
};


export const deleteCategoryBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CategoryBanner.findByIdAndDelete(id);
    res.status(200).send("Category Banner has been deleted!");
  } catch (err) {
    next(err);
};
};







