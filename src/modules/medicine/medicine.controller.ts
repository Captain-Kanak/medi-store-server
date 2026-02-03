import type { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service.js";
import { paginationHelper } from "../../utils/paginationHelper.js";
import { sortingHelper } from "../../utils/sortingHelper.js";
import { AppError } from "../../utils/AppError.js";

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
  const { search, page, limit, sortBy, sortOrder, categoryId } = req.query;
  const trimmedSearch = search ? (search as string).trim() : "";

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
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
      search: trimmedSearch as string,
      categoryId: categoryId as string,
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
) => {
  const user = req.user;
  const id = req.params.id as string;
  const payload = req.body;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await medicineService.updateMedicine(payload, id, user);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const id = req.params.id as string;
  try {
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await medicineService.deleteMedicine(id, user);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    next(error);
  }
};

export const medicineController = {
  addMedicine,
  getMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
};
