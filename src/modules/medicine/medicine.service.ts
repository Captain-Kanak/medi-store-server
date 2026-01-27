import { AppError } from "@/src/utils/AppError";

const addMedicine = async () => {
  try {
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to add medicine", 500);
  }
};

const getMedicines = async () => {
  try {
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get medicines", 500);
  }
};

const getMedicine = async () => {
  try {
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get medicine", 500);
  }
};

export const medicineService = {
  addMedicine,
  getMedicines,
  getMedicine,
};
