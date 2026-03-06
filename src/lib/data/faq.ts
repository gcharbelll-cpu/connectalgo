"use server";

import { createClient } from "@supabase/supabase-js";

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

// Ensure the environment variables exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables");
}

// We use the service role key here to bypass any potential Row Level Security on the server
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            persistSession: false,
        }
    }
);

export async function getFaqs(): Promise<FAQ[]> {
    try {
        const { data, error } = await supabase
            .from("faqs")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data as FAQ[];
    } catch (error) {
        console.error("Error reading faqs from Supabase:", error);
        return [];
    }
}

export async function saveFaqs(faqs: FAQ[]): Promise<boolean> {
    try {
        // Upsert all records
        const { error } = await supabase
            .from("faqs")
            .upsert(faqs);

        if (error) throw error;

        // Safely wipe out any FAQs the user deleted in the UI
        const { data: currentDbFaqs } = await supabase.from("faqs").select("id");
        if (currentDbFaqs) {
            const newFaqIds = faqs.map(f => f.id);
            const idsToDelete = currentDbFaqs
                .map(dbF => dbF.id)
                .filter(id => !newFaqIds.includes(id));

            if (idsToDelete.length > 0) {
                await supabase.from("faqs").delete().in("id", idsToDelete);
            }
        }

        return true;
    } catch (error) {
        console.error("Error writing faqs to Supabase:", error);
        return false;
    }
}
