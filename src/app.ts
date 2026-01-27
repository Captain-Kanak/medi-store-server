import { toNodeHandler } from "better-auth/node";
import express, { Application, json, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { notFound } from "./middleware/not-found";
import { envConfig } from "./config/envConfig";
import { medicineRouter } from "./modules/medicine/medicine.route";
import errorHandler from "./middleware/error-handler";

export const app: Application = express();

app.use(json());

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

app.use("/api/medicines", medicineRouter);

app.use("/api/categories", medicineRouter);

// ------ *** ------

app.use(notFound);

app.use(errorHandler);
