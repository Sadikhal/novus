
// import Order from "../models/order.model.js";
// import Product from "../models/product.model.js";
// import Stripe from "stripe";
// import User from "../models/user.model.js";
// import { sendOrderSuccessEmail } from "../mailtrap/emails.js";
// import Brand from "../models/brand.model.js";

// export const intent = async (req, res, next) => {
//   const stripe = new Stripe(process.env.STRIPE);
  
//   try {
//     const { products, address } = req.body;

//     if (!address || !address.name || !address.pincode || !address.number) {
//       return res.status(400).json({ message: "Invalid address data" });
//     }

//     if (!products || !Array.isArray(products)) {
//       return res.status(400).json({ message: "Invalid products data" });
//     }

//     const productDetails = await Promise.all(
//       products.map(async (item) => {
//         const product = await Product.findById(item.id);
//         if (!product) throw new Error(`Product ${item.id} not found`);
//         return { ...product._doc, quantity: item.quantity };
//       })
//     );

//     const totalAmount = productDetails.reduce((sum, product) => {
//       return sum + (product.sellingPrice * product.quantity * 100);
//     }, 0);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     const orderPromises = productDetails.map(product => {
//       const addressString = [
//         address.address1,
//         address.address2,
//         `${address.city}, ${address.state}`,
//         `Pincode: ${address.pincode}`
//       ].filter(Boolean).join(', ');

//       const newOrder = new Order({
//         product: product._id,
//         quantity: product.quantity,
//         price: product.sellingPrice,
//         brand: product.brand,
//         brandId: product.brandId,
//         brandEmail:product.brand?.email,
//         name: product.name,
//         image: product.image[0],
//         sellerId: product.userId,
//         customerId: req.userId,
//         payment_intent: paymentIntent.id,
//         total: product.sellingPrice * product.quantity,
//         customerName: address.name,
//         city: address.city,
//         state: address.state,
//         number: address.number,
//         pincode: address.pincode,
//         address: addressString
//       });

//       return newOrder.save();
//     });

//     await Promise.all(orderPromises);
//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



// export const confirm = async (req, res, next) => {
//   try {
//     const { payment_intent } = req.body;
//     const result = await Order.updateMany(
//       { payment_intent },
//       { $set: { isCompleted: true } }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ error: "Orders not found" });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) return next(createError(404, "User not found"));

//     const orders = await Order.find({ payment_intent })
//       .populate('sellerId', 'email');

//     const formattedOrders = orders.map(order => ({
//       ...order.toObject(),
//       productName: order.name || 'Product not available',
//       productPrice: order.price || 0,
//       sellerEmail: order?.sellerEmail || 'No seller email',
//       customerName: order.customerName,
//       contactNumber: order.number,
//       deliveryAddress: order.address
//     }));

//     await sendOrderSuccessEmail(user.email, formattedOrders);
//     console.log(formattedOrders,user.email);
//     res.status(200).send("All orders have been confirmed.");
//   } catch (err) {
//     console.error("Order confirmation error:", err);
//     next(err);
//   }
// };


