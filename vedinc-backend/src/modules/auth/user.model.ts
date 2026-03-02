import { UserRole } from "@prisma/client";

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
};
