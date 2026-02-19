"use client";

import { Trade } from "@/lib/data/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface MonthlyReturnsMatrixProps {
    trades: Trade[];
}

export function MonthlyReturnsMatrix({ trades }: MonthlyReturnsMatrixProps) {
    const matrix = useMemo(() => {
        const data: Record<number, Record<number, number>> = {};
        const yearsSet = new Set<number>();

        trades.forEach(trade => {
            const date = new Date(trade.date);
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-11

            if (!data[year]) data[year] = {};
            if (!data[year][month]) data[year][month] = 0;

            data[year][month] += trade.pnl;
            yearsSet.add(year);
        });

        const years = Array.from(yearsSet).sort((a, b) => b - a);
        return { data, years };
    }, [trades]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-lg">Monthly Returns</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                                <th className="py-3 px-2 font-medium">Year</th>
                                {months.map(m => (
                                    <th key={m} className="py-3 px-2 font-medium text-center">{m}</th>
                                ))}
                                <th className="py-3 px-2 font-medium text-right font-bold text-white">YTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.years.map(year => {
                                let ytd = 0;
                                return (
                                    <tr key={year} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                        <td className="py-3 px-2 font-bold text-slate-300">{year}</td>
                                        {months.map((_, monthIndex) => {
                                            const val = matrix.data[year]?.[monthIndex];
                                            if (val !== undefined) ytd += val;

                                            // Conditional formatting
                                            let colorClass = "text-slate-600";
                                            if (val > 0) colorClass = "text-emerald-400 bg-emerald-950/20";
                                            if (val < 0) colorClass = "text-red-400 bg-red-950/20";
                                            if (val === 0) colorClass = "text-slate-500";
                                            if (val === undefined) colorClass = "";

                                            return (
                                                <td key={monthIndex} className={`py-2 px-2 text-center rounded-sm ${val !== undefined ? 'font-medium' : ''}`}>
                                                    {val !== undefined ? (
                                                        <span className={`block w-full h-full rounded py-1 ${colorClass}`}>
                                                            {val > 0 ? "+" : ""}{val.toFixed(2)}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-700">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className={`py-3 px-2 text-right font-bold ${ytd >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                            {ytd > 0 ? "+" : ""}{ytd.toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                            {matrix.years.length === 0 && (
                                <tr>
                                    <td colSpan={14} className="py-8 text-center text-slate-500">
                                        No data available for return matrix.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
