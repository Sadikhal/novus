import Category from "../models/category.model.js";
import { createError } from "../lib/createError.js";

export const createCategory = async (req, res, next) => { 
  try {
    if (!req.body.name || !req.body.image) {
      return next(createError(400, "Name and image are required"));
    }
    const existingCategory = await Category.findOne({ name: req.body.name.toLowerCase() });
    if (existingCategory) {
      return next(createError(400, "Category already exists"));
    }
    const newCategory = new Category({
      name: req.body.name.toLowerCase(),
      image: req.body.image
    });
    
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch(error) {
    console.log(error)
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createError(404, "Category not found"));
    if (req.body.name) {
      const existing = await Category.findOne({ 
        name: req.body.name.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existing) return next(createError(400, "Category name already exists"));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          name: req.body.name?.toLowerCase() || category.name,
          image: req.body.image || category.image
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

// get all categories
export const getCategories = async (req, res, next) => {
 try {
  const categories = await Category.find({});
  res.status(200).json({
   message : "All Categories List",
   categories
  });
 } catch (error) {
  console.log(error)
  next(error)
 };
};


export const getCategory = async (req, res , next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) next(createError(404, "Category not found"));
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}


export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send("category has been deleted!");
  } catch (err) {
    next(err);
};
};



