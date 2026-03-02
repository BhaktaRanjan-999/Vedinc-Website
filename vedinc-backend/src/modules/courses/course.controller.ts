import { Request, Response } from "express";
import {
    createCourseService,
    listCoursesService,
    getCourseContentService,
    deleteCourseService,
    updateCourseService,
} from "./course.service";

/* =========================
   ADMIN: Create Course
========================= */
export const createCourseController = async (req: Request, res: Response) => {
    try {
        const course = await createCourseService(req.body);
        return res.status(201).json(course);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to create course",
        });
    }
};

/* =========================
   PUBLIC: List Courses
========================= */
export const listCoursesController = async (_req: Request, res: Response) => {
    try {
        const courses = await listCoursesService();
        return res.json(courses);
    } catch {
        return res.status(500).json({
            message: "Failed to fetch courses",
        });
    }
};

/* =========================
   AUTH: Get Course Content
========================= */
export const getCourseContentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const course = await getCourseContentService(id as string);
        return res.json(course);
    } catch (error: any) {
        return res.status(404).json({
            message: error.message,
        });
    }
};

/* =========================
   ADMIN: Update Course
========================= */
export const updateCourseController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await updateCourseService(id as string, req.body);
        return res.json(updated);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to update course",
        });
    }
};

/* =========================
   ADMIN: Delete Course
========================= */
export const deleteCourseController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteCourseService(id as string);
        return res.json({ message: "Course deleted" });
    } catch {
        return res.status(500).json({
            message: "Failed to delete course",
        });
    }
};