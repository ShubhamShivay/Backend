import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config();

//! @desc    Create new order
//! @route   POST /api/v1/orders
//! @access  Private

//! Stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
	//! Get the Coupon
	const { coupon } = req?.query;

	const couponFound = await Coupon.findOne({
		code: coupon?.toUpperCase(),
	});

	if (couponFound?.isExpired) {
		throw new Error("Coupon is expired");
	}
	if (!couponFound) {
		throw new Error("Coupon does not exist");
	}

	//! Get discount
	const discount = couponFound?.discount / 100;

	//! Get the Payload(customer, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, totalPrice)
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

	//! Find the user
	const user = await User.findById(req.user.id);

	//! Check if order is not empty
	if (orderItems?.length <= 0) {
		throw new Error("No order items");
	}

	//! Place/Create order - save into DB
	const order = await Order.create({
		user: req.user.id,
		orderItems,
		shippingAddress,
		paymentMethod,
		taxPrice,
		shippingPrice,
		totalPrice: couponFound
			? totalPrice - totalPrice * discount
			: totalPrice,
	});

	console.log(order);

	//! Push order into user
	user.orders?.push(order?._id);
	await user.save();
	//! Update the product Quantity
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

	//! Make Payment(Stripe)
	//! Convert order items to have same structure as Stripe

	const convertedOrders = orderItems?.map((item) => {
		return {
			price_data: {
				currency: "INR",
				product_data: {
					name: item?.name,
					description: item?.description,
				},
				unit_amount: item?.price * 100,
			},
			quantity: item?.totalBuyQty,
		};
	});

	const session = await stripe.checkout.sessions.create({
		line_items: convertedOrders,
		metadata: {
			orderId: order?.id,
		},
		mode: "payment",
		success_url: "http://localhost:3000/success",
		cancel_url: "http://localhost:3000/cancel",
	});

	//! Send the response
	res.send({ url: session?.url });
});

//! @desc    Get all orders
//! @route   GET /api/v1/orders
//! @access  Private

export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
	const orders = await Order.find();
	res.json({
		status: "Success",
		message: "Orders fetched successfully",
		orders,
	});
});

//! @desc    Get single order
//! @route   GET /api/v1/orders/:id
//! @access  Private

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (!order) {
		throw new Error("Order not found");
	}

	res.json({
		status: "Success",
		message: "Order fetched successfully",
		order,
	});
});

//! @desc    Update order
//! @route   PUT /api/v1/orders/:id
//! @access  Private

export const updateOrderCtrl = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (!order) {
		throw new Error("Order not found");
	}

	const updatedOrder = await Order.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);
	res.json({
		status: "Success",
		message: "Order updated successfully",
		order: updatedOrder,
	});
});

//! @desc    Delete order
//! @route   DELETE /api/v1/orders/:id
//! @access  Private

export const deleteOrderCtrl = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (!order) {
		throw new Error("Order not found");
	}

	await order.remove();
	res.json({
		status: "Success",
		message: "Order deleted successfully",
	});
});

//! @desc    Get Single Order by OrderNumber
//! @route   GET /api/v1/orders/:id
//! @access  Private

export const getSingleOrderByOrderNumberCtrl = asyncHandler(
	async (req, res) => {
		const order = await Order.findOne({
			orderNumber: req.params.orderNumber,
		});
		if (!order) {
			throw new Error("Order not found");
		}

		res.json({
			status: "Success",
			message: "Order fetched successfully",
			order,
		});
	}
);

//! @desc    Update Order Status
//! @route   PUT /api/v1/orders/:id
//! @access  Admin

export const updateOrderStatusCtrl = asyncHandler(async (req, res) => {
	//? Get the id from params
	const id = req.params.id;
	//? update
	const updatedOrder = await Order.findByIdAndUpdate(
		id,
		{
			status: req.body.status,
		},
		{
			new: true,
		}
	);

	res.json({
		success: true,
		message: "Order status updated successfully",
		updatedOrder,
	});
});

//! @desc    Get Sales Sum of orders
//! @route   GET /api/v1/orders/sales/sum
//! @access  Admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
	//! Sum of sales

	//! Get the minimum order
	const orderStats = await Order.aggregate([
		{
			$group: {
				_id: null,
				minimumSales: {
					$min: "$totalPrice",
				},
				maximumSales: {
					$max: "$totalPrice",
				},
				totalSales: {
					$sum: "$totalPrice",
				},
				averageSales: {
					$avg: "$totalPrice",
				},
			},
		},
	]);

	const date = new Date();
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const saleToday = await Order.aggregate([
		{
			$match: {
				cteatedAt: {
					$gte: today,
				},
			},
		},
		{
			$group: {
				_id: null,
				totalSales: {
					$sum: "$totalPrice",
				},
			},
		},
	]);
	console.log(today);
	res.json({
		status: "Success",
		message: "Total Sum Fetched",
		orderStats,
		saleToday,
	});
});
