import prisma from "../../lib/prisma";

/**
 * ADMIN: Create Lesson inside Module
 */
export const createLessonService = async (data: {
    title: string;
    type: "PDF" | "VIDEO";
    contentUrl: string;
    moduleId: string;
    duration?: string;
}) => {
    return prisma.lesson.create({
        data: {
            title: data.title,
            type: data.type,
            contentUrl: data.contentUrl,
            moduleId: data.moduleId,
            duration: data.duration,
        },
    });
};

/**
 * ADMIN: Delete Lesson
 */
export const deleteLessonService = async (id: string) => {
    return prisma.lesson.delete({
        where: { id },
    });
};
