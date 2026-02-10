import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.get(
  "/metrics",
  authMiddleware(UserRoles.ADMIN),
  userController.getUsersMetrics,
);

router.patch("/", authMiddleware(), userController.updateProfile);

export { router as userRouter };
