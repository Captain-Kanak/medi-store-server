import { Router } from "express";
import { medicineController } from "./medicine.controller";
import { authMiddleware } from "@/src/middleware/authMiddleware";
import { UserRoles } from "@prisma/client";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.SELLER),
  medicineController.addMedicine,
);

router.get("/", medicineController.getMedicines);

router.get("/:id", medicineController.getMedicine);

router.patch(
  "/:id",
  authMiddleware(UserRoles.SELLER, UserRoles.ADMIN),
  medicineController.updateMedicine,
);

router.delete(
  "/:id",
  authMiddleware(UserRoles.SELLER, UserRoles.ADMIN),
  medicineController.deleteMedicine,
);

export { router as medicineRouter };
