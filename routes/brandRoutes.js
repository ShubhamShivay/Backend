import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
	createBrandCtrl,
	getAllBrandsCtrl,
	getSingleBrandCtrl,
	updateBrandCtrl,
	deleteBrandCtrl,
} from "../controllers/BrandCtrl.js";

const brandRouter = express.Router();

brandRouter.post("/create", isLoggedIn, createBrandCtrl);
brandRouter.get("/all", getAllBrandsCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);
brandRouter.put("/:id", isLoggedIn, updateBrandCtrl);
brandRouter.delete("/:id", isLoggedIn, deleteBrandCtrl);

export default brandRouter;
