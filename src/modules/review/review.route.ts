import { Router } from "express";
import { reviewController } from "./review.controller.js";
import { UserRoles } from "@prisma/client";
import { authMiddleware } from "../../middleware/authMiddleware.js";

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
