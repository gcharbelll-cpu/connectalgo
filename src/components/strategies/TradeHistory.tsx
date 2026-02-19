"use client";

import { useState } from "react";
import { Trade } from "@/lib/data/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Filter, Calendar } from "lucide-react";

interface TradeHistoryProps {
    trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    // Extract unique months for filter
    const months = Array.from(new Set(trades.map(t => t.date.slice(0, 7)))).sort().reverse();

    const filteredTrades = selectedMonth === "all"
        ? trades
        : trades.filter(t => t.date.startsWith(selectedMonth));

    // Calculate stats for filtered view
    const winRate = filteredTrades.length > 0
        ? Math.round((filteredTrades.filter(t => t.status === "WIN").length / filteredTrades.length) * 100)
        : 0;

    const totalPnL = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);

    return (
        <div className="space-y-6">
            {/* Filters & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800 md:col-span-1">
                    <CardContent className="p-4 pt-6">
                        <div className="mb-2 text-slate-400 text-sm flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filter by Month
                        </div>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-white">
                                <SelectValue placeholder="All Time" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="all">All Time</SelectItem>
                                {months.map(month => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 md:col-span-3">
                    <CardContent className="p-6 flex justify-around items-center text-center">
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Trades</div>
                            <div className="text-2xl font-bold text-white">{filteredTrades.length}</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Win Rate</div>
                            <div className="text-2xl font-bold text-emerald-400">{winRate}%</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Net PnL</div>
                            <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {totalPnL > 0 ? "+" : ""}{totalPnL.toFixed(2)}%
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trade Table */}
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Trade History</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Symbol</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Entry</th>
                                <th className="px-6 py-3 text-right">Exit</th>
                                <th className="px-6 py-3 text-right">PnL</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {filteredTrades.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        No trades found for this period.
                                    </td>
                                </tr>
                            ) : (
                                filteredTrades.map((trade) => (
                                    <tr key={trade.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(trade.date).toLocaleDateString()}
                                            <span className="text-xs text-slate-500 block">
                                                {new Date(trade.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{trade.symbol}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={trade.type === "LONG"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }>
                                                {trade.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-400">
                                            {trade.entryPrice.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-400">
                                            {trade.exitPrice.toLocaleString()}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                            {trade.pnl > 0 ? "+" : ""}{trade.pnl}%
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {trade.status === "WIN" ? (
                                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mx-auto" />
                                            ) : trade.status === "LOSS" ? (
                                                <ArrowDownRight className="h-4 w-4 text-red-500 mx-auto" />
                                            ) : (
                                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">OPEN</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
