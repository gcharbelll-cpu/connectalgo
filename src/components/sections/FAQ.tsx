"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
    const items = [
        {
            question: "How does the copy trading process work?",
            answer: "We utilize Bybit's official Copy Trading infrastructure. Once you connect, our Master Account trades are replicated instantly in your own account. You maintain full custody of your funds and can disconnect at any time."
        },
        {
            question: "Is my capital safe?",
            answer: "Yes. Your funds always remain in your own personal Bybit exchange account. We never have permission to withdraw or move your assets. The system only provides trade execution signals."
        },
        {
            question: "What is the recommended minimum investment?",
            answer: "To ensure proper position sizing and risk management, we recommend a minimum capital of $3,000 for individual strategies. For 'The Ultimate' portfolio, a minimum of $5,000 is advised to effectively diversify across all assets."
        },
        {
            question: "Can I withdraw my profits at any time?",
            answer: "Absolutely. There is no lock-up period. You have 100% control over your funds and can withdraw your profits or your entire capital whenever you choose via Bybit."
        },
        {
            question: "Do I need to keep my computer on?",
            answer: "No. All trading operations occur in the cloud on Bybit's institutional servers. You do not need to install any software or keep your device running."
        }
    ];

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
                    {items.map((item, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-800">
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
