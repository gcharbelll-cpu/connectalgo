"use server";

import fs from "fs";
import path from "path";

export type SiteSettings = {
    id: string;
    pro_seats_total: number;
    pro_seats_remaining: number;
    elite_seats_total: number;
    elite_seats_remaining: number;
    updated_at: string;
};

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/data/settings.json");

const defaultSettings: SiteSettings = {
    id: 'site_settings',
    pro_seats_total: 50,
    pro_seats_remaining: 14,
    elite_seats_total: 25,
    elite_seats_remaining: 5,
    updated_at: new Date().toISOString()
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            // If file doesn't exist, return default settings
            return defaultSettings;
        }

        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading site settings:", error);
        return defaultSettings;
    }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
    try {
        const currentSettings = await getSiteSettings();

        const newSettings = {
            ...currentSettings,
            ...settings,
            updated_at: new Date().toISOString()
        };

        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newSettings, null, 2), "utf-8");
        return { success: true };
    } catch (error) {
        console.error("Error updating site settings:", error);
        throw new Error("Failed to save site settings to file");
    }
}
