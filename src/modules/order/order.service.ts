import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/utils/AppError";
import { Prisma } from "@prisma/client";

interface Order {
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  items: Prisma.OrderItemCreateManyOrderInput[];
}

const createOrder = async (payload: Order, customerId: string) => {
  const { totalPrice, shippingAddress, paymentMethod, items } = payload;
  try {
    const result = await prisma.$transaction(async (trx) => {
      const order = await trx.order.create({
        data: {
          totalPrice,
          shippingAddress,
          paymentMethod,
          customerId,
          items: {
            createMany: {
              data: items,
            },
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        const medicine = await trx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine || medicine.stock < item.quantity) {
          throw new AppError(`Insufficient stock for ${medicine?.name}`, 400);
        }

        await trx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return {
      success: true,
      message: "Order created successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to create order", 500);
  }
};

export const orderService = {
  createOrder,
};
