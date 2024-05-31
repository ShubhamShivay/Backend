import express from "express";
import {
	createCouponCtrl,
	getAllCouponsCtrl,
	getSingleCouponCtrl,
	updateCouponCtrl,
	deleteCouponCtrl,
} from "../controllers/couponCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const couponRouter = express.Router();

couponRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponRouter.get("/all", getAllCouponsCtrl);
couponRouter.get("/:id", getSingleCouponCtrl);
couponRouter.put("/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponRouter.delete("/:id", isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponRouter;
