import prisma from "../../lib/prisma";

/* =========================
   ADMIN: Create Course
========================= */
export const createCourseService = async (data: {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    thumbnail?: string;
    instructorId?: string;
    level?: string;
    duration?: string;
    objectives?: string[];
}) => {
    return prisma.course.create({
        data: {
            title: data.title,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            thumbnail: data.thumbnail,
            instructorId: data.instructorId || null,
            level: data.level || null,
            duration: data.duration || null,
            objectives: data.objectives
                ? {
                    create: data.objectives.map((text) => ({ text })),
                }
                : undefined,
        },
    });
};

/* =========================
   PUBLIC: List Courses
========================= */
export const listCoursesService = async () => {
    return prisma.course.findMany({
        include: {
            category: true,
            instructor: {
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

/* =========================
   AUTH: Get Course Content
========================= */
export const getCourseContentService = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            category: true,
            instructor: {
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                },
            },
            objectives: true,
            modules: {
                orderBy: { createdAt: "asc" },
                include: {
                    lessons: {
                        orderBy: { createdAt: "asc" },
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            duration: true,
                            contentUrl: true, // 🔥 IMPORTANT FOR PDF OPEN
                            createdAt: true,
                        },
                    },
                },
            },
        },
    });

    if (!course) throw new Error("Course not found");

    return course;
};

/* =========================
   ADMIN: Update Course
========================= */
export const updateCourseService = async (
    id: string,
    data: {
        title?: string;
        description?: string;
        price?: number;
        categoryId?: string;
        thumbnail?: string;
        instructorId?: string;
        level?: string;
        duration?: string;
        objectives?: string[];
    }
) => {
    const updated = await prisma.course.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            thumbnail: data.thumbnail,
            instructorId: data.instructorId,
            level: data.level,
            duration: data.duration,
        },
    });

    if (data.objectives) {
        await prisma.courseObjective.deleteMany({
            where: { courseId: id },
        });

        await prisma.courseObjective.createMany({
            data: data.objectives.map((text) => ({
                text,
                courseId: id,
            })),
        });
    }

    return updated;
};

/* =========================
   ADMIN: Delete Course
========================= */
export const deleteCourseService = async (id: string) => {
    await prisma.course.delete({ where: { id } });
    return { success: true };
};