import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { uploadImage } from "../../middlewares/upload.middleware";
import {
    createInstructorController,
    updateInstructorController,
    listInstructorsController,
    deleteInstructorController,
} from "./instructor.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", listInstructorsController);

router.post(
    "/admin",
    authenticate,
    requireRole(UserRole.ADMIN)
    ,
    uploadImage.single("avatar"),
    createInstructorController
);

router.put(
    "/admin/:id",
    authenticate,
    requireRole(UserRole.ADMIN),
    uploadImage.single("avatar"),
    updateInstructorController
);

router.delete(
    "/admin/:id",
    authenticate,
    requireRole(UserRole.ADMIN),
    deleteInstructorController
);

export default router;
