import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
	createBrandCtrl,
	getAllBrandsCtrl,
	getSingleBrandCtrl,
	updateBrandCtrl,
	deleteBrandCtrl,
} from "../controllers/brandCtrl.js";

const brandRouter = express.Router();

brandRouter.post("/create", isLoggedIn, isAdmin, createBrandCtrl);
brandRouter.get("/all", getAllBrandsCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);
brandRouter.put("/:id", isLoggedIn, isAdmin, updateBrandCtrl);
brandRouter.delete("/:id", isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandRouter;
