import { toNodeHandler } from "better-auth/node";
import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { notFound } from "./middleware/not-found.js";
import { envConfig } from "./config/envConfig.js";
import { medicineRouter } from "./modules/medicine/medicine.route.js";
import errorHandler from "./middleware/error-handler.js";
import { categoryRouter } from "./modules/category/category.route.js";
import { orderRouter } from "./modules/order/order.route.js";
import { reviewRouter } from "./modules/review/review.route.js";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: [envConfig.origin_url as string, "http://localhost:3000"],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Medi Store Server is running",
  });
});

app.get("/api", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Medi Store API Route",
  });
});

// ------ *** ------
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/categories", categoryRouter);

app.use("/api/medicines", medicineRouter);

app.use("/api/orders", orderRouter);

app.use("/api/reviews", reviewRouter);
// ------ *** ------

app.use(notFound);

app.use(errorHandler);

export default app;
