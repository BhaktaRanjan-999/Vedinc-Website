import { supabase } from "../lib/supabase";

export const getSignedPdfUrl = async (
    publicUrl: string,
    expiresInSeconds = 300
) => {
    const marker = "/storage/v1/object/public/pdf-courses/";

    if (!publicUrl.includes(marker)) {
        throw new Error("Invalid PDF URL");
    }

    const filePath = publicUrl.split(marker)[1];

    const { data, error } = await supabase.storage
        .from("pdf-courses")
        .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
        throw error;
    }

    return data.signedUrl;
};
