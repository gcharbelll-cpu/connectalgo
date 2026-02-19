"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Shield, ExternalLink, ShieldCheck } from "lucide-react";
import { Strategy } from "@/lib/data/strategies";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingSelectorProps {
    strategy: Strategy;
}

type PlanType = "monthly" | "sixMonth" | "yearly";

export function PricingSelector({ strategy }: PricingSelectorProps) {
    const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

    const getPrice = () => {
        switch (selectedPlan) {
            case "sixMonth":
                return strategy.priceSixMonth;
            case "yearly":
                return strategy.priceYearly;
            case "monthly":
            default:
                return strategy.price;
        }
    };

    const getLabel = () => {
        switch (selectedPlan) {
            case "sixMonth":
                return "/6 months";
            case "yearly":
                return "/year";
            case "monthly":
            default:
                return "/month";
        }
    };

    // Calculate savings
    const getSavings = () => {
        if (selectedPlan === "monthly") return null;

        const monthlyCost = strategy.price;
        let totalCost = 0;
        let standardCost = 0;

        if (selectedPlan === "sixMonth") {
            totalCost = strategy.priceSixMonth;
            standardCost = monthlyCost * 6;
        } else if (selectedPlan === "yearly") {
            totalCost = strategy.priceYearly;
            standardCost = monthlyCost * 12;
        }

        const saving = standardCost - totalCost;
        const percent = Math.round((saving / standardCost) * 100);

        if (saving <= 0) return null;

        return { amount: saving, percent };
    };

    const savings = getSavings();

    // Limited Investors Logic
    const maxSubscribers = strategy.maxSubscribers;
    const currentSubscribers = strategy.subscribers;
    const spotsLeft = maxSubscribers ? maxSubscribers - currentSubscribers : null;
    const isSoldOut = spotsLeft !== null && spotsLeft <= 0;
    const isLowStock = spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 20;

    return (
        <>
            <CardHeader>
                <CardTitle className="text-white text-lg flex justify-between items-center">
                    Invest in {strategy.name}
                    {savings && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/50">
                            Save {savings.percent}%
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Plan Selection Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                    <button
                        type="button"
                        onClick={() => setSelectedPlan("monthly")}
                        className={`text-xs py-2 rounded-md transition-all ${selectedPlan === "monthly"
                            ? "bg-slate-800 text-white font-medium shadow-sm"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPlan("sixMonth")}
                        className={`text-xs py-2 rounded-md transition-all ${selectedPlan === "sixMonth"
                            ? "bg-slate-800 text-white font-medium shadow-sm"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        6 Months
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPlan("yearly")}
                        className={`text-xs py-2 rounded-md transition-all ${selectedPlan === "yearly"
                            ? "bg-slate-800 text-white font-medium shadow-sm"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        Yearly
                    </button>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                        ${getPrice().toLocaleString()}
                    </span>
                    <span className="text-slate-400">{getLabel()}</span>
                </div>

                <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bybit Copy Trading
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <Shield className="h-4 w-4 text-emerald-500" /> Funds Remain in Your Custody
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <Lock className="h-4 w-4 text-emerald-500" /> 100% Automated
                    </li>
                </ul>

                {/* Scarcity / Sold Out Warning */}
                {isSoldOut ? (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center">
                        <p className="text-red-400 text-sm font-semibold">Strategy Sold Out</p>
                        <p className="text-red-400/80 text-xs">Join the waitlist via WhatsApp</p>
                    </div>
                ) : isLowStock ? (
                    <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-3 text-center">
                        <p className="text-amber-400 text-sm font-semibold">High Demand: Only {spotsLeft} spots left!</p>
                    </div>
                ) : null}

                <Button
                    disabled={isSoldOut}
                    className={cn(
                        "w-full h-12 text-lg font-semibold shadow-lg transition-all",
                        isSoldOut
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20"
                    )}
                    asChild={!isSoldOut}
                >
                    {isSoldOut ? (
                        <span>Sold Out</span>
                    ) : (
                        <a href={`https://wa.me/96176374971?text=${encodeURIComponent(`Hi, I'm interested in investing in the ${strategy.name} strategy (${selectedPlan} plan).`)}`} target="_blank" rel="noopener noreferrer">
                            Contact via WhatsApp
                        </a>
                    )}
                </Button>
                <p className="text-center text-xs text-slate-500">
                    Personalized onboarding via WhatsApp.
                </p>

                <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 group" asChild>
                    <Link href={`/strategies/${strategy.id}/record`}>
                        <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500 group-hover:text-emerald-400" /> View Verified Record
                    </Link>
                </Button>
            </CardContent>
        </>
    );
}
