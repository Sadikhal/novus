import { createError } from "../lib/createError.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Brand from "../models/brand.model.js";
import User from "../models/user.model.js";



export const createProduct = async (req, res, next) => {
  try {
    const { actualPrice, sellingPrice,features,brandId, ...rest } = req.body;
    const finalSellingPrice = sellingPrice || actualPrice;
    let brand;

    if (!req.isAdmin) {
      if (brandId || req.body.brand) {
        return next(createError(403, "Sellers cannot specify brand information"));
      }

      const brandDoc = await Brand.findOne({
        sellerId: req.userId });
      if (!brandDoc) {
        return next(createError(400, "Seller does not have a registered brand"));
      }
      brand = brandDoc;
    } 
    else {
      if (!brandId) {
        return next(createError(400, "Brand ID is required for admin product creation"));
      }

      const brandDoc = await Brand.findById(brandId);
      if (!brandDoc) {
        return next(createError(404, "Brand not found"));
      }
      brand = brandDoc;
    }
    const sellerId = req.isAdmin ? brand.sellerId : req.userId;
    const discount = finalSellingPrice < actualPrice 
      ? Math.round(((actualPrice - finalSellingPrice) / actualPrice) * 100)
      : 0;

    const newProduct = new Product({
      userId: sellerId,
      actualPrice,
      sellingPrice: finalSellingPrice,
      discount,
      brand: brand.name,
      brandId: brand._id,
      features: features || [],
      ...rest
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.log(err)
    next(err);
  }
};


  export const deleteProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) next(createError(404, "Product not found!"));

      if (product.userId !== req.userId && req.user.role !== "admin")
        return next(createError(403, "You can delete only your Product!"));
  
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("product has been deleted");
    } catch (err) {
      next(err);
    }
  };
  

  export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) next(createError(404, "Product not found!"));

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
    }).limit(12); 

     const brand = await Brand.findOne({
       brand : product.brand
    })
    res.status(200).json({product,similarProducts,brand});
  } catch (err) {
    next(err);
  }
};


export const getSellerProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {sort = 'newest'} = req.query;
    const sortOptions = {createdAt: -1};
    if(sort === 'oldest'){
     sortOptions.createdAt = 1;
    }
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.userId && !req.isAdmin) { 
      return next(createError(401, "Not authorized"));
    }
    if (!product) next(createError(404, "Product not found!"));

    const brand = await Brand.findOne({
       brand : product.brand
    })
   const orders = await Order.find({
    product : product._id
   }).sort(sortOptions);
    res.status(200).json({product,brand,orders});
  } catch (err) {
    next(err);
  }
};


