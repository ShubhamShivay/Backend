import mongoose from "mongoose";

const Schema = mongoose.Schema;

//Generate Random Numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				totalBuyQty: {
					type: Number,
					default: 1,
				},
			},
		],
		shippingAddress: {
			firstname: {
				type: String,
				required: true,
			},
			lastname: {
				type: String,
				required: true,
			},
			address: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			pincode: {
				type: Number,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			phone: {
				type: Number,
				required: true,
			},
		},
		orderNumber: {
			type: String,
			required: true,
			default: randomTxt + randomNumber,
		},
		paymentStatus: {
			type: String,
			require: true,
			default: "Not paid",
		},
		totalPrice: {
			type: Number,
			default: 0.0,
		},
		paymentMethod: {
			type: String,
			default: "Not specified",
		},
		currency: {
			type: String,
			default: "Not specified",
		},
		//! For admin
		status: {
			type: String,
			default: "Pending",
			enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
		},
		deleveredAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

//Compile to form model
const Object = mongoose.model("Order", OrderSchema);
export default Object;
