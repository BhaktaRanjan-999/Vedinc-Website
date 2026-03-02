import prisma from "../../lib/prisma";

export const createCourse = (
    title: string,
    categoryId: string,
    description: string,
    price: number,
    thumbnail?: string,
    instructorId?: string
) => {
    return prisma.course.create({
        data: {
            title,
            categoryId,
            description,
            price,
            thumbnail,
            instructorId,
        },
    });
};

export const getAllCourses = () => {
    return prisma.course.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const deleteCourseById = (id: string) => {
    return prisma.course.delete({
        where: { id },
    });
};
