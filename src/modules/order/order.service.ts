import type { User } from "@prisma/client";
import { OrderStatus, Prisma, UserRoles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

interface Order {
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  items: Prisma.OrderItemCreateManyOrderInput[];
}

const getOrders = async () => {
  try {
    const result = await prisma.order.findMany({
      include: {
        items: {
          include: {
            medicine: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!result.length) {
      return {
        success: true,
        message: "No orders found",
        data: result,
      };
    }

    return {
      success: true,
      message: "Orders fetched successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    throw new AppError("Failed to get orders", 500);
  }
};

const createOrder = async (payload: Order, customerId: string) => {
  const { shippingAddress, phone, paymentMethod, items } = payload;
  try {
    const result = await prisma.$transaction(async (trx) => {
      let calculatedTotalPrice = 0;

      for (const item of items) {
        const medicine = await trx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) {
          throw new AppError(
            `Medicine with ID ${item.medicineId} not found`,
            404,
          );
        }

        if (medicine.stock < item.quantity) {
          throw new AppError(`Insufficient stock for ${medicine.name}`, 400);
        }

        calculatedTotalPrice += medicine.price * item.quantity;

        await trx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await trx.order.create({
        data: {
          totalPrice: calculatedTotalPrice,
          shippingAddress,
          phone,
          paymentMethod,
          customerId,
          items: {
            create: items.map((item) => ({
              medicineId: item.medicineId,
              quantity: item.quantity,
              price:
                items.find((i) => i.medicineId === item.medicineId)?.price || 0,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await trx.cartItem.deleteMany({
        where: {
          userId: customerId,
        },
      });

      return order;
    });

    return {
      success: true,
      message: "Order created successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to create order", 500);
  }
};

const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  user: User,
) => {
  try {
    const isSeller = user.role === UserRoles.SELLER;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true, customerId: true },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status !== OrderStatus.PENDING && !isSeller) {
      throw new AppError("Order already processed", 400);
    }

    if (status !== OrderStatus.CANCELLED && !isSeller) {
      throw new AppError("You are not authorized to update this order", 403);
    }

    const result = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: "Order status updated successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to update order", 500);
  }
};

export const orderService = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
