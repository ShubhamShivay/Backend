import express from "express";
import {
	registerUserCtrl,
	loginUserCtrl,
	getAllUsersCtrl,
	getUserProfileCtrl,
	updateUserProfileCtrl,
	deleteUserCtrl,
	updateShippingAddress,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", isLoggedIn, isAdmin, getAllUsersCtrl);
userRoutes.get("/profile", isLoggedIn, isAdmin, getUserProfileCtrl);
userRoutes.put("/profile/:id", isLoggedIn, updateUserProfileCtrl);
userRoutes.delete("/profile/:id", isLoggedIn, deleteUserCtrl);
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddress);

export default userRoutes;
