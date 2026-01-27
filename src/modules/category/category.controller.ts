import { AppError } from "@/src/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  try {
    if (!name) {
      throw new AppError("Category name required", 400);
    }

    const result = await categoryService.addCategory({ name, description });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.getCategories();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const categoryController = {
  addCategory,
  getCategories,
};
