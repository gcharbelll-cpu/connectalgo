"use server";

import { createClient } from "@supabase/supabase-js";

export type SiteSettings = {
    id: string;
    pro_seats_total: number;
    pro_seats_remaining: number;
    elite_seats_total: number;
    elite_seats_remaining: number;
    hero_total_return: string;
    hero_active_investors: string;
    hero_strategies: string;
    whatsapp_number: string;
    updated_at: string;
};

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

const defaultSettings: SiteSettings = {
    id: 'site_settings',
    pro_seats_total: 50,
    pro_seats_remaining: 14,
    elite_seats_total: 25,
    elite_seats_remaining: 5,
    hero_total_return: "+2,450%",
    hero_active_investors: "1,500+",
    hero_strategies: "4",
    whatsapp_number: "96176374971",
    updated_at: new Date().toISOString()
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .limit(1)
            .single();

        if (error || !data) {
            // Return defaults if table is empty or missing
            return defaultSettings;
        }

        return data as SiteSettings;
    } catch (error) {
        console.error("Error reading site settings from Supabase:", error);
        return defaultSettings;
    }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
    try {
        const currentSettings = await getSiteSettings();

        // Standardize the ID we use to always have one row
        const recordId = currentSettings.id === 'fallback' ? 'fallback' : 'site_settings';

        const newSettings = {
            ...currentSettings,
            ...settings,
            id: recordId,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("settings")
            .upsert([newSettings]);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Error updating site settings in Supabase:", error);
        throw new Error(error.message || "Failed to save site settings to Supabase");
    }
}
