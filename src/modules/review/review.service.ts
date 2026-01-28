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

const updateReview = async (
  payload: Review,
  id: string,
  customerId: string,
) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id, customerId },
    });

    if (!review) {
      throw new AppError("Review not found or you don't have permission", 404);
    }

    const result = await prisma.review.update({
      where: { id, customerId },
      data: {
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    return {
      success: true,
      message: "Review updated successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to update review", 500);
  }
};

export const reviewService = {
  createReview,
  updateReview,
};
