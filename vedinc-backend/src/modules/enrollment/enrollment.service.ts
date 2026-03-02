import prisma from "../../lib/prisma";

export const createEnrollmentService = async ({
    userId,
    courseId,
    fullName,
    email,
    phone,
}: {
    userId: string;
    courseId: string;
    fullName: string;
    email: string;
    phone: string;
}) => {
    const existing = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });

    if (existing) {
        throw new Error("You are already enrolled in this course");
    }

    return prisma.enrollment.create({
        data: {
            userId,
            courseId,
            fullName,
            email,
            phone,
            status: "ACTIVE",
        },
    });
};

export const getUserEnrollmentsService = async (userId: string) => {
    return prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const checkEnrollmentService = async (
    userId: string,
    courseId: string
) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });

    return !!enrollment;
};