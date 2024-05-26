import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import {
	globalErrorHandler,
	notFound,
} from "../middlewares/globalErrorHandler.js";
import productsRouter from "../routes/productsRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandRoutes from "../routes/brandRoutes.js";
import colorRoute from "../routes/colorRoute.js";
import reviewRouter from "../routes/reviewRouter.js";
import orderRouter from "../routes/orderRouter.js";

dbConnect();
const app = express();

// Pass incoming Data
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/colors", colorRoute);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// Error Handling
app.use(notFound);
app.use(globalErrorHandler);
export default app;
