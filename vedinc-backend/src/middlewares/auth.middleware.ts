import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const token = header.split(" ")[1];
        const payload = verifyToken(token);

        // JWT payload should contain { id, role }
        req.user = payload;

        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};