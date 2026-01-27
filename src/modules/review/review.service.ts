import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/utils/AppError";

interface Review {
  rating: number;
  comment: string;
  medicineId: string;
}

const createReview = async (payload: Review, customerId: string) => {
  try {
    const result = await prisma.review.create({
      data: {
        ...payload,
        customerId,
      },
    });

    return {
      success: true,
      message: "Review created successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to create review", 500);
  }
};

export const reviewService = { createReview };
