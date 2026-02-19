"use client";

import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
    const reviews = [
        {
            name: "Michael R.",
            role: "Software Engineer",
            content: "I've been looking for a passive income stream that doesn't require my constant attention. The Trend Intraday strategy has been incredible—consistent gains without me lifting a finger.",
            rating: 5
        },
        {
            name: "Sarah L.",
            role: "Entrepreneur",
            content: "The transparency is what sold me. Being able to see every trade executed in real-time on Bybit gives me huge peace of mind. The returns speak for themselves.",
            rating: 5
        },
        {
            name: "David K.",
            role: "Crypto Investor",
            content: "I started with a small amount on the Range Intraday strategy just to test it out. After seeing the risk management in action during the last dip, I moved my entire portfolio over.",
            rating: 5
        }
    ];

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Smart Investors</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Join hundreds of others who have automated their wealth generation with Connect Algo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-6 italic">"{review.content}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">{review.name}</div>
                                        <div className="text-slate-500 text-sm">{review.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
