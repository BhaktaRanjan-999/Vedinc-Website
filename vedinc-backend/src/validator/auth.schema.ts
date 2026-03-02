import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(5, "Name must be at least 5 characters")
        .max(50, "Name too long")
        .trim(),

    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password too long"),
});
