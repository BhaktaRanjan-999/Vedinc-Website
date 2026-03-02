import { Request, Response } from "express";
import {
    createInstructorService,
    updateInstructorService,
    listInstructorsService,
    deleteInstructorService,
} from "./instructor.service";
import { supabase } from "../../lib/supabase";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../../utils/hash";

export const createInstructorController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, email, password, title, bio } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        let avatarUrl = "";

        if (req.file) {
            const fileExt = req.file.originalname.split(".").pop();
            const fileName = `${uuid()}.${fileExt}`;

            const { error } = await supabase.storage
                .from("instructor-avatars")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) throw new Error("Failed to upload image");

            const { data } = supabase.storage
                .from("instructor-avatars")
                .getPublicUrl(fileName);

            avatarUrl = data.publicUrl;
        }

        const passwordHash = await hashPassword(password);

        const instructor = await createInstructorService({
            name,
            email,
            passwordHash,
            bio,
            title,
            avatar: avatarUrl,
        });

        return res.status(201).json(instructor);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateInstructorController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { name, title, bio } = req.body;

        let data: any = {
            name,
            title,
            bio,
        };

        if (req.file) {
            const fileExt = req.file.originalname.split(".").pop();
            const fileName = `${uuid()}.${fileExt}`;

            const { error } = await supabase.storage
                .from("instructor-avatars")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) throw new Error("Failed to upload image");

            const { data: publicData } = supabase.storage
                .from("instructor-avatars")
                .getPublicUrl(fileName);

            data.avatar = publicData.publicUrl;
        }

        const instructor = await updateInstructorService(id as string, data);

        return res.json(instructor);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const listInstructorsController = async (
    _req: Request,
    res: Response
) => {
    const instructors = await listInstructorsService();
    return res.json(instructors);
};

export const deleteInstructorController = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    await deleteInstructorService(id as string);
    return res.json({ message: "Instructor deleted" });
};