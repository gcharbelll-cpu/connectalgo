import { checkAuth } from "../../actions";
import { redirect } from "next/navigation";
import { getFaqs } from "@/lib/data/faq";
import { FaqManager } from "./_components/FaqManager";
import { MessageSquareQuestion } from "lucide-react";

export default async function AdminFaqPage() {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const faqs = await getFaqs();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <MessageSquareQuestion className="h-8 w-8 text-emerald-500" />
                    Manage FAQs
                </h1>
                <p className="text-slate-400 mt-2">Add, edit, or remove Frequently Asked Questions that appear on the homepage.</p>
            </div>

            <FaqManager initialFaqs={faqs} />
        </div>
    );
}
