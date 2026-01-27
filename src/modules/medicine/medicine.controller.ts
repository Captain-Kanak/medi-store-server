import { NextFunction, Request, Response } from "express";

const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error: any) {
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
  } catch (error: any) {
    console.log(error);

    next(error);
  }
};

export const medicineController = {
  addMedicine,
  getMedicines,
};
