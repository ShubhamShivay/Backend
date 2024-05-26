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
// import { isAdmin } from "../middlewares/isAdmin.js";

const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, createProductCtrl);
productsRouter.get("/", getProduct);
productsRouter.get("/:id", getSingleProduct);
productsRouter.get("/category", getProductsByCategory);
productsRouter.put("/:id", isLoggedIn, updateProduct);
productsRouter.delete("/:id/delete", isLoggedIn, deleteProduct);

export default productsRouter;
