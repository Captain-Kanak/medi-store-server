import { NextFunction, Request, Response } from "express";

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const categoryController = {
  addCategory,
  getCategories,
};
