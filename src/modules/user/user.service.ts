import { UserRoles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

interface ProfileUpdatePayload {
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
}

const getUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      success: true,
      message: "User retrieved successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error in getUser:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to get user", 500);
  }
};

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

const updateProfile = async (id: string, payload: ProfileUpdatePayload) => {
  const { name, image, phone, address } = payload;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(name && { name }),
        ...(image && { image }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
    });

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error in updateProfile:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to update profile", 500);
  }
};

export const userService = {
  getUser,
  getUsersMetrics,
  updateProfile,
};
