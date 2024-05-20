import User from "../model/User.js";

// @desc Get all users
// @route GET /api/users
// @access Private/Admin

export const registerUserCtrl = async (req, res) => {
	res.json({
		msg: "User registered successfully",
	});
};
