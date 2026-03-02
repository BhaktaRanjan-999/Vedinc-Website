import { Request, Response } from "express";
import {
    createModuleService,
    deleteModuleService,
} from "./module.service";

/**
 * ADMIN: Create Module
 */
export const createModuleController = async (
    req: Request,
    res: Response
) => {
    try {
        const { title, courseId } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({
                message: "Title and courseId are required",
            });
        }

        const module = await createModuleService({
            title,
            courseId,
        });

        return res.status(201).json(module);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to create module",
        });
    }
};

/**
 * ADMIN: Delete Module
 */
export const deleteModuleController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Module ID required",
            });
        }

        await deleteModuleService(id as string);

        return res.json({
            message: "Module deleted",
        });
    } catch {
        return res.status(500).json({
            message: "Failed to delete module",
        });
    }
};
