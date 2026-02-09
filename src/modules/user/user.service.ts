import { UserRoles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const getUsersMetrics = async () => {
  try {
    const totalCustomers = await prisma.user.count({
      where: {
        role: UserRoles.CUSTOMER,
        isBlocked: false,
      },
    });

    const totalSellers = await prisma.user.count({
      where: {
        role: UserRoles.SELLER,
        isBlocked: false,
      },
    });

    return {
      success: true,
      message: "Users metrics retrieved successfully",
      data: {
        totalCustomers,
        totalSellers,
      },
    };
  } catch (error) {
    console.error("Error in getUsersMetrics:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to get users metrics", 500);
  }
};

export const userService = {
  getUsersMetrics,
};
