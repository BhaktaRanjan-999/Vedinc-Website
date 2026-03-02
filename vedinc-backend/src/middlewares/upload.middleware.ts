import multer from "multer";
import { Request } from "express";
import path from "path";

/* =========================
   PDF Upload
========================= */
export const uploadPdf = multer({
    storage: multer.memoryStorage(),

    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (
            file.mimetype !== "application/pdf" ||
            path.extname(file.originalname).toLowerCase() !== ".pdf"
        ) {
            return cb(new Error("Only valid PDF files allowed"));
        }

        cb(null, true);
    },

    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

/* =========================
   IMAGE Upload (For Instructor Avatar)
========================= */
export const uploadImage = multer({
    storage: multer.memoryStorage(),

    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, WEBP images allowed"));
        }

        cb(null, true);
    },

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
