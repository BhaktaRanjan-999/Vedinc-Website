import { Router } from "express";
import {
    initiateEnrollmentController,
    checkEnrollmentController,
    deleteEnrollmentController,
} from "./enrollment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/* PUBLIC */
router.post("/initiate", initiateEnrollmentController);
router.get("/check/:courseId", checkEnrollmentController);

/* ADMIN */
router.delete(
    "/:id",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    deleteEnrollmentController
);

export default router;