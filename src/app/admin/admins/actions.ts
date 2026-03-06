"use server";

import { revalidatePath } from "next/cache";
import { getAdminsForAuth, saveAdmins, Admin } from "@/lib/data/admins";
import { checkAuth } from "@/app/admin/actions";

export async function addAdminAction(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return { success: false, error: "Unauthorized" };

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    const admins = await getAdminsForAuth();

    if (admins.some(a => a.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "An admin with this email already exists" };
    }

    const newAdmin: Required<Admin> = {
        id: `admin-${Date.now()}`,
        email,
        password
    };

    admins.push(newAdmin);
    await saveAdmins(admins);

    revalidatePath("/admin/admins");
    return { success: true };
}

export async function updateAdminAction(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string; // Optional during edit

    if (!id || !email) {
        return { success: false, error: "ID and Email are required" };
    }

    const admins = await getAdminsForAuth();
    const index = admins.findIndex(a => a.id === id);

    if (index === -1) {
        return { success: false, error: "Admin not found" };
    }

    // Check for email collision (excluding this specific admin)
    if (admins.some(a => a.id !== id && a.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "Another admin with this email already exists" };
    }

    admins[index].email = email;
    if (password && password.trim() !== "") {
        admins[index].password = password;
    }

    await saveAdmins(admins);

    revalidatePath("/admin/admins");
    return { success: true };
}

export async function deleteAdminAction(id: string) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return { success: false, error: "Unauthorized" };

    const admins = await getAdminsForAuth();

    // Prevent deleting the very last admin
    if (admins.length <= 1) {
        return { success: false, error: "Cannot delete the only remaining admin" };
    }

    const filteredAdmins = admins.filter(a => a.id !== id);
    await saveAdmins(filteredAdmins);

    revalidatePath("/admin/admins");
    return { success: true };
}
