import express from "express";
import {
	createProductCtrl,
	getProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	getProductsByCategory,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import { isAdmin } from "../middlewares/isAdmin.js";
// import { isAdmin } from "../middlewares/isAdmin.js";

const productsRouter = express.Router();

productsRouter.post(
	"/",
	isLoggedIn,
	isAdmin,
	upload.array("files"),
	createProductCtrl
);
productsRouter.get("/", isLoggedIn, getProduct);
productsRouter.get("/:id", getSingleProduct);
productsRouter.get("/category", getProductsByCategory);
productsRouter.put("/:id", isLoggedIn, isAdmin, updateProduct);
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProduct);

export default productsRouter;
