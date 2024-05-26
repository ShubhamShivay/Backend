import express from "express";
import {
	createCategoryCtrl,
	getAllCategories,
	getSingleCategory,
	updateCategory,
	deleteCategory,
} from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/create", isLoggedIn, createCategoryCtrl);
categoriesRouter.get("/all", isLoggedIn, getAllCategories);
categoriesRouter.get("/:id", isLoggedIn, getSingleCategory);
categoriesRouter.put("/:id", isLoggedIn, updateCategory);
categoriesRouter.delete("/:id", isLoggedIn, deleteCategory);

export default categoriesRouter;
