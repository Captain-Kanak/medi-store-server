import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { cartService } from "./cart.service.js";

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await cartService.getCart(user.id as string);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { medicineId, quantity } = req.body;

  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!medicineId || !quantity) {
      throw new AppError("All fields are required", 400);
    }

    const result = await cartService.addToCart({
      userId: user.id as string,
      medicineId,
      quantity: Number(quantity),
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { medicineId, quantity } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!medicineId || !quantity) {
      throw new AppError("All fields are required", 400);
    }

    const result = await cartService.updateCart({
      userId: user.id as string,
      medicineId,
      quantity,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { medicineId } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!medicineId) {
      throw new AppError("All fields are required", 400);
    }

    const result = await cartService.deleteCart({
      userId: user.id as string,
      medicineId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const cartController = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
};
