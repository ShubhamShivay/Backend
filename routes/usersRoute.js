import express from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  getUserProfileCtrl,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/", getAllUsersCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);

export default userRoutes;
