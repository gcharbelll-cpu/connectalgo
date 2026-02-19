"use client";

import { Trade } from "@/lib/data/trades";
import { format } from "date-fns";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TradeHistoryTableProps {
    trades: Trade[];
}

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
    // Sort trades by date descending
    const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                        <TableHead className="text-slate-400">Date</TableHead>
                        <TableHead className="text-slate-400">Pair</TableHead>
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Signal</TableHead>
                        <TableHead className="text-right text-slate-400">Entry</TableHead>
                        <TableHead className="text-right text-slate-400">Exit</TableHead>
                        <TableHead className="text-right text-slate-400">PnL %</TableHead>
                        <TableHead className="text-right text-slate-400">PnL $</TableHead>
                        <TableHead className="text-right text-slate-400 hidden lg:table-cell">Run-up (MFE)</TableHead>
                        <TableHead className="text-right text-slate-400 hidden lg:table-cell">Drawdown (MAE)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTrades.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                                No trades found for this strategy yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedTrades.map((trade) => (
                            <TableRow key={trade.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium text-slate-300">
                                    {format(new Date(trade.date), "MMM d, HH:mm")}
                                </TableCell>
                                <TableCell className="text-slate-300">{trade.symbol}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        trade.type === 'LONG'
                                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-900"
                                            : "bg-red-950/30 text-red-400 border-red-900"
                                    }>
                                        {trade.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-400 text-sm">
                                    {trade.signal || "-"}
                                </TableCell>
                                <TableCell className="text-right text-slate-300">
                                    ${trade.entryPrice.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-slate-300">
                                    ${trade.exitPrice.toLocaleString()}
                                </TableCell>
                                <TableCell className={`text-right font-medium ${trade.pnl > 0 ? "text-emerald-400" : trade.pnl < 0 ? "text-red-400" : "text-slate-400"
                                    }`}>
                                    {trade.pnl > 0 ? "+" : ""}{trade.pnl}%
                                </TableCell>
                                <TableCell className={`text-right font-medium ${trade.pnl > 0 ? "text-emerald-400" : trade.pnl < 0 ? "text-red-400" : "text-slate-400"
                                    }`}>
                                    {trade.pnlValue ? (
                                        <span>{trade.pnlValue > 0 ? "+" : ""}${trade.pnlValue.toLocaleString()}</span>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right text-emerald-400/70 hidden lg:table-cell">
                                    {trade.runUp ? `+${trade.runUp}%` : "-"}
                                </TableCell>
                                <TableCell className="text-right text-red-400/70 hidden lg:table-cell">
                                    {trade.drawdown ? `${trade.drawdown}%` : "-"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
