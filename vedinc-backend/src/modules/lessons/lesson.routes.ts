import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { uploadPdf } from "../../middlewares/upload.middleware";
import {
    createLessonController,
    deleteLessonController,
} from "./lesson.controller";

const router = Router();

/**
 * ADMIN: Create Lesson
 * For PDF → send file
 * For VIDEO → send videoUrl in body
 */
router.post(
    "/admin",
    authenticate,
    requireRole("ADMIN"),
    uploadPdf.single("file"),
    createLessonController
);

/**
 * ADMIN: Delete Lesson
 */
router.delete(
    "/:id",
    authenticate,
    requireRole("ADMIN"),
    deleteLessonController
);

export default router;
