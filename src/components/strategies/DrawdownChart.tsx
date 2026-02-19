"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trade } from '@/lib/data/trades';
import { format } from 'date-fns';

interface DrawdownChartProps {
    trades: Trade[];
}

export function DrawdownChart({ trades }: DrawdownChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate Drawdown Curve
    const data = (() => {
        const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let cumulativePnl = 0;
        let peak = 0;
        const curve = [];

        // Initial point
        curve.push({
            date: sortedTrades.length > 0 ? new Date(sortedTrades[0].date).getTime() - 86400000 : Date.now(),
            drawdown: 0,
            dateStr: 'Start'
        });

        sortedTrades.forEach(trade => {
            cumulativePnl += trade.pnl;
            if (cumulativePnl > peak) peak = cumulativePnl;
            const drawdown = cumulativePnl - peak;

            curve.push({
                date: new Date(trade.date).getTime(),
                drawdown: Number(drawdown.toFixed(2)),
                dateStr: format(new Date(trade.date), 'MMM d, yyyy')
            });
        });

        return curve;
    })();

    if (!mounted) return <div className="h-[300px] w-full flex items-center justify-center text-slate-500">Loading chart...</div>;

    if (trades.length === 0) return <div className="h-[300px] w-full flex items-center justify-center text-slate-500">No trades available for drawdown analysis.</div>;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM d')}
                        minTickGap={30}
                    />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#f87171' }}
                        labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy HH:mm')}
                        formatter={(value: any) => [`${value}%`, "Drawdown"]}
                    />
                    <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
