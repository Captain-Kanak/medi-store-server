import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const addCategory = async ({
  name,
  description,
}: {
  name: string;
  description?: string;
}) => {
  try {
    const result = await prisma.category.create({
      data: {
        name,
        ...(description && { description }),
      },
    });

    return {
      success: true,
      message: "Category added successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to add category", 500);
  }
};

const getCategories = async () => {
  try {
    const result = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            medicines: true,
          },
        },
      },
    });

    if (!result.length) {
      return {
        success: true,
        message: "No categories found",
        data: result,
      };
    }

    return {
      success: true,
      message: "Categories fetched successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get categories", 500);
  }
};

export const categoryService = {
  addCategory,
  getCategories,
};
