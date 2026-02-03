import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRoles } from "@prisma/client";
import { cartController } from "./cart.controller.js";

const router: Router = Router();

router.post("/", authMiddleware(UserRoles.CUSTOMER), cartController.addToCart);

router.patch(
  "/",
  authMiddleware(UserRoles.CUSTOMER),
  cartController.updateCart,
);

router.delete(
  "/",
  authMiddleware(UserRoles.CUSTOMER),
  cartController.deleteCart,
);

export { router as cartRouter };
