import type { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "@prisma/client";
import { paginationHelper } from "../../utils/paginationHelper.js";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { page, limit } = req.query;
  try {
    const pagination = paginationHelper({
      page: page as string,
      limit: limit as string,
    });

    const result = await orderService.getOrders(user as User, {
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getOrderMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await orderService.getOrderMetrics(user as User);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

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
  getOrderMetrics,
  createOrder,
  updateOrderStatus,
};
