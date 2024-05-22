import express from "express";
import {
	createProductCtrl,
	getProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, createProductCtrl);
productsRouter.get("/", getProduct);
productsRouter.get("/:id", getSingleProduct);
productsRouter.put("/:id", isLoggedIn, isAdmin, updateProduct);
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProduct);

export default productsRouter;
