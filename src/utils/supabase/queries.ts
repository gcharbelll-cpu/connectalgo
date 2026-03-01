import { createClient } from "./server";

export async function getUserProfile() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return null; // Not logged in
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        // Silent failure if row doesn't exist yet, instead of throwing an unhandled exception
        return null;
    }

    return profile;
}

export async function requireAuth() {
    const profile = await getUserProfile();

    if (!profile) {
        // We throw an error that the calling page should catch and redirect to /sign-in
        throw new Error("UNAUTHORIZED");
    }

    return profile;
}

export async function getAllUsers() {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('join_date', { ascending: false });

    if (error) {
        console.error("Error fetching all users:", error);
        return [];
    }

    return profiles;
}

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
