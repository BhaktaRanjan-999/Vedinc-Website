import prisma from "../../lib/prisma";
import { UserRole } from "@prisma/client";

/* =========================
   CREATE INSTRUCTOR (ADMIN USER)
========================= */
export const createInstructorService = async (data: {
    name: string;
    email: string;
    passwordHash: string;
    bio?: string;
    title?: string;
    avatar?: string;
}) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash,
            role: UserRole.ADMIN,
            bio: data.bio || null,
            title: data.title || null,
            avatar: data.avatar || null,
        },
    });
};

/* =========================
   UPDATE INSTRUCTOR
========================= */
export const updateInstructorService = async (
    id: string,
    data: {
        name?: string;
        bio?: string;
        title?: string;
        avatar?: string;
    }
) => {
    return prisma.user.update({
        where: { id },
        data,
    });
};

/* =========================
   LIST INSTRUCTORS
========================= */
export const listInstructorsService = async () => {
    return prisma.user.findMany({
        where: {
            role: {
                in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            title: true,
            avatar: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

/* =========================
   DELETE INSTRUCTOR
========================= */
export const deleteInstructorService = async (id: string) => {
    return prisma.user.delete({
        where: { id },
    });
};