import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/utils/AppError";
import { OrderStatus, Prisma, User, UserRoles } from "@prisma/client";

interface Order {
  totalPrice: number;
  shippingAddress: string;
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
