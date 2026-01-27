import { AppError } from "@/src/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { totalPrice, shippingAddress, paymentMethod, items } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!totalPrice || !shippingAddress || !paymentMethod || !items.length) {
      throw new AppError("All fields are required", 400);
    }

    const result = await orderService.createOrder(req.body, user.id as string);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const orderController = {
  createOrder,
};
