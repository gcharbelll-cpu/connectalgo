"use server";

import { promises as fs } from "fs";
import path from "path";

export interface Admin {
    id: string;
    email: string;
    password?: string; // Optional so we don't accidentally leak it to the frontend when listing
}

const dataFilePath = path.join(process.cwd(), "src", "lib", "data", "admins.json");

export async function getAdmins(): Promise<Admin[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf8");
        return JSON.parse(fileData) as Admin[];
    } catch (error) {
        console.error("Error reading admins.json:", error);
        return [];
    }
}

// Function specifically for the login process that returns the full object including passwords
export async function getAdminsForAuth(): Promise<Required<Admin>[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf8");
        return JSON.parse(fileData) as Required<Admin>[];
    } catch {
        return [];
    }
}

export async function saveAdmins(admins: Admin[]): Promise<boolean> {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(admins, null, 4));
        return true;
    } catch (error) {
        console.error("Error writing to admins.json:", error);
        return false;
    }
}
