"use server";

import fs from "fs";
import path from "path";

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
}

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/data/testimonials.json");

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            console.warn("Testimonials file not found, returning empty array.");
            return [];
        }

        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading testimonials:", error);
        return [];
    }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<{ success: boolean; error?: string }> {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(testimonials, null, 2), "utf-8");
        return { success: true };
    } catch (error: any) {
        console.error("Error writing testimonials:", error);
        return { success: false, error: error.message || "Failed to save testimonials" };
    }
}
