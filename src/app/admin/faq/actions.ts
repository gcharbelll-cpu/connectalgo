"use server";

import { revalidatePath } from "next/cache";
import { FAQ, getFaqs, saveFaqs } from "@/lib/data/faq";
import { checkAuth } from "@/app/admin/actions";

export async function addFaq(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const faqs = await getFaqs();
    const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
    };

    faqs.push(newFaq);
    await saveFaqs(faqs);

    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
}

export async function updateFaq(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    let faqs = await getFaqs();

    faqs = faqs.map(faq => {
        if (faq.id === id) {
            return {
                id,
                question: formData.get("question") as string,
                answer: formData.get("answer") as string,
            };
        }
        return faq;
    });

    await saveFaqs(faqs);

    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
}

export async function deleteFaq(id: string) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    let faqs = await getFaqs();
    faqs = faqs.filter(faq => faq.id !== id);

    await saveFaqs(faqs);

    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
}
