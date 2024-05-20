import User from "../model/User.js";
import bcrypt from "bcryptjs";

// @desc Get all users
// @route GET /api/users
// @access Private/Admin

export const registerUserCtrl = async (req, res) => {
	const { fullname, email, password } = req.body;
	//Check User Exist
	const userExist = await User.findOne({ email });

	if (userExist) {
		res.json({
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
};
