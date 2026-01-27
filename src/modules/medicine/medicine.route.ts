import { Router } from "express";
import { medicineController } from "./medicine.controller";

const router: Router = Router();

router.post("/", medicineController.addMedicine);

router.get("/", medicineController.getMedicines);

router.get("/:id", medicineController.getMedicine);

export { router as medicineRouter };
