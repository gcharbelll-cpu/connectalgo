"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function updateUserProfile(userId: string, updates: any) {
    try {
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) {
            console.error("Error updating user:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Exception updating user:", err);
        return { success: false, error: err.message || "Internal Server Error" };
    }
}

export async function deleteUserAccount(userId: string) {
    console.log(`Attempting to delete user: ${userId}`);

    try {
        // We must use the Service Role Key to bypass RLS and delete from the Auth schema directly
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // This deletes the user from auth.users. 
        // Because we set ON DELETE CASCADE in the SQL schema, their 'profiles' row is auto-deleted too.
        const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            console.error("Error deleting user:", error);
            return { success: false, error: error.message };
        }

        console.log(`Successfully deleted user: ${userId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Critical Exception deleting user:", err);
        return { success: false, error: err.message || "Internal Server Error" };
    }
}
