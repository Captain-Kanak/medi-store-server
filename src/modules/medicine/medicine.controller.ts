import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";

const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await medicineService.addMedicine();
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
  try {
    const result = await medicineService.getMedicines();
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
