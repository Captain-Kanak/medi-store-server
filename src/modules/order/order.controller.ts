import type { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service.js";
import { AppError } from "../../utils/AppError.js";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.getOrders();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { shippingAddress, phone, paymentMethod, items } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!shippingAddress || !phone || !paymentMethod || !items.length) {
      throw new AppError("All fields are required", 400);
    }

    const result = await orderService.createOrder(req.body, user.id as string);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const orderId = req.params.id as string;
  const { status } = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const result = await orderService.updateOrderStatus(orderId, status, user);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const orderController = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
