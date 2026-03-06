"use server";

import { createClient } from "@supabase/supabase-js";

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
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

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data as Testimonial[];
    } catch (error) {
        console.error("Error reading testimonials from Supabase:", error);
        return [];
    }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<{ success: boolean; error?: string }> {
    try {
        // Upsert all records
        const { error } = await supabase
            .from("testimonials")
            .upsert(testimonials);

        if (error) throw error;

        // Clean up deletions
        const { data: currentDbTestimonials } = await supabase.from("testimonials").select("id");
        if (currentDbTestimonials) {
            const newIds = testimonials.map(t => t.id);
            const idsToDelete = currentDbTestimonials
                .map(dbT => dbT.id)
                .filter(id => !newIds.includes(id));

            if (idsToDelete.length > 0) {
                await supabase.from("testimonials").delete().in("id", idsToDelete);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error writing testimonials to Supabase:", error);
        return { success: false, error: error.message || "Failed to save testimonials" };
    }
}
