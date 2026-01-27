import express, { Application, json, Request, Response } from "express";

export const app: Application = express();

app.use(json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Medi Store Server is running",
  });
});

app.get("/api", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Medi Store API Route",
  });
});

// ------ *** ------

// ------ *** ------

// not found route handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Not Found",
    route: req.originalUrl,
  });
});
