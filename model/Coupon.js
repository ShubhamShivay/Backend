// Coupon model
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

// Coupon is expired
CouponSchema.virtual("isExpired").get(function () {
	return Date.now() > this.endDate;
});
// days to expire
CouponSchema.virtual("DaysToExpire").get(function () {
	const daysLeft =
		Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
		" " +
		"Days Left";
	return daysLeft;
});

// Validation
CouponSchema.pre("validate", function (next) {
	if (this.endDate < this.startDate) {
		next(new Error("End date must be greater than start date"));
	}
	next();
});

// Discount must be between 0 and 100
CouponSchema.pre("validate", function (next) {
	if (this.discount <= 0 || this.discount > 100) {
		next(new Error("Discount must be between 0 and 100"));
	}
	next();
});

// Start date must be greater than current date
CouponSchema.pre("validate", function (next) {
	if (this.startDate < Date.now()) {
		next(new Error("Start date must be greater than current date"));
	}
	next();
});

// End date must be greater than start date
CouponSchema.pre("validate", function (next) {
	if (this.endDate < this.startDate) {
		next(new Error("End date must be greater than start date"));
	}
	next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
