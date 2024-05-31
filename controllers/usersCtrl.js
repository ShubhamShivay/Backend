import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";


// @desc	Create users
// @route	POST /api/v1/users/register
// @access	Public

export const registerUserCtrl = asyncHandler(async (req, res) => {
	const { fullname, email, password } = req.body;
	//Check User Exist
	const userExist = await User.findOne({ email });

	if (userExist) {
		return res.json({
			msg: "User already exist",
		});
	}
	// Hash Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create the user
	const user = await User.create({
		fullname,
		email,
		password: hashedPassword,
	});
	res.status(201).json({
		status: "Success",
		message: "User Registerd Successful",
		data: user,
	});
});

//! @desc Login user
//! @route POST /api/v1/users/login
//! @access Private/Admin

export const loginUserCtrl = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	//Check User Exist
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User does not exist");
	}

	// Check Password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid Credentials");
	}

	return res.status(201).json({
		status: "Success",
		message: "User Login Successful",
		data: user,
		token: generateToken({
			id: user._id,
			isAdmin: user.isAdmin,
			email: user.email,
		}),
	});
});

//! @desc Get all users
//! @route GET /api/v1/users
//! @access Private/Admin
export const getAllUsersCtrl = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check User Exist
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User does not exist");
	}

	// Check Password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid Credentials");
	}

	const isAdminUser = await User.find({ isAdmin: true });

	if (!isAdminUser) {
		throw new Error("You are not authorized to perform this action");
	}
	// Get all users
	const users = await User.find();
	res.status(201).json({
		status: "Success",
		message: "User Login Successful",
		data: users,
	});
});

//! @desc Get Single user Profile
//! @route GET /api/v1/users/profile
//! @access Public

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id).populate("orders");
	if (!user) {
		throw new Error("User does not exist");
	}

	res.json({
		message: "User Profile",
		data: user,
	});
});

//! @desc Update user Profile
//! @route PUT /api/v1/users/profile
//! @access Private
export const updateUserProfileCtrl = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id);

	if (!user) {
		throw new Error("User does not exist");
	}

	// Update user
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: req.body,
		},
		{
			new: true,
		}
	);

	res.json({
		message: "User Profile",
		data: updatedUser,
	});
});

//! @desc Delete user
//! @route DELETE /api/v1/users/:id
//! @access Private/Admin
export const deleteUserCtrl = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		throw new Error("User does not exist");
	}
	res.json({
		status: "Success",
		message: "User Deleted Successfully",
	});
});

//! @desc	Update user shipping address
//! @route	PUT /api/v1/users/update/shipping
//! @access	Private

export const updateShippingAddress = asyncHandler(async (req, res) => {
	const { firstName, lastName, address, city, country, pincode, phone } =
		req.body;

	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			shippingAddress: {
				firstName,
				lastName,
				address,
				city,
				country,
				pincode,
				phone,
			},
			hasShippingAddress: true,
		},
		{
			new: true,
		}
	);
	//! Send the response
	res.json({
		status: "Success",
		message: "User shipping address updated successfully.",
		user,
	});
});
