import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { UserRole } from "@prisma/client";
import { uploadImage } from "../../middlewares/upload.middleware";
import { listAllEnrollments } from "./admin.controller";

import {
    createAdmin,
    listAllUsers,
    updateUserRole,
    deleteUser,
} from "./admin.controller";

const router = Router();

/* =========================
   CREATE INSTRUCTOR
========================= */
router.post(
    "/create-admin",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    uploadImage.single("avatar"),
    createAdmin
);

/* =========================
   USER MANAGEMENT (SUPER_ADMIN ONLY)
========================= */

// List all users
router.get(
    "/users",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    listAllUsers
);

// Update role
router.patch(
    "/users/:id/role",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    updateUserRole
);

// Delete user
router.delete(
    "/users/:id",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    deleteUser
);

// Get Enrollments
router.get(
    "/enrollments",
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    listAllEnrollments
);
export default router;