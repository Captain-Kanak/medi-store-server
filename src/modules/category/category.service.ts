import { AppError } from "@/src/utils/AppError";

const addCategory = async () => {
  try {
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to add category", 500);
  }
};

const getCategories = async () => {
  try {
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get categories", 500);
  }
};

export const categoryService = {
  addCategory,
  getCategories,
};
