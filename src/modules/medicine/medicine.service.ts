import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/utils/AppError";
import { Medicine } from "@prisma/client";

interface QueryInput {
  page: number;
  limit: number;
  offset: number;
  search?: string;
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

const getMedicines = async ({ page, limit, offset, search }: QueryInput) => {
  console.log({ page, limit, offset, search });
  try {
    const andConditions = [];

    if (search) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: search as string,
            },
          },
        ],
      });
    }

    const result = await prisma.medicine.findMany({
      skip: offset,
      take: limit,
      include: {
        seller: true,
        category: true,
      },
    });

    const total = await prisma.medicine.count();

    return {
      success: true,
      message: "Medicines fetched successfully",
      total: result.length,
      data: result,
      pagination: {
        page,
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
