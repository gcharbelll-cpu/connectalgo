"use client";

import { Trade } from "@/lib/data/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DayOfWeekAnalysisProps {
    trades: Trade[];
}

export function DayOfWeekAnalysis({ trades }: DayOfWeekAnalysisProps) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Initialize data structure
    const data = days.map(day => ({ name: day, pnl: 0, trades: 0 }));

    // Aggregate trades
    trades.forEach(trade => {
        const date = new Date(trade.date);
        const dayIndex = date.getDay(); // 0 = Sun, 6 = Sat
        data[dayIndex].pnl += trade.pnlValue || 0;
        data[dayIndex].trades += 1;
    });

    // Shift to start week on Monday (optional, but standard for trading)
    // 0=Sun, 1=Mon... let's rotate so Mon is first?
    // Standard JS getDay() is Sun=0. 
    // Let's reorder to Mon-Sun for display if desired. 
    // Crypto trades 24/7 so Sun is valid.
    // Let's keep Sun-Sat or Mon-Sun. Let's do Mon-Sun.
    const reorderedData = [
        ...data.slice(1), // Mon-Sat
        data[0] // Sun
    ];

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-lg">Daily Performance ($)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={reorderedData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                                {reorderedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
