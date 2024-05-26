import express from "express";
import {
	registerUserCtrl,
	loginUserCtrl,
	getAllUsersCtrl,
	getUserProfileCtrl,
	updateUserProfileCtrl,
	deleteUserCtrl,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", getAllUsersCtrl);
userRoutes.get("/profile/:id", isLoggedIn, getUserProfileCtrl);
userRoutes.put("/profile/:id", isLoggedIn, updateUserProfileCtrl);
userRoutes.delete("/profile/:id", isLoggedIn, deleteUserCtrl);

export default userRoutes;
