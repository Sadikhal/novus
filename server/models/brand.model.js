import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    sellerName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: [String],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    
    city: {
      type: String,
      required: false,
    },
    address1: {
      type: String,
      required: false,
    },
    address2: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: false,
    },
    
    experience: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;