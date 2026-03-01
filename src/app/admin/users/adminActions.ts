"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateUserProfile(userId: string, updates: any) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
