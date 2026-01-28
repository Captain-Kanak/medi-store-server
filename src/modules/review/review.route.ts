import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "@/src/middleware/authMiddleware";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.CUSTOMER),
  reviewController.createReview,
);

router.patch(
  "/:id",
  authMiddleware(UserRoles.CUSTOMER),
  reviewController.updateReview,
);

export { router as reviewRouter };
