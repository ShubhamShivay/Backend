import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";
import Color from "../model/Color.js";
// import User from "../model/User.js";

//! @desc    Create new product
//! @route   POST /api/v1/products
//! @access  Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
	//! Image files
	const imagelink = req.files.map((file) => file.path);

	const {
		name,
		discription,
		brand,
		category,
		sizes,
		colors,
		price,
		totalQty,
	} = req.body;
	//! Product exist
	const productExist = await Product.findOne({ name });
	if (productExist) {
		throw new Error("Product already exist");
	}

	//! Find the category
	const categoryFound = await Category.findOne({ name: category });
	if (!categoryFound) {
		throw new Error(
			"Category not found, Please create category first or check category name"
		);
	}

	//! find the brand
	const brandFound = await Brand.findOne({ name: brand });
	if (!brandFound) {
		throw new Error(
			"Brand not found, Please create brand first or check brand name"
		);
	}

	//! Find the Color
	const colorFound = await Color.findOne({ name: colors });
	if (!colorFound) {
		throw new Error(
			"Color not found, Please create color first or check color name"
		);
	}

	// Find the Size

	// Create the product
	const product = await Product.create({
		name,
		discription,
		brand,
		category,
		sizes,
		colors,
		user: req.userAuthId,
		price,
		totalQty,
		image: imagelink,
	});

	//! push the product into category
	categoryFound.product.push(product._id);
	await categoryFound.save();

	//! push the product into brand
	brandFound.product.push(product._id);
	await brandFound.save();

	//! push the product into color
	colorFound.product.push(product._id);
	await colorFound.save();

	res.json({
		status: "Success",
		message: "Product created successfully",
		product,
	});
});

//! @desc    Get all products
//! @route   GET /api/v1/products
//! @access  Public

export const getProduct = asyncHandler(async (req, res) => {
	//Querry
	let productQuery = Product.find();

	//Search by name
	if (req.query.name) {
		productQuery = productQuery.find({
			name: { $regex: req.query.name, $options: "i" },
		});
	}

	//Search by brand
	if (req.query.brand) {
		productQuery = productQuery.find({
			brand: { $regex: req.query.brand, $options: "i" },
		});
	}

	//Search by category
	if (req.query.category) {
		productQuery = productQuery.find({
			category: { $regex: req.query.category, $options: "i" },
		});
	}

	//Search by color
	if (req.query.color) {
		productQuery = productQuery.find({
			colors: { $regex: req.query.color, $options: "i" },
		});
	}

	//Search by size
	if (req.query.size) {
		productQuery = productQuery.find({
			sizes: { $regex: req.query.size, $options: "i" },
		});
	}
	// Search by Price Range
	if (req.query.price) {
		const priceRange = req.query.price.split("-");
		productQuery = productQuery.find({
			price: { $gte: priceRange[0], $lte: priceRange[1] },
		});
	}

	//Pagination
	//page
	const page = parseInt(req.query.page) || 1;
	//limit
	const limit = parseInt(req.query.limit) || 10;
	//startIndex
	const startIndex = (page - 1) * limit;
	//endIndex
	const endIndex = page * limit;
	//total
	const total = await Product.countDocuments();
	productQuery = productQuery.skip(startIndex).limit(limit);
	//Paggination result
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	//Await the querry
	const products = await productQuery.populate("reviews");

	//Send the response
	res.json({
		status: "Success",
		total,
		results: products.length,
		pagination,
		message: "Products fetched Successfully",
		products,
	});
});

//! @desc    Get single products
//! @route   GET /api/v1/products:id
//! @access  Public

export const getSingleProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate("reviews");
	if (!product) {
		throw new Error("Product not found");
	}

	res.json({
		status: "Success",
		message: "Product fetched Successfully",
		product,
	});
});

//! @desc    Update product
//! @route   PUT /api/v1/products:id
//! @access  Private/Admin

export const updateProduct = asyncHandler(async (req, res) => {
	// Check if user is Admin

	// Product exist
	const product = await Product.findByIdAndUpdate(
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
		message: "Product updated Successfully",
		product,
	});
});

//! @desc    Delete product
//! @route   DELETE /api/v1/products:id
//! @access  Private/Admin

export const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		throw new Error("Product not found");
	}

	res.json({
		status: "Success",
		message: "Product deleted Successfully",
	});
});

//! @desc    Find Products by category
//! @route   GET /api/v1/products/category/:category
//! @access  Public

export const getProductsByCategory = asyncHandler(async (req, res) => {
	const products = await Product.find({ category: req.params.category });
	res.json({
		status: "Success",
		message: "Products fetched Successfully",
		products,
	});
});
