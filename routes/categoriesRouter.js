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
import categoryFileUpload from "../config/categoryUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  categoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/all", getAllCategories);
categoriesRouter.get("/:id", getSingleCategory);
categoriesRouter.put("/:id", isLoggedIn, isAdmin, updateCategory);
categoriesRouter.delete("/:id", isLoggedIn, isAdmin, deleteCategory);

export default categoriesRouter;
