import prisma from "../../lib/prisma";
import { UserRole } from "@prisma/client";

export const findUserByEmail = (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const createUser = (
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole
) => {
    return prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
        },
    });
};
