"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type SiteSettings = {
    id: string;
    pro_seats_total: number;
    pro_seats_remaining: number;
    elite_seats_total: number;
    elite_seats_remaining: number;
    updated_at: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching site settings:", error);
        // Return default fallback if table doesn't exist yet or is empty
        return {
            id: 'fallback',
            pro_seats_total: 50,
            pro_seats_remaining: 14,
            elite_seats_total: 25,
            elite_seats_remaining: 5,
            updated_at: new Date().toISOString()
        };
    }

    return data;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
    const { id, ...updateData } = settings;

    // We update the first row (there should only be one)
    const { error } = await supabase
        .from('site_settings')
        .update({
            ...updateData,
            updated_at: new Date().toISOString()
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to update all (or just limit it)

    if (error) {
        console.error("Error updating site settings:", error);
        throw new Error(error.message);
    }

    return { success: true };
}
