import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { AppError } from "@/src/utils/AppError";
import { paginationHelper } from "@/src/utils/paginationHelper";

const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const {
    name,
    brand,
    price,
    stock,
    description,
    image,
    dosage,
    expiryDate,
    categoryId,
  } = req.body;
  try {
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (
      !name ||
      !brand ||
      !price ||
      !stock ||
      !description ||
      !image ||
      !dosage ||
      !expiryDate ||
      !categoryId
    ) {
      throw new AppError("All fields are required", 400);
    }

    const result = await medicineService.addMedicine(req.body, user.id);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { search, page, limit } = req.query;

  console.log({ search });
  try {
    const pagination = paginationHelper({
      page: page as string,
      limit: limit as string,
    });

    console.log(pagination);

    const result = await medicineService.getMedicines({
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
      search: search as string,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await medicineService.getMedicine();
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const medicineController = {
  addMedicine,
  getMedicines,
  getMedicine,
};
