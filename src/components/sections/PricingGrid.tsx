"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Shield, Zap, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

type BillingPeriod = "threeMonth" | "sixMonth" | "yearly";

interface PricingGridProps {
    proTotal: number;
    proRemaining: number;
    eliteTotal: number;
    eliteRemaining: number;
}

export function PricingGrid({ proTotal, proRemaining, eliteTotal, eliteRemaining }: PricingGridProps) {
    const [period, setPeriod] = useState<BillingPeriod>("threeMonth");

    const getPriceLabel = () => {
        switch (period) {
            case "sixMonth": return "6 Months";
            case "yearly": return "1 Year";
            case "threeMonth": default: return "3 Months";
        }
    };

    // Tier 1 Data
    const proTier = {
        name: "Pro Copy Trading",
        description: "Direct connection to Bybit. We trade, your account copies automatically.",
        prices: {
            threeMonth: 1299,
            sixMonth: 2399,
            yearly: 4499,
        },
        savings: {
            threeMonth: 0,
            sixMonth: 199,
            yearly: 697,
        },
        features: [
            "Access to ALL Connect Algo Strategies",
            "100% Automated Execution via Bybit",
            "Institutional Risk Management",
            "Performance Tracking Dashboard",
            "Priority Support Channel"
        ],
        seatsRemaining: proRemaining,
        totalSeats: proTotal
    };

    // Tier 2 Data
    const eliteTier = {
        name: "Elite Access",
        description: "The ultimate package. Bybit Copy Trading PLUS Prop Firm EA Files.",
        prices: {
            threeMonth: 2899,
            sixMonth: 5399,
            yearly: 9999,
        },
        savings: {
            threeMonth: 0,
            sixMonth: 399,
            yearly: 1597,
        },
        features: [
            "Includes Everything in Pro Tier",
            "Source EA Files for MT4/MT5",
            "Prop Firm Passing Support",
            "Exclusive High-Risk Presets",
            "1-on-1 Setup Strategy Call"
        ],
        seatsRemaining: 5,
        totalSeats: 25
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            {/* billing toggle */}
            <div className="flex justify-center">
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 inline-flex flex-wrap justify-center gap-1 sm:gap-0">
                    <button
                        onClick={() => setPeriod("threeMonth")}
                        className={cn("px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all", period === "threeMonth" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        3 Months
                    </button>
                    <button
                        onClick={() => setPeriod("sixMonth")}
                        className={cn("px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all", period === "sixMonth" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        6 Months
                    </button>
                    <button
                        onClick={() => setPeriod("yearly")}
                        className={cn("px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", period === "yearly" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        Yearly <span className="hidden sm:inline text-emerald-400 text-xs">Best Value</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRO TIER */}
                <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <Shield className="h-6 w-6 text-emerald-500" />
                            {proTier.name}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-2">{proTier.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">${proTier.prices[period].toLocaleString()}</span>
                                <span className="text-slate-400">/ {getPriceLabel()}</span>
                            </div>
                            {proTier.savings[period] > 0 && (
                                <p className="text-sm text-emerald-400 font-medium mt-2">
                                    Save ${proTier.savings[period]} compared to 3-month renewals
                                </p>
                            )}
                        </div>

                        {/* Limited Seats Indicator */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-sm">
                                {proTier.seatsRemaining > 0 ? (
                                    <span className="text-amber-400 font-medium flex items-center gap-1.5 animate-pulse">
                                        <Zap className="h-4 w-4" fill="currentColor" />
                                        Only {proTier.seatsRemaining} seats left
                                    </span>
                                ) : (
                                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                                        Wait for open spots
                                    </span>
                                )}
                                <span className="text-slate-500 font-mono text-xs">{proTier.totalSeats - proTier.seatsRemaining}/{proTier.totalSeats} Taken</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", proTier.seatsRemaining > 0 ? "bg-gradient-to-r from-amber-500 to-amber-300" : "bg-slate-600")}
                                    style={{ width: `${((proTier.totalSeats - proTier.seatsRemaining) / proTier.totalSeats) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <ul className="space-y-4 text-sm text-slate-300">
                                {proTier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full group bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/50 h-14 text-lg"
                            asChild
                        >
                            <a href={`https://wa.me/96176374971?text=${encodeURIComponent(`Hi, I'm interested in the ${proTier.name} subscription (${period} plan). How can I pay?`)}`} target="_blank" rel="noopener noreferrer">
                                Choose Pro <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                    </CardFooter>
                </Card>

                {/* ELITE TIER */}
                <Card className="bg-slate-900/80 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

                    <CardHeader>
                        <Badge className="w-fit mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                            Most Comprehensive
                        </Badge>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <Terminal className="h-6 w-6 text-emerald-500" />
                            {eliteTier.name}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-2">{eliteTier.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">${eliteTier.prices[period].toLocaleString()}</span>
                                <span className="text-slate-400">/ {getPriceLabel()}</span>
                            </div>
                            {eliteTier.savings[period] > 0 && (
                                <p className="text-sm text-emerald-400 font-medium mt-2">
                                    Save ${eliteTier.savings[period].toLocaleString()} compared to 3-month renewals
                                </p>
                            )}
                        </div>

                        {/* Limited Seats Indicator */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-sm">
                                {eliteTier.seatsRemaining > 0 ? (
                                    <span className="text-amber-400 font-medium flex items-center gap-1.5 animate-pulse">
                                        <Zap className="h-4 w-4" fill="currentColor" />
                                        Only {eliteTier.seatsRemaining} seats left
                                    </span>
                                ) : (
                                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                                        Wait for open spots
                                    </span>
                                )}
                                <span className="text-slate-500 font-mono text-xs">{eliteTier.totalSeats - eliteTier.seatsRemaining}/{eliteTier.totalSeats} Taken</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", eliteTier.seatsRemaining > 0 ? "bg-gradient-to-r from-amber-500 to-amber-300" : "bg-slate-600")}
                                    style={{ width: `${((eliteTier.totalSeats - eliteTier.seatsRemaining) / eliteTier.totalSeats) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <ul className="space-y-4 text-sm text-slate-300">
                                {eliteTier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Zap className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <span className={i === 1 ? "font-semibold text-white" : ""}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full group bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg"
                            asChild
                        >
                            <a href={`https://wa.me/96176374971?text=${encodeURIComponent(`Hi, I'm ready to get the ${eliteTier.name} subscription (${period} plan). How can I pay?`)}`} target="_blank" rel="noopener noreferrer">
                                Get Elite Access <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
