import dotenv from "dotenv";
import Stripe from "stripe";
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
import Order from "../model/Order.js";
import couponRouter from "../routes/couponRoutes.js";

dbConnect();
const app = express();

//! Stripe webhook

//Stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
	"whsec_c9924d207f84c1bd1186b649179285898e8c0a5251d7b10220e3e56581906c65";

app.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	async (request, response) => {
		const sig = request.headers["stripe-signature"];

		let event;

		try {
			event = stripe.webhooks.constructEvent(
				request.body,
				sig,
				endpointSecret
			);
			// console.log(event);
		} catch (err) {
			// console.log("err", err.message);
			response.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}

		if (event.type === "checkout.session.completed") {
			//Update the order
			const session = event.data.object;
			const { orderId } = session.metadata;
			const paymentStatus = session.payment_status;
			const paymentMethod = session.payment_method_types[0];
			const totalAmount = session.amount_total / 100;
			const currency = session.currency;

			//Find the order
			const order = await Order.findByIdAndUpdate(
				orderId,
				{
					totalPrice: totalAmount,
					currency,
					paymentMethod,
					paymentStatus,
				},
				{
					new: true,
				}
			);

			console.log(order);
		} else {
			return;
		}

		/* // Handle the event
		switch (event.type) {
			case "payment_intent.succeeded":
				const paymentIntentSucceeded = event.data.object;
				// Then define and call a function to handle the event payment_intent.succeeded
				break;
			// ... handle other event types
			default:
				console.log(`Unhandled event type ${event.type}`);
		}
 */
		// Return a 200 response to acknowledge receipt of the event
		response.send();
	}
);

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
app.use("/api/v1/coupons", couponRouter);

// Error Handling
app.use(notFound);
app.use(globalErrorHandler);
export default app;
