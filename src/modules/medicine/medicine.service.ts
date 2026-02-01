import type { Medicine, Prisma, User } from "@prisma/client";
import { UserRoles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

interface QueryInput {
  limit: number;
  offset: number;
  search?: string;
  categoryId?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface MedicineUpdateInput {
  price?: number;
  stock?: number;
  description?: string;
  image?: string;
  expiryDate?: Date;
  categoryId?: string;
}

const addMedicine = async (payload: Omit<Medicine, "id">, sellerId: string) => {
  try {
    const result = await prisma.medicine.create({
      data: {
        ...payload,
        sellerId,
      },
    });

    return {
      success: true,
      message: "Medicine added successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to add medicine", 500);
  }
};

const getMedicines = async ({
  limit,
  offset,
  search,
  categoryId,
  sortBy,
  sortOrder,
}: QueryInput) => {
  try {
    const andConditions: Prisma.MedicineWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (categoryId) {
      andConditions.push({
        categoryId,
      });
    }

    const result = await prisma.medicine.findMany({
      skip: offset,
      take: limit,
      where: {
        AND: andConditions,
      },
      orderBy: [
        {
          [sortBy]: sortOrder,
        },
      ],
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!result.length) {
      return {
        success: true,
        message: "No medicines found",
        data: result,
      };
    }

    const total = await prisma.medicine.count();

    return {
      success: true,
      message: "Medicines fetched successfully",
      total: result.length,
      data: result,
      pagination: {
        limit,
        offset,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get medicines", 500);
  }
};

const getMedicine = async (id: string) => {
  try {
    const result = await prisma.medicine.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!result) {
      throw new AppError("Medicine not found", 404);
    }

    return (
      result && {
        success: true,
        message: "Medicine fetched successfully",
        data: result,
      }
    );
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to get medicine", 500);
  }
};

const updateMedicine = async (
  payload: MedicineUpdateInput,
  id: string,
  user: User,
) => {
  try {
    const isAdmin = user.role === UserRoles.ADMIN;
    const { price, stock, description, image, expiryDate, categoryId } =
      payload;

    const medicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new AppError("Medicine not found", 404);
    }

    if (!isAdmin && medicine.sellerId !== user.id) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await prisma.medicine.update({
      where: { id },
      data: {
        ...(price && { price }),
        ...(stock && { stock }),
        ...(description && { description }),
        ...(image && { image }),
        ...(expiryDate && { expiryDate }),
        ...(categoryId && { categoryId }),
      },
    });

    return {
      success: true,
      message: "Medicine updated successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to update medicine", 500);
  }
};

const deleteMedicine = async (id: string, user: User) => {
  try {
    const isAdmin = user.role === UserRoles.ADMIN;

    const medicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new AppError("Medicine not found", 404);
    }

    if (!isAdmin && medicine.sellerId !== user.id) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await prisma.medicine.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Medicine deleted successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to delete medicine", 500);
  }
};

export const medicineService = {
  addMedicine,
  getMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
};
