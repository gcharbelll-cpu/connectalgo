"use server";

import { revalidatePath } from "next/cache";
import { getTestimonials, saveTestimonials, Testimonial } from "@/lib/data/testimonials";

export async function addTestimonial(testimonial: Testimonial) {
    const testimonials = await getTestimonials();

    // Auto-generate ID if not provided
    if (!testimonial.id) {
        testimonial.id = testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    }

    testimonials.push(testimonial);
    const result = await saveTestimonials(testimonials);

    if (result.success) {
        revalidatePath('/');
        revalidatePath('/admin/testimonials');
    }
    return result;
}

export async function updateTestimonial(id: string, updatedData: Partial<Testimonial>) {
    const testimonials = await getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);

    if (index === -1) {
        return { success: false, error: "Testimonial not found" };
    }

    testimonials[index] = { ...testimonials[index], ...updatedData };
    const result = await saveTestimonials(testimonials);

    if (result.success) {
        revalidatePath('/');
        revalidatePath('/admin/testimonials');
    }
    return result;
}

export async function deleteTestimonial(id: string) {
    let testimonials = await getTestimonials();
    testimonials = testimonials.filter(t => t.id !== id);

    const result = await saveTestimonials(testimonials);

    if (result.success) {
        revalidatePath('/');
        revalidatePath('/admin/testimonials');
    }
    return result;
}
