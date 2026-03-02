import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const requireEnrollment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const courseId = req.params.courseId;

        if (!courseId || Array.isArray(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user!.id,
                    courseId,
                },
            },
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "Access denied. Not enrolled.",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Enrollment validation failed",
        });
    }
};
