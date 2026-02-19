"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calculator, RefreshCw } from "lucide-react";

interface ProfitCalculatorProps {
    avgMonthlyReturn: number; // e.g., 15 for 15%
}

export function ProfitCalculator({ avgMonthlyReturn }: ProfitCalculatorProps) {
    const [capital, setCapital] = useState<number>(10000);
    const [riskAmount, setRiskAmount] = useState<number>(100); // Risk per trade in $
    const [isCompounding, setIsCompounding] = useState<boolean>(true);
    const [result, setResult] = useState<number | null>(null);

    // Heuristic: Assume the "Avg Monthly Return" passed in was achieved with a "Standard" risk.
    // Since we don't know the exact historical risk per trade, we'll assume a standard baseline.
    // However, a better approach for specific user "Risk Amount" is:
    // We need to know the Strategy's Expectancy or R:R + WinRate to use "Risk Amount" correctly.
    // BUT, simply effectively, we can treat "Risk Amount" as scaling the position size.
    // Let's assume the passed `avgMonthlyReturn` corresponds to a 1% risk per trade (standard industry baseline).
    // So if User risks 1% of Capital, they get AvgMonthlyReturn.
    // If User risks $Amount, we calculate Risk% = (RiskAmount / Capital) * 100.
    // Multiplier = Risk% / 1%.
    // AdjustedMonthlyReturn = AvgMonthlyReturn * Multiplier.

    // Let's stick to this approximation for the demo.

    // ALSO: We need to limit the multiplier to avoid unrealistic 10000% gains if they type crazy risk.

    const calculateProfit = () => {
        const riskPercent = (riskAmount / capital) * 100;
        // Assume baseline stats are from ~1% risk per trade scenario? 
        // Or better, let's just assume the efficiency is linear.
        // Let's assume the Strategy Avg Return is based on a 1% risk model (conservative guess for "high yield" strategies).
        const baselineRisk = 1.0;
        const multiplier = riskPercent / baselineRisk;

        let currentBalance = capital;
        // Project for 12 months
        for (let i = 0; i < 12; i++) {
            const monthlyReturn = avgMonthlyReturn * multiplier;
            const profit = currentBalance * (monthlyReturn / 100);

            if (isCompounding) {
                currentBalance += profit;
            } else {
                // If not compounding, profit is based on initial capital? 
                // Usually "not compounding" means you withdraw profit, so the base stays same.
                // But the "Result" is usually Total Profit + Capital.
                // Let's accumulate profit separately if not compounding.
                currentBalance += (capital * (monthlyReturn / 100));
                // Wait, if not compounding, the base for profit calc is always 'ideal initial capital'.
                // So we add profit to a 'total' bucket but don't increase the trade size base.
                // Actually my variable `currentBalance` implies the account size. 
                // If not compounding, account size stays 'capital', but we generated 'profit'.
                // So: Total = Capital + (12 * MonthlyProfitOnCapital)
            }
        }

        // Re-calculate non-compounding accurately
        if (!isCompounding) {
            const monthlyReturn = avgMonthlyReturn * multiplier;
            const totalProfit = (capital * (monthlyReturn / 100)) * 12;
            setResult(capital + totalProfit);
        } else {
            setResult(currentBalance);
        }
    };

    useEffect(() => {
        calculateProfit();
    }, [capital, riskAmount, isCompounding, avgMonthlyReturn]);

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-emerald-500" />
                    Profit Calculator (1 Year)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Initial Capital ($)</Label>
                    <Input
                        type="number"
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        className="bg-slate-950 border-slate-800 text-white focus:border-emerald-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Risk Amount per Trade ($)</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={riskAmount}
                            onChange={(e) => setRiskAmount(Number(e.target.value))}
                            className="bg-slate-950 border-slate-800 text-white focus:border-emerald-500/50 pr-12"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                            {((riskAmount / capital) * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-400 cursor-pointer" htmlFor="compounding">Compounding</Label>
                    <Switch
                        id="compounding"
                        checked={isCompounding}
                        onCheckedChange={setIsCompounding}
                        className="data-[state=checked]:bg-emerald-600"
                    />
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Projected Balance</div>
                    <div className="text-2xl font-bold text-emerald-400">
                        ${result?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-2">
                        *Estimations based on historical average monthly returns.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
