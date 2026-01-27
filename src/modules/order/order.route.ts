import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "@/src/middleware/authMiddleware";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.CUSTOMER),
  orderController.createOrder,
);

export { router as orderRouter };
