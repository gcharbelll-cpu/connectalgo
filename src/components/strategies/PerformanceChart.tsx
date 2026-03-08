"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
    data: { date: string; profit: number }[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Transform data to cumulative profit for the chart
    const cumulativeData = data.reduce((acc, curr, index) => {
        const prevProfit = index > 0 ? acc[index - 1].value : 0;
        return [...acc, { name: curr.date, value: prevProfit + curr.profit }];
    }, [] as { name: string; value: number }[]);

    if (!mounted) return <div className="h-[300px] w-full flex items-center justify-center text-slate-500">Loading chart...</div>;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={cumulativeData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#34d399' }}
                        formatter={(value: number | string | Array<number | string> | undefined) => {
                            if (value === undefined) return ["", "Compounded Yearly Return"];
                            const val = Array.isArray(value) ? value[0] : value;
                            return [
                                typeof val === 'number' ? `${val.toFixed(2)}%` : val,
                                "Compounded Yearly Return"
                            ];
                        }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
