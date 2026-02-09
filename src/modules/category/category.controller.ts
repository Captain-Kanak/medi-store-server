import type { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service.js";
import { AppError } from "../../utils/AppError.js";

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

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await categoryService.updateCategory(id as string, {
      name,
      description,
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

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await categoryService.deleteCategory(id as string);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const categoryController = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
