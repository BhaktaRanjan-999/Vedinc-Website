import prisma from "../../lib/prisma";

/**
 * ADMIN: Create Category
 */
export const createCategoryService = async (name: string) => {
    return prisma.category.create({
        data: { name },
    });
};

/**
 * PUBLIC: List Categories
 */
export const listCategoriesService = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });
};

/**
 * ADMIN: Delete Category
 */
export const deleteCategoryService = async (id: string) => {
    return prisma.category.delete({
        where: { id },
    });
};
