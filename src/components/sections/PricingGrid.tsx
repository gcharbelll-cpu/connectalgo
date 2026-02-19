"use client";

import { useState } from "react";
import { Strategy } from "@/lib/data/strategies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingGridProps {
    strategies: Strategy[];
}

type BillingPeriod = "monthly" | "sixMonth" | "yearly";

export function PricingGrid({ strategies }: PricingGridProps) {
    const [period, setPeriod] = useState<BillingPeriod>("monthly");

    const getPrice = (strategy: Strategy) => {
        switch (period) {
            case "sixMonth": return strategy.priceSixMonth;
            case "yearly": return strategy.priceYearly;
            case "monthly": default: return strategy.price;
        }
    };

    const getLabel = () => {
        switch (period) {
            case "sixMonth": return "/6mo";
            case "yearly": return "/yr";
            case "monthly": default: return "/mo";
        }
    };

    const getSavings = (strategy: Strategy) => {
        if (period === "monthly") return null;
        const monthlyCost = strategy.price;
        let totalCost = 0;
        let standardCost = 0;

        if (period === "sixMonth") {
            totalCost = strategy.priceSixMonth;
            standardCost = monthlyCost * 6;
        } else {
            totalCost = strategy.priceYearly;
            standardCost = monthlyCost * 12;
        }

        const saving = standardCost - totalCost;
        const percent = Math.round((saving / standardCost) * 100);
        if (saving <= 0) return null;
        return percent;
    };

    // Sort: Ultimate last, others by price
    const sortedStrategies = [...strategies].sort((a, b) => {
        if (a.id === 'the-ultimate') return 1;
        if (b.id === 'the-ultimate') return -1;
        return a.price - b.price;
    });

    return (
        <div className="space-y-12">
            {/* billing toggle */}
            <div className="flex justify-center">
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 inline-flex">
                    <button
                        onClick={() => setPeriod("monthly")}
                        className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", period === "monthly" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPeriod("sixMonth")}
                        className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", period === "sixMonth" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        6 Months
                    </button>
                    <button
                        onClick={() => setPeriod("yearly")}
                        className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", period === "yearly" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}
                    >
                        Yearly <span className="ml-1 text-emerald-400 text-xs">Best Value</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedStrategies.map((strategy) => {
                    const isUltimate = strategy.id === 'the-ultimate';
                    const savings = getSavings(strategy);
                    const isSoldOut = strategy.maxSubscribers && strategy.subscribers >= strategy.maxSubscribers;

                    return (
                        <Card key={strategy.id} className={cn(
                            "flex flex-col relative overflow-hidden transition-all hover:-translate-y-1",
                            isUltimate
                                ? "bg-slate-900/80 border-emerald-500/50 shadow-2xl shadow-emerald-900/20"
                                : "bg-slate-900 border-slate-700 hover:border-slate-600"
                        )}>
                            {isUltimate && (
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                            )}
                            <CardHeader>
                                {isUltimate && (
                                    <Badge className="w-fit mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                                        Most Popular
                                    </Badge>
                                )}
                                <CardTitle className="text-xl text-white">{strategy.name}</CardTitle>
                                <p className="text-sm text-slate-400 h-10 line-clamp-2">{strategy.description}</p>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">${getPrice(strategy).toLocaleString()}</span>
                                        <span className="text-slate-400">{getLabel()}</span>
                                    </div>
                                    {savings && (
                                        <p className="text-xs text-emerald-400 font-medium mt-2">
                                            Save {savings}% with yearly billing
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Risk: {strategy.drawdown}% DD</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>ROI: +{strategy.roi}%</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Automated Execution</span>
                                    </li>
                                    <li className={cn("flex items-center gap-2", isSoldOut ? "text-red-400 font-medium" : "")}>
                                        <Users className={cn("h-4 w-4 shrink-0", isSoldOut ? "text-red-400" : "text-emerald-500")} />
                                        <span>
                                            {strategy.maxSubscribers
                                                ? strategy.subscribers >= strategy.maxSubscribers
                                                    ? `Sold Out ${strategy.subscribers}/${strategy.maxSubscribers}`
                                                    : `${strategy.subscribers}/${strategy.maxSubscribers} Investors`
                                                : `${strategy.subscribers} Investors`
                                            }
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    disabled={!!isSoldOut}
                                    className={cn(
                                        "w-full group",
                                        isUltimate
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            : "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/50",
                                        isSoldOut && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-emerald-500"
                                    )}
                                    asChild={!isSoldOut}
                                >
                                    {isSoldOut ? (
                                        <div className="flex items-center justify-center text-red-400 font-bold">
                                            Sold Out
                                        </div>
                                    ) : (
                                        <a href={`https://wa.me/96176374971?text=${encodeURIComponent(`Hi, I'm ready to start copying the ${strategy.name} strategy (${period} plan).`)}`} target="_blank" rel="noopener noreferrer">
                                            Start Copying <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
