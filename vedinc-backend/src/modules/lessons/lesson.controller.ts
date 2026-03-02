import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import {
    createLessonService,
    deleteLessonService,
} from "./lesson.service";
import { uploadPdfToSupabase } from "../../utils/uploadPdf";

/**
 * ADMIN: Create Lesson
 */
export const createLessonController = async (
    req: Request,
    res: Response
) => {
    try {
        const { title, type, moduleId, duration, videoUrl } = req.body;

        if (!title || !type || !moduleId) {
            return res.status(400).json({
                message: "Title, type and moduleId are required",
            });
        }

        let contentUrl = "";

        if (type === "PDF") {
            if (!req.file) {
                return res.status(400).json({
                    message: "PDF file required",
                });
            }

            contentUrl = await uploadPdfToSupabase(req.file);
        }

        if (type === "VIDEO") {
            if (!videoUrl) {
                return res.status(400).json({
                    message: "Video URL required",
                });
            }

            contentUrl = videoUrl;
        }

        const lesson = await createLessonService({
            title,
            type,
            contentUrl,
            moduleId,
            duration,
        });

        return res.status(201).json(lesson);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to create lesson",
        });
    }
};

/**
 * USER: Get Lesson (Enrollment Protected)
 */
export const getLessonByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        const lesson = await prisma.lesson.findUnique({
            where: { id: id as string },
            include: {
                module: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found",
            });
        }

        // 🔐 Check enrollment in parent course
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user!.id,
                    courseId: lesson.module.course.id,
                },
            },
        });

        if (!enrollment || enrollment.status !== "ACTIVE") {
            return res.status(403).json({
                message: "You are not enrolled in this course",
            });
        }

        return res.status(200).json({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration,
            contentUrl: lesson.contentUrl,
        });
    } catch {
        return res.status(500).json({
            message: "Unable to fetch lesson",
        });
    }
};

/**
 * ADMIN: Delete Lesson
 */
export const deleteLessonController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Lesson ID required",
            });
        }

        await deleteLessonService(id as string);

        return res.json({
            message: "Lesson deleted",
        });
    } catch {
        return res.status(500).json({
            message: "Failed to delete lesson",
        });
    }
};