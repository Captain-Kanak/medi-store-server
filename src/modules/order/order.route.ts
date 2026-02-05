import { Router } from "express";
import { orderController } from "./order.controller.js";
import { UserRoles } from "@prisma/client";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/", authMiddleware(), orderController.getOrders);

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
