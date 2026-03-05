"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function updateSettings(formData: FormData) {
    const supabase = await createClient();

    // Ensure user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    const updates = {
        full_name: formData.get("full_name"),
        phone_number: formData.get("phone_number"),
        bybit_uid: formData.get("bybit_uid"),
        mt_account: formData.get("mt_account"),
        contact_handle: formData.get("contact_handle"),
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

    if (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();

    // Ensure user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    const password = formData.get("new_password") as string;
    if (!password || password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function deleteAccount() {
    const supabaseAnon = await createClient();

    // First quickly verify they are logged in from the client context
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
    if (userError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    // Now securely delete the user completely from the database using service role bypassing RLS
    // We import this directly so we have admin access

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
        return { success: false, error: "Missing Service Role Key configuration." };
    }

    const adminAuthClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }).auth.admin;

    // Delete user from auth map, Postgres RLS will cascade delete profiles
    const { error } = await adminAuthClient.deleteUser(user.id);

    if (error) {
        console.error("Failed to delete user:", error);
        return { success: false, error: "Failed to delete account from system." };
    }

    // Finally log them out locally
    await supabaseAnon.auth.signOut();

    return { success: true };
}
