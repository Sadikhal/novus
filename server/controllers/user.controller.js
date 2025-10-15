import User from "../models/user.model.js"
import {createError} from "../lib/createError.js"
import Conversation from "../models/conversation.model.js";
import Order from "../models/order.model.js";


export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUserData } = updatedUser._doc;
    res.status(200).json(safeUserData);
  } catch (err) {
      console.log("e",err);

    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
  } catch (err) {
    next(err);
  }
};


export const getUsers = async (req, res, next) => {
  try {
    const { sort = "newest" } = req.query;
    const sortOptions = { createdAt: -1 };

    if (sort === "oldest") {
      sortOptions.createdAt = 1;
    }

    const users = await User.find({
      $or: [{ role: "user" }, { role: "seller" }],
      isVerified: true, 
    }).sort(sortOptions);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};



export const getSellers = async (req, res, next) => {
  try {


    const {sort = "newest"} = req.query;
    const sortOptions = { createdAt: -1 };


    if (sort === "oldest") {
      sortOptions.createdAt = 1;
    }

    const user = await User.find({
      role: "seller"
    }).sort(sortOptions);;
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.userId;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return next(createError(404, "user not found"));
    }
    const user = {
      ...userDetails._doc,
      password: undefined,
      isVerified: userDetails.isVerified
    };
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { sort = 'newest' } = req.query;
    const sortOptions = { createdAt: -1 };

    if (sort === "oldest") {
      sortOptions.createdAt = 1;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const address = user.addresses.find(
      (addr) => addr._id.toString() === user.defaultAddress?.toString()
    );

    const orders = await Order.find({
      customerId: user._id
    }).sort(sortOptions);
    
    res.status(200).json({ 
      user, 
      defaultAddress: address,
      orders 
    });
  } catch (err){ 
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  const { name, city, address1, address2, pincode, state, number } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found"));
    const newAddress = {
      name,
      city,
      address1,
      address2,
      pincode,
      state,
      number,
    };
    user.addresses.push(newAddress);
    user.defaultAddress = user.addresses[user.addresses.length - 1]._id;
    await user.save();
    const { password, ...safeUserData } = user._doc;
    res.status(201).json(safeUserData);
  } catch (err) {
    next(err);
  }
};


export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found"));

    const address = user.addresses.id(req.params.addressId);
    if (!address) return next(createError(404, "Address not found"));
    
    address.set(req.body);
    await user.save();
    
    const { password, ...safeUserData } = user._doc;
    res.status(200).json(safeUserData);
  } catch (err) {
    console.log("e", err);
    next(err);
  }
};



export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return next(createError(404, "User not found"));

        user.addresses.pull({ _id: req.params.addressId });
        await user.save();
        
        res.status(200).json(user.addresses);
    } catch (err) {
        next(err);
    }

  };
  export const addOrUpdateAddress = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return next(createError(404, "User not found"));
      const { address } = req.body;
      if (!address || typeof address !== "object") {
        return next(createError(400, "Address data is missing or invalid"));
      }
      if (!user.addresses) {
        user.addresses = [];
      }
      if (address._id) {
        const existingAddressIndex = user.addresses.findIndex(
          (a) => a._id.toString() === address._id
        );
  
        if (existingAddressIndex !== -1) {
          user.addresses[existingAddressIndex] = { ...user.addresses[existingAddressIndex], ...address };
        } else {
          return next(createError(404, "Address not found for update"));
        }
      } else {
        user.addresses.push(address);
      }
      await user.save();
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  };

  export const getNotificationNumber = async (req, res) => {
    const userId = req.userId;
  
    try {
      const count = await Conversation.countDocuments({
        members: userId,
        seenBy: { $nin: [userId] }
      });
  
      res.status(200).json(count);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get notification count" });
    }
  };
  