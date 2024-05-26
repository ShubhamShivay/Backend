import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";
//! @desc    Create new category
//! @route   POST /api/v1/categories
//! @access  Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	// If category exist
	const categoryFound = await Category.findOne({ name });
	if (categoryFound) {
		throw new Error("Category already exist");
	}

	// Create the category
	const category = await Category.create({
		name: name.toLowerCase(),
		user: req.user,
	});
	res.status(201).json({
		status: "Success",
		message: "Category created successfully",
		category,
	});
});

//! @desc   Get all categories
//! @route  Get /api/v1/categories
//! @access Public

export const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find();

	res.json({
		status: "Success",
		message: "All Categories fetched successfully",
		categories,
	});
});

//! @desc   Get a single categories
//! @route  Get /api/v1/categories/:id
//! @acess  Public

export const getSingleCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	res.json({
		status: "Success",
		message: "Category fetched Successfully",
		category,
	});
});

//! @desc   Update category
//! @route  PUT /api/v1/categories/:id
//! @acess  Private/Admin

export const updateCategory = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const category = await Category.findByIdAndUpdate(
		req.params.id,
		{
			name,
		},
		{
			new: true,
		}
	);

	if (!category) {
		throw new Error("Category not found");
	}

	category.name = name;
	await category.save();
	res.json({
		status: "Success",
		message: "Category updated successfully",
		category,
	});
});

//! @desc   Delete category
//! @route  DELETE /api/v1/categories/:id
//! @acess  Private/Admin

export const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findByIdAndDelete(req.params.id);

	if (!category) {
		throw new Error("Category not found");
	}

	res.json({
		status: "Success",
		message: "Category deleted successfully",
	});
});
