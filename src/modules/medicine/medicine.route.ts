import { Router } from "express";
import { medicineController } from "./medicine.controller.js";
import { UserRoles } from "@prisma/client";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRoles.SELLER),
  medicineController.addMedicine,
);

router.get("/", medicineController.getMedicines);

router.get(
  "/seller",
  authMiddleware(UserRoles.SELLER),
  medicineController.getSellerMedicines,
);

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
