import { Request, Response } from "express";
import nodemailer from "nodemailer";
import prisma from "../../lib/prisma";
import { UserRole } from "@prisma/client";

/* =========================
   INITIATE ENROLLMENT
========================= */
export const initiateEnrollmentController = async (
    req: Request,
    res: Response
) => {
    try {
        const { courseId, fullName, email, phone } = req.body;

        if (!courseId || !fullName || !email || !phone) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // 🔥 Auto-create user if not exists
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: fullName,
                    email,
                    passwordHash: "PUBLIC_USER_NO_LOGIN",
                    role: UserRole.USER,
                },
            });
        }

        // Prevent duplicate enrollment
        const existing = await prisma.enrollment.findFirst({
            where: {
                userId: user.id,
                courseId,
            },
        });

        if (existing) {
            return res.json({
                message: "Already enrolled",
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId,
                fullName,
                email,
                phone,
            },
        });

        // Optional email notification
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Enrollment Confirmation - ${course.title}`,
                html: `
                    <h2>Enrollment Successful 🎉</h2>
                    <p>Hi ${fullName},</p>
                    <p>You have successfully enrolled in <b>${course.title}</b>.</p>
                `,
            });
        }

        return res.status(201).json({
            message: "Enrollment successful",
        });
    } catch (error: any) {
        console.error("Enrollment Error:", error);
        return res.status(400).json({
            message: error.message || "Enrollment failed",
        });
    }
};

/* =========================
   CHECK ENROLLMENT (EMAIL BASED)
========================= */
export const checkEnrollmentController = async (
    req: Request,
    res: Response
) => {
    try {
        const courseId = req.params.courseId as string;
        const email = req.query.email as string;

        if (!courseId || !email) {
            return res.json({ enrolled: false });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.json({ enrolled: false });
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: user.id,
                courseId: courseId, // ✅ now strictly string
            },
        });

        return res.json({ enrolled: !!enrollment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to check enrollment",
        });
    }
};

/* =========================
   DELETE ENROLLMENT
========================= */
export const deleteEnrollmentController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;

        await prisma.enrollment.delete({
            where: { id },
        });

        return res.json({
            message: "Enrollment deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete enrollment",
        });
    }
};