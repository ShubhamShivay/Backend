import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

//! @desc    Create brands
//! @route   POST /api/v1/brands
//! @access  Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	// If brand exist
	const brandFound = await Brand.findOne({ name });
	if (brandFound) {
		throw new Error("Brand already exist");
	}

	// Create the brand
	const brand = await Brand.create({
		name: name.toLowerCase(),
		user: req.user,
	});
	res.status(201).json({
		status: "Success",
		message: "Brand created successfully",
		brand,
	});
});

//! @desc   Get all brands
//! @route  Get /api/v1/brands
//! @access Public

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
	const brands = await Brand.find();
	res.status(200).json({
		status: "Success",
		message: "Brands fetched successfully",
		brands,
	});
});

//! @desc   Get single brands
//! @route  Get /api/v1/brands:id
//! @access Public

export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
	const brand = await Brand.findById(req.params.id);
	if (!brand) {
		throw new Error("Brand not found");
	}
	res.status(200).json({
		status: "Success",
		message: "Brand fetched successfully",
		brand,
	});
});

//! @desc   Update brands
//! @route  PUT /api/v1/brands:id
//! @access Private/Admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const brand = await Brand.findByIdAndUpdate(
		req.params.id,
		{
			name,
		},
		{
			new: true,
		}
	);
	if (!brand) {
		throw new Error("Brand not found");
	}

	res.status(200).json({
		status: "Success",
		message: "Brand updated successfully",
		brand,
	});
});

//! @desc   Delete brands
//! @route  DELETE /api/v1/brands:id
//! @access Private/Admin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
	const brand = await Brand.findByIdAndDelete(req.params.id);
	if (!brand) {
		throw new Error("Brand not found");
	}

	res.status(200).json({
		status: "Success",
		message: "Brand deleted successfully",
		brand,
	});
});
