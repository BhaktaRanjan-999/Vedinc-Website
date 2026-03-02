import { supabase } from "../lib/supabase";

export const uploadPdfToSupabase = async (
    file: Express.Multer.File
) => {
    const fileName = `pdfs/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
        .from("pdf-courses")
        .upload(fileName, file.buffer, {
            contentType: "application/pdf",
        });

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("pdf-courses")
        .getPublicUrl(fileName);

    return data.publicUrl;
};
