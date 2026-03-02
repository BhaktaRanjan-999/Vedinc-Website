import { Request, Response } from "express";
import prisma from "../../lib/prisma";

/* =========================
   GET MY PROFILE
========================= */
export const getMyProfileController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                title: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        });

        return res.json(user);
    } catch {
        return res.status(500).json({
            message: "Failed to fetch profile",
        });
    }
};

/* =========================
   UPDATE MY PROFILE
========================= */
export const updateMyProfileController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        const { name, bio, title, avatar } = req.body;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                title,
                avatar,
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                title: true,
                avatar: true,
                role: true,
            },
        });

        return res.json(updated);
    } catch {
        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
};