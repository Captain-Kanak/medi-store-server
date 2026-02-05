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

const getOrders = async (user: User) => {
  try {
    let whereCondition = {};

    if (user.role === UserRoles.CUSTOMER) {
      whereCondition = { customerId: user.id };
    }

    if (user.role === UserRoles.SELLER) {
      whereCondition = {
        items: {
          some: {
            medicine: {
              sellerId: user.id,
            },
          },
        },
      };
    }

    const result = await prisma.order.findMany({
      where: whereCondition,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            medicine: {
              include: {
                seller: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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
        item.price = medicine.price;

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
              price: item.price,
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
      include: {
        items: true,
      },
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

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
      });

      if (status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await tx.medicine.update({
            where: { id: item.medicineId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      return updatedOrder;
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
