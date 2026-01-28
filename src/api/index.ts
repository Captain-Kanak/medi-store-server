import app from "../app.js";
import { prisma } from "../lib/prisma.js";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await prisma.$connect();
    app(req as any, res as any);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
