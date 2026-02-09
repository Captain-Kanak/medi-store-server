import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { UserRoles } from "@prisma/client";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.ADMIN),
  categoryController.addCategory,
);

router.get("/", categoryController.getCategories);

router.patch(
  "/:id",
  authMiddleware(UserRoles.ADMIN),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware(UserRoles.ADMIN),
  categoryController.deleteCategory,
);

export { router as categoryRouter };
