import { Strategy } from "@/lib/data/strategies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, BarChart3, ArrowUpRight, ArrowDownRight, Percent, Award } from "lucide-react";
import { LongShortAnalysis } from "@/components/strategies/LongShortAnalysis";
import { DayOfWeekAnalysis } from "@/components/strategies/DayOfWeekAnalysis";
import { AdvancedStatistics } from "@/components/strategies/AdvancedStatistics";
import { Trade } from "@/lib/data/trades";

interface PerformanceOverviewProps {
    strategy: Strategy;
    trades: Trade[];
}

export function PerformanceOverview({ strategy, trades }: PerformanceOverviewProps) {
    const metrics = strategy.advancedMetrics;
    if (!metrics) return <div className="text-slate-500">No advanced metrics available.</div>;

    // Helper for sign-aware formatting with fixed precision
    const formatSigned = (val: number) => {
        const fixed = val.toFixed(2);
        return val >= 0 ? `+${fixed}%` : `${fixed}%`;
    };

    const roi = parseFloat(strategy.roi.toFixed(2));

    const cards = [
        {
            label: "Net Profit",
            value: formatSigned(roi),
            icon: TrendingUp,
            color: roi >= 0 ? "text-emerald-400" : "text-red-400",
            sub: "Total Return"
        },
        {
            label: "Win Rate",
            value: `${metrics.winRate}%`,
            icon: Percent,
            color: "text-blue-400",
            sub: `${metrics.totalTrades} Total Trades`
        },
        {
            label: "Profit Factor",
            value: metrics.profitFactor.toFixed(2),
            icon: BarChart3,
            color: "text-emerald-400",
            sub: "Gross Profit / Gross Loss"
        },
        {
            label: "Sharpe Ratio",
            value: metrics.sharpeRatio.toFixed(2),
            icon: Activity,
            color: "text-purple-400",
            sub: "Risk-Adjusted Return"
        },
        {
            label: "Sortino Ratio",
            value: metrics.sortinoRatio.toFixed(2),
            icon: Award,
            color: "text-yellow-400",
            sub: "Downside Risk Adjusted"
        },
        {
            label: "Avg Trade",
            value: formatSigned(metrics.avgTrade),
            icon: metrics.avgTrade >= 0 ? ArrowUpRight : ArrowDownRight,
            color: metrics.avgTrade >= 0 ? "text-emerald-400" : "text-red-400",
            sub: "Expectancy per Trade"
        },
        {
            label: "Best Trade",
            value: formatSigned(metrics.bestTrade),
            icon: ArrowUpRight,
            color: "text-emerald-400",
            sub: "Largest Win"
        },
        {
            label: "Worst Trade",
            value: formatSigned(metrics.worstTrade),
            icon: ArrowDownRight,
            color: "text-red-400",
            sub: "Largest Loss"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <Card key={idx} className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-slate-400 text-sm">{card.label}</div>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analysis Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-full">
                    <DayOfWeekAnalysis trades={trades} />
                </div>
                <div className="h-full">
                    <LongShortAnalysis trades={trades} />
                </div>
            </div>

            {/* Advanced Stats */}
            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-4">Detailed Statistics</h3>
                <AdvancedStatistics trades={trades} />
            </div>
        </div>
    );
}
