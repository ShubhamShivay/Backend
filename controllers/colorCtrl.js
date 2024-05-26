import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

//! @desc   Create color
//! @route  POST /api/v1/color
//! @access Admin/Private

export const createColorCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const colorFound = await Color.findOne({ name });
	if (colorFound) {
		throw new Error("Color already exist");
	}

	const color = await Color.create({
		name: name.toLowerCase(),
		user: req.user,
	});
	res.status(201).json({
		status: "Success",
		message: "Color created successfully",
		color,
	});
});

//! @desc   update color
//! @route  PUT /api/v1/color
//! @access Admin/Private

export const updateColorCtrl = asyncHandler(async (req, res) => {
	const colorFound = await Color.findByIdAndUpdate(
		req.params.id,
		{
			$set: req.body,
		},
		{
			new: true,
		}
	);

	if (!colorFound) {
		{
			throw new Error("Color not found.");
		}
	}

	res.json({
		status: "Success",
		message: "Color Updated",
		colorFound,
	});
});

//! @desc   Delete Color
//! @route  Delete /api/v1/color
//! @access Admin/Private

export const deleteColorCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const colorFound = await Color.findByIdAndDelete(
		req.params.id,
		{
			name,
		},
		{
			new: true,
		}
	);

	res.json({
		status: "Success",
		message: "Color Deleted",
	});
});

//! @desc   Get all colors
//! @route  GET /api/v1/colors
//! @access Public

export const getAllColorsCtrl = asyncHandler(async (req, res) => {
	const colorFound = await Color.find();
	res.json({
		status: "Success",
		message: "All Colors Fetched Successfully.",
		colorFound,
	});
});

//! @desc   Get Single Color
//! @route  Get /api/v1/color
//! @acess  Public

export const getSingleColorCtrl = asyncHandler(async (req, res) => {
	const colorFound = await Color.findById(req.params.id);
	if (!colorFound) {
		throw new Error("Color not Found.");
	}

	res.json({
		status: "Success",
		message: "Color Fetched Successfull.",
		colorFound,
	});
});
