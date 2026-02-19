"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStrategies, saveStrategies, Strategy } from "@/lib/data/strategies";

// Simple hardcoded password for demo purposes
// In production, use process.env.ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "admin_session";

export async function login(formData: FormData) {
    const password = formData.get("password");

    if (password === ADMIN_PASSWORD) {
        (await cookies()).set(SESSION_COOKIE, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return { success: true };
    } else {
        return { success: false, error: "Invalid password" };
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
