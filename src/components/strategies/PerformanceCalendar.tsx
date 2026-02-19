"use client";

import { Trade } from "@/lib/data/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Share2, Download, Loader2, BarChartHorizontal } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

import { CalendarGrid } from "./CalendarGrid";

interface PerformanceCalendarProps {
    trades: Trade[];
}

export function PerformanceCalendar({ trades }: PerformanceCalendarProps) {
    const lastTradeDate = trades.length > 0 ? new Date(trades[trades.length - 1].date) : new Date();
    const [currentDate, setCurrentDate] = useState(lastTradeDate);
    const [isSharing, setIsSharing] = useState(false);

    // We now have two refs: one for the visible card (if needed) and one for the export view
    const exportRef = useRef<HTMLDivElement>(null); // Desktop Landscape
    const mobileExportRef = useRef<HTMLDivElement>(null); // Mobile Portrait

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    // Aggregate PnL per day
    const dailyPnL: Record<number, number> = {};
    const dailyTrades: Record<number, number> = {};

    trades.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            dailyPnL[day] = (dailyPnL[day] || 0) + t.pnl;
            dailyTrades[day] = (dailyTrades[day] || 0) + 1;
        }
    });

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const totalMonthlyPnL = Object.values(dailyPnL).reduce((acc, curr) => acc + curr, 0);

    const handleShare = async () => {
        setIsSharing(true);

        // Smart detect: If on mobile (window width < 768), use the Vertical Story layout
        // Otherwise use the standard Landscape layout
        const isMobile = window.innerWidth < 768;
        const targetRef = isMobile ? mobileExportRef : exportRef;
        const fileName = isMobile
            ? `connect-algo-story-${monthNames[month]}-${year}.png`
            : `connect-algo-performance-${monthNames[month]}-${year}.png`;

        if (!targetRef.current) {
            setIsSharing(false);
            return;
        }

        try {
            const dataUrl = await toPng(targetRef.current, {
                backgroundColor: "#020617", // slate-950
                pixelRatio: 2,
                cacheBust: true,
                style: {
                    transform: 'scale(1)',
                    opacity: '1',
                    visibility: 'visible',
                    position: 'static',
                    zIndex: '9999',
                }
            });

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: isMobile ? 'My Trading Month 🚀' : 'Monthly Performance',
                        text: `Check out my trading performance for ${monthNames[month]} ${year}! #ConnectAlgo`,
                        files: [file],
                    });
                } catch (err) {
                    console.error("Share failed/cancelled", err);
                }
            } else {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error("Failed to generate image", error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <>
            {/* Interactive Widget */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-white text-lg">Daily Performance</CardTitle>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            disabled={isSharing}
                            className="text-slate-400 hover:text-white mr-2"
                            title="Share Calendar"
                        >
                            {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                        </Button>

                        <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
                            <button onClick={prevMonth} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="flex flex-row items-baseline gap-2 px-2 min-w-[140px] justify-center">
                                <span className="text-white font-medium text-sm">
                                    {monthNames[month]} {year}
                                </span>
                                <span className={`text-xs font-mono font-bold ${totalMonthlyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {totalMonthlyPnL > 0 ? "+" : ""}{totalMonthlyPnL.toFixed(2)}%
                                </span>
                            </div>
                            <button onClick={nextMonth} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CalendarGrid
                        daysInMonth={daysInMonth}
                        firstDayOfMonth={firstDayOfMonth}
                        dailyPnL={dailyPnL}
                        dailyTrades={dailyTrades}
                    />

                    <div className="flex items-center gap-6 mt-6 justify-center text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-950/50 border border-emerald-500/30 rounded"></div>
                            <span>Profit Day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-950/50 border border-red-500/30 rounded"></div>
                            <span>Loss Day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-slate-950 border border-slate-800 rounded"></div>
                            <span>No Trade</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden Desktop Export Layout (Landscape) */}
            <div
                ref={exportRef}
                className="fixed left-0 top-0 -z-50 opacity-0 pointer-events-none w-[800px] bg-slate-950 p-10 rounded-2xl border border-slate-800 text-white"
            >
                {/* Export Header */}
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <BarChartHorizontal className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Connect Algo
                            </div>
                            <div className="text-xs text-slate-500 font-mono tracking-wider">PREMIUM TRADING SYSTEMS</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white mb-1">
                            {monthNames[month]} {year}
                        </div>
                        <div className={`text-xl font-mono font-bold ${totalMonthlyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {totalMonthlyPnL > 0 ? "Net Profit: +" : "Net Profit: "}{totalMonthlyPnL.toFixed(2)}%
                        </div>
                    </div>
                </div>

                {/* Export Grid */}
                <CalendarGrid
                    daysInMonth={daysInMonth}
                    firstDayOfMonth={firstDayOfMonth}
                    dailyPnL={dailyPnL}
                    dailyTrades={dailyTrades}
                    className="border-slate-700 bg-slate-900"
                    pnlTextSize="text-xl"
                    tradeTextSize="text-xs"
                />

                {/* Export Footer */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span>Profit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <span>Loss</span>
                        </div>
                    </div>
                    <div className="text-slate-400 font-medium tracking-wide">
                        Join us at <span className="text-emerald-400">connectalgo.com</span>
                    </div>
                </div>
            </div>

            {/* Hidden Mobile Export Layout (Portrait/Story) */}
            <div
                ref={mobileExportRef}
                className="fixed left-0 top-0 -z-50 opacity-0 pointer-events-none w-[1080px] bg-slate-950 p-16 rounded-3xl border border-slate-800 text-white flex flex-col justify-between aspect-[9/16]"
                style={{ height: '1920px' }} // Force 9:16 aspect ratio
            >
                {/* Mobile Header - Centered & Big */}
                <div className="flex flex-col items-center justify-center mb-12 border-b border-slate-800 pb-12">
                    <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6">
                        <BarChartHorizontal className="h-14 w-14 text-white" />
                    </div>

                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                        Connect Algo
                    </div>
                    <div className="text-xl text-slate-500 font-mono tracking-[0.2em] uppercase">Premium Trading Systems</div>
                </div>

                {/* Mobile Stats - Hero */}
                <div className="text-center mb-12 space-y-4">
                    <div className="text-4xl font-medium text-slate-300">
                        {monthNames[month]} {year}
                    </div>
                    <div className={`text-7xl font-mono font-bold ${totalMonthlyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {totalMonthlyPnL > 0 ? "+" : ""}{totalMonthlyPnL.toFixed(2)}%
                    </div>
                    <div className="text-2xl text-slate-500">Net Profit</div>
                </div>

                {/* Mobile Grid - Scaled Up */}
                <div className="flex-1 flex flex-col justify-center">
                    <CalendarGrid
                        daysInMonth={daysInMonth}
                        firstDayOfMonth={firstDayOfMonth}
                        dailyPnL={dailyPnL}
                        dailyTrades={dailyTrades}
                        className="border-slate-700 bg-slate-900 shadow-2xl scale-125 origin-center transform"
                        pnlTextSize="text-3xl"
                        tradeTextSize="text-lg"
                    />
                </div>

                {/* Mobile Footer */}
                <div className="mt-16 pt-12 border-t border-slate-800 flex flex-col items-center space-y-8">
                    <div className="flex items-center gap-12 text-2xl text-slate-500">
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                            <span>Profit Day</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)]"></div>
                            <span>Loss Day</span>
                        </div>
                    </div>
                    <div className="text-3xl text-slate-300 font-medium tracking-wide">
                        Join us at <span className="text-emerald-400 font-bold">connectalgo.com</span>
                    </div>
                </div>
            </div>
        </>
    );
}
