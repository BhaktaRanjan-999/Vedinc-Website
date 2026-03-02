import { Request, Response } from "express";
import {
    createCategoryService,
    listCategoriesService,
    deleteCategoryService,
} from "./category.service";

/**
 * ADMIN: Create Category
 */
export const createCategoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name required",
            });
        }

        const category = await createCategoryService(name);

        return res.status(201).json(category);
    } catch (error: any) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

/**
 * PUBLIC: List Categories
 */
export const listCategoriesController = async (
    _req: Request,
    res: Response
) => {
    const categories = await listCategoriesService();
    return res.json(categories);
};

/**
 * ADMIN: Delete Category
 */
export const deleteCategoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Category ID required",
            });
        }

        await deleteCategoryService(id as string);

        return res.json({
            message: "Category deleted",
        });
    } catch {
        return res.status(500).json({
            message: "Failed to delete category",
        });
    }
};
