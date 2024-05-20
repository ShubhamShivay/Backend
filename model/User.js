import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		order: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		wishList: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "wishList",
			},
		],
		hasShippingAddress: {
			type: Boolean,
			default: false,
		},
		shippingAddress: {
			firstName: {
				type: String,
			},
			lastName: {
				type: String,
			},
			address: {
				type: String,
			},
			city: {
				type: String,
			},
			country: {
				type: String,
			},
			postalCode: {
				type: String,
			},
			phone: {
				type: String,
			},
		},
	},
	{
		timestamps: true,
	}
);

// Compile the Schema to a Model
const User = mongoose.model("User", userSchema);
export default User;
