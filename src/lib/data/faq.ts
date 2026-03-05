"use server";

import { promises as fs } from "fs";
import path from "path";

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

const dataFilePath = path.join(process.cwd(), "src", "lib", "data", "faq.json");

export async function getFaqs(): Promise<FAQ[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf8");
        return JSON.parse(fileData) as FAQ[];
    } catch (error) {
        console.error("Error reading faq.json:", error);
        return [];
    }
}

export async function saveFaqs(faqs: FAQ[]): Promise<boolean> {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(faqs, null, 4));
        return true;
    } catch (error) {
        console.error("Error writing to faq.json:", error);
        return false;
    }
}