export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { name: regEx },
        { desc: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const getSellerProducts = async (req, res, next) => {
  try {
   const {sort = 'newest'} = req.query;
   const sortOptions = {createdAt: -1};

   if(sort === 'oldest'){
    sortOptions.createdAt = 1;
   }

    const brand = await Brand.findOne({ sellerId: req.userId })
    if (!brand) return next(createError(404, "Brand not found"));

    const products = await Product.find({
      sellerId: req.userId,
      brand: brand.name
    }).sort(sortOptions);


    res.status(200).json({
      products
    });
   
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const getProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const { 
    category = "", 
    brand = "", 
    color = "", 
    sortBy = "newest", 
    search = "",
    minPrice: queryMinPrice,
    maxPrice: queryMaxPrice 
  } = req.query;

  let filters = {};

  let minPrice = queryMinPrice ? parseInt(queryMinPrice) : undefined;
  let maxPrice = queryMaxPrice ? parseInt(queryMaxPrice) : undefined;
  let processedSearch = search;

  if (minPrice === undefined && maxPrice === undefined) {
    const pricePatterns = [
      { regex: /(under|below|less than)\s*\$?(\d+)/i, type: 'max' },
      { regex: /(over|above|more than)\s*\$?(\d+)/i, type: 'min' },
      { regex: /(\d+)\s*-\s*\$?(\d+)/i, type: 'range' }
    ];

    pricePatterns.forEach(pattern => {
      const match = processedSearch.match(pattern.regex);
      if (match) {
        if (pattern.type === 'max') {
          maxPrice = parseInt(match[2]);
          processedSearch = processedSearch.replace(match[0], '');
        } else if (pattern.type === 'min') {
          minPrice = parseInt(match[2]);
          processedSearch = processedSearch.replace(match[0], '');
        } else if (pattern.type === 'range') {
          minPrice = parseInt(match[1]);
          maxPrice = parseInt(match[2]);
          processedSearch = processedSearch.replace(match[0], '');
        }
      }
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.actualPrice = {};
    if (minPrice !== undefined) filters.actualPrice.$gte = minPrice;
    if (maxPrice !== undefined) filters.actualPrice.$lte = maxPrice;
  }

  const categoryArray = category ? category.split(",") : [];
  const brandArray = brand ? brand.split(",") : [];

  if (categoryArray.length) {
    filters.category = { 
      $in: categoryArray.map(c => new RegExp(`\\b${c.trim()}\\b`, 'i')) 
    };
  }

  if (brandArray.length) {
    filters.brand = { 
      $in: brandArray.map(b => new RegExp(`\\b${b.trim()}\\b`, 'i')) 
    };
  }

  if (color) {
    filters.color = { 
      $regex: new RegExp(color.trim(), 'i') 
    };
  }

  const searchWords = processedSearch.trim().split(/\s+/).filter(word => word.length > 0);
  const pipeline = [];

  pipeline.push({ $match: filters });

  if (searchWords.length > 0) {
    pipeline.push({
      $addFields: {
        score: {
          $sum: searchWords.map(word => ({
            $cond: [
              { $or: [
                { $regexMatch: { input: "$name", regex: word, options: "i" } },
                { $regexMatch: { input: { $ifNull: ["$desc", ""] }, regex: word, options: "i" } },
                { 
                  $anyElementTrue: {
                    $map: {
                      input: "$category",
                      as: "cat",
                      in: { 
                        $regexMatch: { 
                          input: { $toString: "$$cat" }, 
                          regex: word, 
                          options: "i" 
                        } 
                      }
                    }
                  }
                },
                { $regexMatch: { input: "$brand", regex: word, options: "i" } },
                { 
                  $anyElementTrue: {
                    $map: {
                      input: "$color",
                      as: "col",
                      in: { 
                        $regexMatch: { 
                          input: { $toString: "$$col" }, 
                          regex: word, 
                          options: "i" 
                        } 
                      }
                    }
                  }
                }
              ]},
              1,
              0
            ]
          }))
        }
      }
    });

    pipeline.push({ $match: { score: { $gt: 0 }} });
  }

  let sortCriteria = {};
  if (searchWords.length > 0) sortCriteria.score = -1;

  switch(sortBy) {
    case "price-lowtohigh": sortCriteria.actualPrice = 1; break;
    case "price-hightolow": sortCriteria.actualPrice = -1; break;
    case "newest": sortCriteria.createdAt = -1; break;
    case "oldest": sortCriteria.createdAt = 1; break;
    default: sortCriteria.actualPrice = 1;
  }
  pipeline.push({ $sort: sortCriteria });
  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  try {
    const products = await Product.aggregate(pipeline);
    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasMore = page * limit < totalProducts;

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
        hasMore
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



export const relatedProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product
      .find({
        categoryName: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(createError(404, "Product not found!"));
    }

    if (req.user.role === "seller") {
      const sellerBrand = await Brand.findOne({ sellerId: req.userId });
      
      if (!sellerBrand) {
        return next(createError(403, "You don't have a brand to update products!"));
      }
      
      if (product.brandId.toString() !== sellerBrand._id.toString()) {
        return next(createError(403, "You can only update products from your own brand!"));
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
