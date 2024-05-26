import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

//! @desc    Create new review
//! @route   POST /api/v1/reviews
//! @access  Private

export const createReviewCtrl = asyncHandler(async (req, res) => {
	const { product, rating, comment } = req.body;
	//! Check if product exist
	const { productID } = req.params;
	const productFound = await Product.findById(productID).populate("reviews");
	if (!productFound) {
		throw new Error("Product not found");
	}

	//! Check if review exist
	const hasReviewed = productFound?.reviews?.find((review) => {
		return review?.user?.toString() === req.user?.id?.toString();
	});

	if (hasReviewed) {
		throw new Error("You have already reviewed this product");
	}

	//! Create review
	const review = await Review.create({
		rating,
		comment,
		product: productFound?._id,
		user: req.user.id,
	});

	//! Save the review
	productFound.reviews.push(review?._id);
	await productFound.save();

	res.status(201).json({
		status: "Success",
		message: "Review created successfully",
		// review,
	});
});
