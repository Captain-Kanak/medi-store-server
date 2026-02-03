import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

interface AddToCartInput {
  userId: string;
  medicineId: string;
  quantity: number;
}

const getCart = async (userId: string) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        medicine: true,
      },
    });

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error(error);

    throw new AppError("Failed to fetch cart", 500);
  }
};

const addToCart = async ({ userId, medicineId, quantity }: AddToCartInput) => {
  try {
    const result = await prisma.cartItem.upsert({
      where: {
        userId_medicineId: {
          userId,
          medicineId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        medicineId,
        quantity,
      },
    });

    return {
      success: true,
      message: "Added to cart successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to add to cart", 500);
  }
};

const updateCart = async ({ userId, medicineId, quantity }: AddToCartInput) => {
  try {
    const result = await prisma.cartItem.update({
      where: {
        userId_medicineId: {
          userId,
          medicineId,
        },
      },
      data: {
        quantity,
      },
    });

    return {
      success: true,
      message: "Cart updated successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to update cart", 500);
  }
};

const deleteCart = async ({
  userId,
  medicineId,
}: Omit<AddToCartInput, "quantity">) => {
  try {
    const result = await prisma.cartItem.delete({
      where: {
        userId_medicineId: {
          userId,
          medicineId,
        },
      },
    });

    return {
      success: true,
      message: "Cart item deleted successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to delete cart", 500);
  }
};

export const cartService = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
};
