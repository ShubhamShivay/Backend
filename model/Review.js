import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
