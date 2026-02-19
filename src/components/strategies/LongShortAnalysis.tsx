"use client";

import { Trade } from "@/lib/data/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface LongShortAnalysisProps {
    trades: Trade[];
}

export function LongShortAnalysis({ trades }: LongShortAnalysisProps) {
    const longs = trades.filter(t => t.type === 'LONG');
    const shorts = trades.filter(t => t.type === 'SHORT');

    const longWins = longs.filter(t => t.pnl > 0).length;
    const shortWins = shorts.filter(t => t.pnl > 0).length;

    const longWinRate = longs.length ? Math.round((longWins / longs.length) * 100) : 0;
    const shortWinRate = shorts.length ? Math.round((shortWins / shorts.length) * 100) : 0;

    const data = [
        { name: 'Longs', value: longs.length, winRate: longWinRate, color: '#10b981' }, // Emerald-500
        { name: 'Shorts', value: shorts.length, winRate: shortWinRate, color: '#ef4444' }, // Red-500
    ];

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-lg">Long vs Short Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-around h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Stats Side Panel */}
                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto mt-4 md:mt-0 md:ml-8">
                        <div className="text-center">
                            <div className="text-emerald-400 font-bold text-2xl">{longWinRate}%</div>
                            <div className="text-slate-500 text-sm">Long Win Rate</div>
                            <div className="text-slate-600 text-xs mt-1">{longs.length} Trades</div>
                        </div>
                        <div className="text-center">
                            <div className="text-red-400 font-bold text-2xl">{shortWinRate}%</div>
                            <div className="text-slate-500 text-sm">Short Win Rate</div>
                            <div className="text-slate-600 text-xs mt-1">{shorts.length} Trades</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
