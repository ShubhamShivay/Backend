import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc Get all users
// @route POST /api/v1/users/register
// @access Private/Admin

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
		isAdmin: false,
	});
	res.status(201).json({
		status: "Success",
		message: "User Registerd Successful",
		data: user,
	});
});

// @desc Login user
// @route POST /api/v1/users/login
// @access Private/Admin

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
		token: generateToken(user?._id),
	});
});

// @desc Get all users
// @route GET /api/v1/users
// @access Private/Admin
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

// @desc Get user Profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
	// Get Token from header
	const token = getTokenFromHeader(req);
	// Verify Token
	const verified = verifyToken(token);
	console.log(verified);

	res.json({
		message: "User Profile",
	});
});
