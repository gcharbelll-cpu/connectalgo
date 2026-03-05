"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ as FAQType } from "@/lib/data/faq";

export function FAQ({ faqs }: { faqs: FAQType[] }) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-24 bg-slate-950 border-t border-slate-900">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-400">
                        Everything you need to know about our institutional-grade copy trading.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((item) => (
                        <AccordionItem key={item.id} value={`item-${item.id}`} className="border-slate-800">
                            <AccordionTrigger className="text-slate-200 hover:text-emerald-400 hover:no-underline text-left">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-400 leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
