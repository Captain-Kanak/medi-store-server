import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { AppError } from "@/src/utils/AppError";
import { paginationHelper } from "@/src/utils/paginationHelper";
import { sortingHelper } from "@/src/utils/sortingHelper";

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
      throw new AppError("Unauthorized", 401);
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

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const getMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { search, page, limit, price, sortBy, sortOrder } = req.query;
  const trimmedSearch = search ? (search as string).trim() : "";
  const numberPrice = price ? Number(price) : 0;

  try {
    const pagination = paginationHelper({
      page: page as string,
      limit: limit as string,
    });

    const sorting = sortingHelper({
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
    });

    const result = await medicineService.getMedicines({
      limit: pagination.limit,
      offset: pagination.offset,
      search: trimmedSearch as string,
      price: numberPrice as number,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getMedicine = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await medicineService.getMedicine(id as string);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const medicineController = {
  addMedicine,
  getMedicines,
  getMedicine,
  updateMedicine,
};
