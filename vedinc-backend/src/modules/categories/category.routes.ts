import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
    createCategoryController,
    listCategoriesController,
    deleteCategoryController,
} from "./category.controller";

const router = Router();

/**
 * PUBLIC: List Categories
 */
router.get("/", listCategoriesController);

/**
 * ADMIN: Create Category
 */
router.post(
    "/admin",
    authenticate,
    requireRole("ADMIN"),
    createCategoryController
);

/**
 * ADMIN: Delete Category
 */
router.delete(
    "/:id",
    authenticate,
    requireRole("ADMIN"),
    deleteCategoryController
);

export default router;
