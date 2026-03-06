"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStrategies, saveStrategies, Strategy } from "@/lib/data/strategies";

import { getAdminsForAuth } from "@/lib/data/admins";

const SESSION_COOKIE = "admin_session";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Please provide both email and password" };
    }

    const admins = await getAdminsForAuth();

    // Find matching admin
    const validAdmin = admins.find(a =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    );

    if (validAdmin) {
        (await cookies()).set(SESSION_COOKIE, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return { success: true };
    } else {
        return { success: false, error: "Invalid email or password" };
    }
}

export async function logout() {
    (await cookies()).delete(SESSION_COOKIE);
    redirect("/admin/login");
}

export async function checkAuth() {
    const session = (await cookies()).get(SESSION_COOKIE);
    return session?.value === "true";
}

export async function updateStrategy(strategy: Strategy) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error("Unauthorized");
    }

    const strategies = await getStrategies();
    const index = strategies.findIndex((s) => s.id === strategy.id);

    if (index === -1) {
        throw new Error("Strategy not found");
    }

    // Update the strategy
    strategies[index] = strategy;

    // Save to file
    await saveStrategies(strategies);

    return { success: true };
}

export async function addStrategy(strategy: Strategy) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error("Unauthorized");
    }

    const strategies = await getStrategies();

    // Ensure ID is unique, generate one if not provided
    if (!strategy.id) {
        strategy.id = strategy.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Check if ID already exists
    if (strategies.some(s => s.id === strategy.id)) {
        // Append a random string to make it unique
        strategy.id = `${strategy.id}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Add exactly at the end
    strategies.push(strategy);

    // Save to file
    await saveStrategies(strategies);

    return { success: true, id: strategy.id };
}

export async function deleteStrategy(id: string) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error("Unauthorized");
    }

    let strategies = await getStrategies();

    // Check if it exists before trying to delete
    const exists = strategies.some(s => s.id === id);
    if (!exists) {
        return { success: false, error: "Strategy not found" };
    }

    // Filter out the deleted one
    strategies = strategies.filter(s => s.id !== id);

    // Save to file
    await saveStrategies(strategies);

    return { success: true };
}

export async function uploadStrategyRecord(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No file provided" };
    }

    try {
        const { createClient } = await import("@supabase/supabase-js");

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase environment variables");
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { persistSession: false } }
        );

        // Create a unique filename
        const fileExt = file.name.split('.').pop() || 'bin';
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
            .from('strategy_records')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, error: "Failed to upload file to storage" };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('strategy_records')
            .getPublicUrl(fileName);

        return { success: true, url: urlData.publicUrl };
    } catch (error) {
        console.error("Upload handler error:", error);
        return { success: false, error: "An unexpected error occurred during upload" };
    }
}
