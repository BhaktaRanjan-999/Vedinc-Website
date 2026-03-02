import "express";
import { UserRole } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            };
            file?: Express.Multer.File;
        }
    }
}

export { };