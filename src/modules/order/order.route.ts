import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "@/src/middleware/authMiddleware";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.get("/", authMiddleware(UserRoles.ADMIN), orderController.getOrders);

router.post(
  "/",
  authMiddleware(UserRoles.CUSTOMER),
  orderController.createOrder,
);

router.patch(
  "/:id",
  authMiddleware(UserRoles.SELLER, UserRoles.CUSTOMER),
  orderController.updateOrderStatus,
);

export { router as orderRouter };
