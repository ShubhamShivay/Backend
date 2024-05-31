import express from "express";
import {
	createColorCtrl,
	deleteColorCtrl,
	getAllColorsCtrl,
	getSingleColorCtrl,
	updateColorCtrl,
} from "../controllers/colorCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const colorRoute = express.Router();

colorRoute.post("/", isLoggedIn, isAdmin, createColorCtrl);
colorRoute.put("/:id", isLoggedIn, isAdmin, updateColorCtrl);
colorRoute.delete("/:id", isLoggedIn, isAdmin, deleteColorCtrl);
colorRoute.get("/", getAllColorsCtrl);
colorRoute.get("/:id", getSingleColorCtrl);

export default colorRoute;
