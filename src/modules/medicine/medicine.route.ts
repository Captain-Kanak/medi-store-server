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

export { router as medicineRouter };
