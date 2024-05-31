import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//! @desc    Create new coupon
//! @route   POST /api/v1/coupons
//! @access  Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
	const { code, startDate, endDate, discount } = req.body;
	// If coupon exist
	const couponFound = await Coupon.findOne({ code });
	if (couponFound) {
		throw new Error("Coupon already exist");
	}

	//Check if discount is a number
	if (isNaN(discount)) {
		throw new Error("Discount must be a number");
	}

	// Create the coupon
	const coupon = await Coupon.create({
		code: code?.toUpperCase(),
		startDate,
		endDate,
		discount,
		user: req.user.id,
	});
	res.status(201).json({
		status: "Success",
		message: "Coupon created successfully",
		coupon,
	});
});

//! @desc   Get all coupons
//! @route  Get /api/v1/coupons
//! @access Public
export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
	const coupons = await Coupon.find();
	res.json({
		status: "Success",
		message: "Coupons fetched successfully",
		coupons,
	});
});

//! @desc   Get single coupon
//! @route  Get /api/v1/coupons/:id
//! @access Public

export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
	const coupon = await Coupon.findById(req.params.id);
	if (!coupon) {
		throw new Error("Coupon not found");
	}

	res.json({
		status: "Success",
		message: "Coupon fetched successfully",
		coupon,
	});
});

//! @desc   Update coupon
//! @route  PUT /api/v1/coupons/:id
//! @access Private
export const updateCouponCtrl = asyncHandler(async (req, res) => {
	// Check if user is Admin
	const coupon = await Coupon.findByIdAndUpdate(req.params.id);
	if (!coupon) {
		throw new Error("Coupon not found");
	}

	// Update coupon
	const updatedCoupon = await Coupon.findByIdAndUpdate(
		req.params.id,
		{
			$set: req.body,
		},
		{
			new: true,
		}
	);
	res.json({
		status: "Success",
		message: "Coupon updated successfully",
		coupon: updatedCoupon,
	});
});

//! @desc   Delete coupon
//! @route  DELETE /api/v1/coupons/:id
//! @access Private
export const deleteCouponCtrl = asyncHandler(async (req, res) => {
	const coupon = await Coupon.findByIdAndDelete(req.params.id);
	if (!coupon) {
		throw new Error("Coupon not found");
	}
	res.json({
		status: "Success",
		message: "Coupon deleted successfully",
	});
});
