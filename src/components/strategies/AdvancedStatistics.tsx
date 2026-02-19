"use client";

import { Trade } from "@/lib/data/trades";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Zap, Target, ShieldAlert } from "lucide-react";

interface AdvancedStatisticsProps {
    trades: Trade[];
}

export function AdvancedStatistics({ trades }: AdvancedStatisticsProps) {
    if (!trades || trades.length === 0) return null;

    // --- Calculations ---

    // 1. Max Drawdown % (Peak to Valley equity)
    let maxDrawdown = 0;
    let peakEquity = 0;
    let currentEquity = 0;

    // Sort by date ascending for equity curve simulation
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach(trade => {
        currentEquity += trade.pnl; // Using % based equity for drawdown
        if (currentEquity > peakEquity) peakEquity = currentEquity;
        const drawdown = currentEquity - peakEquity;
        if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    });

    // 2. Streaks
    let currentWinStreak = 0;
    let maxWinStreak = 0;
    let currentLossStreak = 0;
    let maxLossStreak = 0;

    sortedTrades.forEach(trade => {
        if (trade.pnl > 0) {
            currentWinStreak++;
            currentLossStreak = 0;
            if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
        } else if (trade.pnl < 0) {
            currentLossStreak++;
            currentWinStreak = 0;
            if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
        }
    });

    // 3. MFE / MAE (Efficiency)
    const winTrades = trades.filter(t => t.pnl > 0);
    const lossTrades = trades.filter(t => t.pnl < 0);

    const avgRunUp = trades.reduce((acc, t) => acc + (t.runUp || 0), 0) / (trades.length || 1);
    const avgDrawdown = trades.reduce((acc, t) => acc + (t.drawdown || 0), 0) / (trades.length || 1);

    const stats = [
        {
            label: "Max Drawdown",
            value: `${maxDrawdown.toFixed(2)}%`,
            desc: "Peak-to-Valley Decline",
            color: "text-red-500",
            icon: ShieldAlert
        },
        {
            label: "Max Win Streak",
            value: maxWinStreak.toString(),
            desc: "Consecutive Wins",
            color: "text-emerald-500",
            icon: Zap
        },
        {
            label: "Max Loss Streak",
            value: maxLossStreak.toString(),
            desc: "Consecutive Losses",
            color: "text-red-400",
            icon: Zap
        },
        {
            label: "Avg Run-Up (MFE)",
            value: `+${avgRunUp.toFixed(2)}%`,
            desc: "Avg Potential Profit",
            color: "text-emerald-400",
            icon: Target
        },
        {
            label: "Avg Drawdown (MAE)",
            value: `${avgDrawdown.toFixed(2)}%`,
            desc: "Avg Heat Taken",
            color: "text-orange-400",
            icon: ArrowDownRight
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat, idx) => (
                <Card key={idx} className="bg-slate-900/40 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <stat.icon className={`h-5 w-5 mb-2 ${stat.color} opacity-80`} />
                        <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">{stat.label}</div>
                        <div className="text-[10px] text-slate-600 mt-1">{stat.desc}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
