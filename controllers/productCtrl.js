import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
// import User from "../model/User.js";

//! @desc    Create new product
//! @route   POST /api/v1/products
//! @access  Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
  console.log(req.user);
  const {
    name,
    discription,
    brand,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
  } = req.body;
  // Product exist
  const productExist = await Product.findOne({ name });
  if (productExist) {
    throw new Error("Product already exist");
  }

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
  });

  // push the product into category
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
  const products = await productQuery;

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
  const product = await Product.findById(req.params.id);
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
