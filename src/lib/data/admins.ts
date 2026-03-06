"use server";

import { createClient } from "@supabase/supabase-js";

export interface Admin {
    id: string;
    email: string;
    password?: string; // Optional so we don't accidentally leak it to the frontend when listing
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

export async function getAdmins(): Promise<Admin[]> {
    try {
        const { data, error } = await supabase
            .from("admins")
            .select("id, email"); // explicitly exclude password

        if (error) throw error;
        return data as Admin[];
    } catch (error) {
        console.error("Error reading admins from Supabase:", error);
        return [];
    }
}

// Function specifically for the login process that returns the full object including passwords
export async function getAdminsForAuth(): Promise<Required<Admin>[]> {
    try {
        const { data, error } = await supabase
            .from("admins")
            .select("id, email, password");

        if (error) throw error;
        return data as Required<Admin>[];
    } catch (error) {
        console.error("Error reading admins auth from Supabase:", error);
        return [];
    }
}

export async function saveAdmins(admins: Admin[]): Promise<boolean> {
    try {
        // Upsert all records
        const { error } = await supabase
            .from("admins")
            .upsert(admins);

        if (error) throw error;

        // Since the UI might have deleted someone, we need a way to clear out the ones missing from the new array.
        // The safest way is to fetch the current IDs in the DB, see which ones are missing from the `admins` param, and delete them.
        const { data: currentDbAdmins } = await supabase.from("admins").select("id");
        if (currentDbAdmins) {
            const newAdminIds = admins.map(a => a.id);
            const idsToDelete = currentDbAdmins
                .map(dbA => dbA.id)
                .filter(id => !newAdminIds.includes(id));

            if (idsToDelete.length > 0) {
                await supabase.from("admins").delete().in("id", idsToDelete);
            }
        }

        return true;
    } catch (error) {
        console.error("Error writing admins to Supabase:", error);
        return false;
    }
}
