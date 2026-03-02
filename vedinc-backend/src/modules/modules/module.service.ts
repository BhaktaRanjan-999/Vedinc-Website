import prisma from "../../lib/prisma";

/**
 * ADMIN: Create Module inside Course
 */
export const createModuleService = async (data: {
    title: string;
    courseId: string;
}) => {
    return prisma.module.create({
        data: {
            title: data.title,
            courseId: data.courseId,
        },
    });
};

/**
 * ADMIN: Delete Module
 */
export const deleteModuleService = async (id: string) => {
    return prisma.module.delete({
        where: { id },
    });
};
