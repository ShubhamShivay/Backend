import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		discription: {
			type: String,
			require: true,
		},
		brand: {
			type: String,
			require: true,
			ref: "Brand",
		},
		category: {
			type: String,
			ref: "Category",
			require: true,
		},
		sizes: {
			type: [String],
			enum: ["S", "M", "L", "XL", "XXL"],
			require: true,
		},
		colors: [
			{
				type: [String],
				require: true,
				ref: "Color",
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			require: true,
			ref: "User",
		},
		image: [
			{
				type: String,
				default: "https://via.placeholder.com/150",
			},
		],
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		price: {
			type: Number,
			require: true,
		},
		totalQty: {
			type: Number,
			require: true,
		},
		totalSold: {
			type: Number,
			require: true,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

//! Virtuals
//! Total Rating
ProductSchema.virtual("totalReviews").get(function () {
	return this.reviews.length;
});

//! Rating Average
ProductSchema.virtual("ratingAverage").get(function () {
	if (this.reviews.length === 0) {
		return 0;
	}
	const totalRating = this.reviews.reduce((acc, review) => {
		return acc + review.rating;
	}, 0);
	return Number(totalRating / this.reviews.length).toFixed(1);
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
