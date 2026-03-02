import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";
import { UserRole } from "@prisma/client";
import { supabase } from "../../lib/supabase";
import { v4 as uuid } from "uuid";

/* =========================
   CREATE ADMIN (INSTRUCTOR)
========================= */
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, bio, title } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email and password are required" });
        }

        const exists = await prisma.user.findUnique({ where: { email } });

        if (exists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const passwordHash = await hashPassword(password);

        let avatarUrl: string | null = null;

        if (req.file) {
            const fileExt = req.file.originalname.split(".").pop();
            const fileName = `${uuid()}.${fileExt}`;

            const { error } = await supabase.storage
                .from("instructor-avatars")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) throw new Error("Failed to upload avatar");

            const { data } = supabase.storage
                .from("instructor-avatars")
                .getPublicUrl(fileName);

            avatarUrl = data.publicUrl;
        }

        const admin = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: UserRole.ADMIN,
                bio: bio || null,
                title: title || null,
                avatar: avatarUrl || null,
            },
        });

        return res.status(201).json({
            message: "Instructor created successfully",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to create admin",
        });
    }
};

/* =========================
   LIST ONLY ADMINS (FIXED)
========================= */
export const listAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                bio: true,
                title: true,
                avatar: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};

/* =========================
   UPDATE USER ROLE
========================= */
export const updateUserRole = async (
    req: Request<{ id: string }, {}, { role: UserRole }>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !Object.values(UserRole).includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user?.id === id) {
            return res.status(400).json({
                message: "You cannot modify your own role",
            });
        }

        if (
            user.role === UserRole.SUPER_ADMIN &&
            role !== UserRole.SUPER_ADMIN
        ) {
            const superAdminCount = await prisma.user.count({
                where: { role: UserRole.SUPER_ADMIN },
            });

            if (superAdminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot demote the last SUPER_ADMIN",
                });
            }
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return res.json({
            message: "Role updated successfully",
            user: {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to update role",
        });
    }
};

/* =========================
   DELETE USER (SAFE)
========================= */
export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user?.id === id) {
            return res.status(400).json({
                message: "You cannot delete your own account",
            });
        }

        if (user.role === UserRole.SUPER_ADMIN) {
            const superAdminCount = await prisma.user.count({
                where: { role: UserRole.SUPER_ADMIN },
            });

            if (superAdminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot delete the last SUPER_ADMIN",
                });
            }
        }

        const courseCount = await prisma.course.count({
            where: { instructorId: id },
        });

        if (courseCount > 0) {
            return res.status(400).json({
                message:
                    "Cannot delete instructor with assigned courses. Reassign courses first.",
            });
        }

        await prisma.user.delete({
            where: { id },
        });

        return res.json({
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to delete user",
        });
    }
};

/* =========================
   LIST ALL ENROLLMENTS (SUPER_ADMIN)
========================= */
export const listAllEnrollments = async (
    _req: Request,
    res: Response
) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json(enrollments);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to fetch enrollments",
        });
    }
};