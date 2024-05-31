import User from "../model/User.js";

export const isAdmin = async (req, res, next) => {
	//! find the login user
	const user = await User.findById(req.user.id);
	//! Check user is Amin
	if (!user.isAdmin) {
		return res.status(401).json({
			status: "Failed",
			message: "Unauthorized, Access Denied, Admin only",
		});
	}

	return next();
};
