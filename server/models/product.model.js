import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    userImage : {type:String,required : false},
    rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    brandId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Brand', 
      required: true 
    },
    brand: { type: String, required: true },
    actualPrice: { type: Number, required: true },
    sellingPrice: { type: Number },
    discount: { type: Number, default: 0 },
    category: { type: [String] }, // Array of strings
    isAvailable: {
      type : Boolean,
      required: true,
      default : true
    },
    desc: { type: String },
    starNumber: { type: Number, default: 0 },
    image: { type: [String], required: true },
    features: [{
      name: { type: String, required: true },
      detail: { type: String, required: true }
    }],

    deliveryDays: { type: Number,required:true },
    reviews: [reviewSchema],
    color: { type:[ String] },
    size: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);


