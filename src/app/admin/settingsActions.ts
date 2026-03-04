"use server";

import { updateSiteSettings, SiteSettings } from "@/lib/data/settings";
import { checkAuth } from "./actions";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(settings: Partial<SiteSettings>) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await updateSiteSettings(settings);
        revalidatePath("/", "layout"); // Revalidate all pages to see the new pricing numbers
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
