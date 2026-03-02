import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
    createModuleController,
    deleteModuleController,
} from "./module.controller";

const router = Router();

/**
 * ADMIN: Create Module
 */
router.post(
    "/admin",
    authenticate,
    requireRole("ADMIN"),
    createModuleController
);

/**
 * ADMIN: Delete Module
 */
router.delete(
    "/:id",
    authenticate,
    requireRole("ADMIN"),
    deleteModuleController
);

export default router;
