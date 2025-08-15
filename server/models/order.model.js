// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const OrderSchema = new Schema(
//   {
//     products: [{
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

//       quantity: {
//         type: Number,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       image: {
//         type: String,
//         required: true,
//       },
//       sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     
//     }],
   
//     customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

//     isCompleted: {
//       type: Boolean,
//       default: false,
//     },
//     payment_intent: {
//       type: String,
//       required: true,
//     },

//     total: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       type: mongoose.Schema.Types.ObjectId, ref: 'Address',
     
//     },
    
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Order", OrderSchema);

import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    brandEmail: { type: String, required: false },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true },
    image: { type: String },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isCompleted: { type: Boolean, default: false },
    payment_intent: { type: String, required: true },
    total: { type: Number, required: true },
    customerName: { type: String, required: true },
    number: { type: Number, required: true },
    pincode: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
    shippedTime: {
      type: Date,
      default: null
    },
    deliveryTime: {
      type: Date,
      default: null
    }

  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);