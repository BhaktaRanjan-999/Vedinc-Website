import { supabase } from "../lib/supabase";

export const deletePdfFromSupabase = async (url: string) => {
    console.log("RAW URL:", url);

    const match = url.match(/pdf-courses\/(.+?)(\?|$)/);

    if (!match || !match[1]) {
        throw new Error("Could not extract file path from URL");
    }

    // 🔑 DECODE URL ENCODING (%20 → space)
    const filePath = decodeURIComponent(match[1]);

    console.log("DELETING FILE PATH:", filePath);

    const { error } = await supabase.storage
        .from("pdf-courses")
        .remove([filePath]);

    if (error) {
        console.error("SUPABASE DELETE ERROR:", error);
        throw error;
    }

    console.log("PDF DELETED SUCCESSFULLY");
};
