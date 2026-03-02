import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { signToken } from "../../utils/jwt";
import { createUser, findUserByEmail } from "./auth.repo";
import { hashPassword } from "../../utils/hash";
import { UserRole } from "@prisma/client";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const user = await loginUser(email, password);

        const token = signToken({
            id: user.id,
            role: user.role,
        });

        return res.json({
            message: "Login successful",
            token,
            user,
        });
    } catch {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }
};

// ✅ NEW: SIGNUP
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // prevent duplicate emails
        const exists = await findUserByEmail(email);
        if (exists) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const passwordHash = await hashPassword(password);

        const user = await createUser(
            name,
            email,
            passwordHash,
            UserRole.USER // 🔒 force USER role
        );

        const token = signToken({
            id: user.id,
            role: user.role,
        });

        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Signup failed",
        });
    }
};
