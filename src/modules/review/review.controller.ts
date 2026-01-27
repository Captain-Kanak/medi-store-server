import { AppError } from "@/src/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const { rating, comment, medicineId } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!rating || !comment || !medicineId) {
      throw new AppError("All fields are required", 400);
    }

    const result = await reviewService.createReview(
      { rating, comment, medicineId },
      user.id as string,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const reviewController = { createReview };
