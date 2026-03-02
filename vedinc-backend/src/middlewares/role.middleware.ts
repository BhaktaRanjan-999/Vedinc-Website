import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
};

export const requireRole =
    (...roles: UserRole[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userLevel = roleHierarchy[req.user.role];
            const allowed = roles.some(
                (role) => userLevel >= roleHierarchy[role]
            );

            if (!allowed) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        };
