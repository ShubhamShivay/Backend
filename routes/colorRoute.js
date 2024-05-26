import express from "express";
import {
	createColorCtrl,
	deleteColorCtrl,
	getAllColorsCtrl,
	getSingleColorCtrl,
	updateColorCtrl,
} from "../controllers/colorCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const colorRoute = express.Router();

colorRoute.post("/", isLoggedIn, createColorCtrl);
colorRoute.put("/:id", isLoggedIn, updateColorCtrl);
colorRoute.delete("/:id", isLoggedIn, deleteColorCtrl);
colorRoute.get("/", getAllColorsCtrl);
colorRoute.get("/:id", getSingleColorCtrl);

export default colorRoute;
