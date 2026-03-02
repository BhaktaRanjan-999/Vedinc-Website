import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getMyProfileController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

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
            },
        });

        res.json(user);
    } catch {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

export const updateMyProfileController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;
        const { name, bio, title } = req.body;

        let avatarPath: string | undefined;

        if (req.file) {
            avatarPath = `/uploads/${req.file.filename}`;
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                title,
                ...(avatarPath && { avatar: avatarPath }),
            },
        });

        res.json(updated);
    } catch {
        res.status(500).json({ message: "Failed to update profile" });
    }
};