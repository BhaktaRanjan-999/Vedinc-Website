import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
    createCourseController,
    listCoursesController,
    getCourseContentController,
    deleteCourseController,
    updateCourseController,
} from "./course.controller";
import { UserRole } from "@prisma/client";

const router = Router();

/* PUBLIC */
router.get("/", listCoursesController);

/* AUTH */
router.get("/:id", getCourseContentController);

/* ADMIN */
router.post(
    "/admin",
    authenticate,
    requireRole(UserRole.ADMIN),
    createCourseController
);

router.put(
    "/:id",
    authenticate,
    requireRole(UserRole.ADMIN),
    updateCourseController
);

router.delete(
    "/:id",
    authenticate,
    requireRole(UserRole.ADMIN),
    deleteCourseController
);

export default router;