import { createError } from "../lib/createError.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";


export const createReview = async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return next(createError(404, "Product not found"));

    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found"));

    if (user._id.equals(product.userId)) 
      return next(createError(403, "You can't review your own product"));

    const existingReview = product.reviews.find(
      review => review.userId.toString() === req.userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
       existingReview.userImage = user.image;
    } else {
      const newReview = {
        userId: req.userId,
        name: user.name,
        userImage: user.image, 
        rating,
        comment
      };
      product.reviews.push(newReview);
    }

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.numReviews;

    await product.save();
    res.status(200).json({ message: 'Review added/updated successfully', reviews : product.reviews});
  } catch (err) {
    next(err);
  }
};


export const getReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) 
      next(createError(404,"product not found"));
    res.status(200).json(product.reviews);
  } catch (error) {
    next(error);
  }
};


export const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product)  next(createError(404,"product not found"));

    const review = product.reviews.find((r) => r.id === req.params.id);

    if (!review)  next(createError(404,"review not found"));

    if (req.userId === review.userId || req.user.role === "admin") {
      product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.id);

      await product.save();

      res.status(200).json("The review has been deleted.");
    } else {
      return next(createError(403, "You can delete only your review!"));
    }
  } catch (err) {
    next(err);
  }
};

