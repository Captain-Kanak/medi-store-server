import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "@/src/middleware/authMiddleware";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.ADMIN),
  categoryController.addCategory,
);

router.get("/", categoryController.getCategories);

export { router as categoryRouter };
