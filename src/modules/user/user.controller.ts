import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { userService } from "./user.service.js";

const getUsersMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.getUsersMetrics();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUsersMetrics:", error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const payload = req.body;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await userService.updateProfile(user.id as string, payload);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateProfile:", error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const userController = {
  getUsersMetrics,
  updateProfile,
};
