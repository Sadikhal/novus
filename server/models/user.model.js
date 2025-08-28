

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: false,
  },
  pincode: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: true,
  },
});


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline: { 
      type: Boolean, 
      default: false,
      index: true 
    },
    lastSeen: {
      type: Date,
      index: true
    },
     age: {
      type: Number,
      required: false,
    },
   pushToken: {
     type: String,
   },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    number: {
      type: String,
      required: false,
    },
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User.addresses", 
      default : null,
    },
    addresses: [addressSchema],
    image: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		resetPasswordToken: {
      type: String
    },
		resetPasswordExpiresAt: {
      type: Date,
    },
		verificationToken: {
      type : String
    },
		verificationTokenExpiresAt: 
    {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
