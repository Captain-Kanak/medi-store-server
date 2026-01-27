import { Router } from "express";
import { categoryController } from "./category.controller";

const router: Router = Router();

router.get("/", categoryController.getCategories);

export { router as categoryRouter };
