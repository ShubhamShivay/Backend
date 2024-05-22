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
		colors: {
			type: [String],
			require: true,
		},
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
				type: String,
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

const Product = mongoose.model("Product", ProductSchema);
export default Product;
