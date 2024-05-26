import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ColorSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		product: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{
		new: true,
	}
);

const Color = mongoose.model("Color", ColorSchema);
export default Color;