import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import User from "../models/user.model.js";
import { sendOrderSuccessEmail } from "../mailtrap/emails.js";
import Brand from "../models/brand.model.js";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);
  
  try {
    const { products, address } = req.body;

    if (!address || !address.name || !address.pincode || !address.number) {
      return res.status(400).json({ message: "Invalid address data" });
    }

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.id);
        if (!product) throw new Error(`Product ${item.id} not found`);
        return { ...product._doc, quantity: item.quantity, size: item.size };
      })
    );

    const totalAmount = productDetails.reduce((sum, product) => {
      return sum + (product.sellingPrice * product.quantity * 100);
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    const orderPromises = productDetails.map(product => {
      const addressString = [
        address.address1,
        address.address2,
        `${address.city}, ${address.state}`,
        `Pincode: ${address.pincode}`
      ].filter(Boolean).join(', ');

      const newOrder = new Order({
        product: product._id,
        quantity: product.quantity,
        price: product.sellingPrice,
        size: product.size,
        brand: product.brand,
        brandId: product.brandId,
        brandEmail: product.brand?.email,
        name: product.name,
        image: product.image[0],
        sellerId: product.userId,
        customerId: req.userId,
        payment_intent: paymentIntent.id,
        total: product.sellingPrice * product.quantity,
        customerName: address.name,
        city: address.city,
        state: address.state,
        number: address.number,
        pincode: address.pincode,
        address: addressString
      });

      return newOrder.save();
    });

    await Promise.all(orderPromises);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const confirm = async (req, res, next) => {
  try {
    const { payment_intent } = req.body;
    const result = await Order.updateMany(
      { payment_intent },
      { $set: { isCompleted: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Orders not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found"));

    const orders = await Order.find({ payment_intent })
      .populate('sellerId', 'email');

    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      productName: order.name || 'Product not available',
      productPrice: order.price || 0,
      sellerEmail: order?.sellerEmail || 'No seller email',
      customerName: order.customerName,
      contactNumber: order.number,
      deliveryAddress: order.address
    }));

    await sendOrderSuccessEmail(user.email, formattedOrders);
    console.log(formattedOrders, user.email);
    res.status(200).send("All orders have been confirmed.");
  } catch (err) {
    console.error("Order confirmation error:", err);
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.userId !== order.sellerId.toString() && !req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updates = { ...req.body };
    const previousStatus = order.status;

    if (updates.status) {
      if (updates.status === 'shipped') {
        updates.shippedTime = new Date();
      }
      if (updates.status === 'delivered') {
        updates.deliveryTime = new Date();
      }
      if (previousStatus === 'shipped' && updates.status !== 'delivered') {
        updates.shippedTime = null;
      }
      if (previousStatus === 'delivered') {
        updates.deliveryTime = null;
      }
    }

    const allowedUpdates = ['status', 'address', 'pincode', 'number','deliveryTime','customerName','shippedTime'];
    const isValidOperation = Object.keys(updates).every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(
      {
        message : "order updated",
        order : updatedOrder
      }
    );
    console.log(updatedOrder);
  } catch (err) {
    console.error("Update order error:", err);
   next(err)
  }
};


export const getOrderProduct = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order or product not found' 
      });
    }
    // Authorization check
    const isAdmin = req.isAdmin;
    const isCustomer = order.customerId.toString() === req.userId;
    const isSeller = order.sellerId.toString() === req.userId;

    if (!isAdmin && !isCustomer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this order"
      });
    }
    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Order product error:', err);
    next(err);
  }
};



export const getOrders = async(req,res,next) => {
  try{
    const { sort = 'newest' } = req.query;
    const sortOptions = { createdAt: -1 };

    if (sort === "oldest") {
      sortOptions.createdAt = 1;
    }
    const orders = await Order.find({
      isCompleted : true,
    }).sort(sortOptions).lean();
    res.status(200).json(
      {
        success: true,
        count: orders.length,
        orders
      }
    );
  }catch(err){
    console.log(err);
    next(err);
  }
  
}

export const deleteOrders = async (req,res , next) => {
  try{ 
    await Order.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json("product has been deleted");
  }catch (err) {
    next(err);
  }
}


export const customerWiseOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      customerId: req.params.userId,
      isCompleted: true
    }).sort({
      createdAt: -1,
    });

    const totalOrderedProducts = orders.reduce((acc, order) => acc + order.quantity, 0);
    
    const pendingProducts = orders.reduce((acc, order) => {
      if (order.status === 'processing' || order.status === 'shipped') {
        return acc + order.quantity;
      }
      return acc;
    }, 0);

    const deliveredProducts = orders.reduce((acc, order) => {
      if (order.status === 'delivered') {
        return acc + order.quantity;
      }
      return acc;
    }, 0);

    res.status(200).json({
      success: true,
      orders,
      metrics: {
        totalOrderedProducts,
        pendingProducts,
        deliveredProducts
      }
    });

  } catch (err) {
    next(err);
    console.log(err);
  }
};


// Get Orders by Seller
export const SellerWiseOrders = async (req, res, next) => {
  try {
    const {sort = "newest"} = req.query;
    const sortOptions = {createdAt : -1}
    
  if (sort === "oldest") {
    sortOptions.createdAt = 1;
  }


    const brand = await Brand.findOne({
      sellerId : req.params.id
    })
    console.log("brand : ",brand)
    const orders = await Order.find({
      brandId : brand._id,
      isCompleted: true
    }).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};
