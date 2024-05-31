import express from "express";
import {
	createOrderCtrl,
	getAllOrdersCtrl,
	getSingleOrderCtrl,
	updateOrderCtrl,
	deleteOrderCtrl,
	getSingleOrderByOrderNumberCtrl,
	updateOrderStatusCtrl,
	getOrderStatsCtrl,
} from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllOrdersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, isAdmin, getOrderStatsCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.get(
	"/ordernumber/:orderNumber",
	isLoggedIn,
	getSingleOrderByOrderNumberCtrl
);
orderRouter.put("/:id", isLoggedIn, updateOrderCtrl);
orderRouter.put("/update/:id", isLoggedIn, isAdmin, updateOrderStatusCtrl);
orderRouter.delete("/:id", isLoggedIn, deleteOrderCtrl);

export default orderRouter;
