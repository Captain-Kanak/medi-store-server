import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/utils/AppError";
import { Medicine, Prisma } from "@prisma/client";

interface QueryInput {
  limit: number;
  offset: number;
  search?: string;
  price?: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
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
  price,
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

    if (price) {
      andConditions.push({
        price: {
          gte: price,
        },
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
