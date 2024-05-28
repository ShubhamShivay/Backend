import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // Get the Payload(customer, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, totalPrice)
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  /* 
    console.log({
        orderItems,
        shippingAddress,
        totalPrice,
    }); */

  // Find the user
  const user = await User.findById(req.user.id);

  // Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }

  // Place/Create order - save into DB
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Push order into user
  user.orders?.push(order?._id);
  await user.save();
  // Update the product Quantity
  const products = await Product.find({
    _id: { $in: [...orderItems.map((order) => order.product)] },
  });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?.product?.toString();
    });
    if (product) {
      product.totalSold += order?.totalBuyQty;
      await product.save();
    }
  });
  res.status(201).json({
    status: "Success",
    message: "Order successfully saved",
    order,
    user,
  });
  // Make Payment(Stripe)
  // Payment webhook
  // Update the user order
});
