import { checkAuth } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTestimonials } from "@/lib/data/testimonials";
import { TestimonialsManager } from "./_components/TestimonialsManager";

export default async function AdminTestimonialsPage() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const testimonials = await getTestimonials();

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                        Manage Reviews
                    </h1>
                    <p className="text-slate-400">
                        Add, edit, or remove client testimonials. These will instantly display on your public homepage.
                    </p>
                </div>

                <TestimonialsManager initialData={testimonials} />
            </div>
        </div>
    );
}
