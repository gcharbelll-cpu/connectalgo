import { cn } from "@/lib/utils";

interface CalendarGridProps {
    daysInMonth: number;
    firstDayOfMonth: number;
    dailyPnL: Record<number, number>;
    dailyTrades: Record<number, number>;
    className?: string;
    pnlTextSize?: string;
    tradeTextSize?: string;
}

export function CalendarGrid({
    daysInMonth,
    firstDayOfMonth,
    dailyPnL,
    dailyTrades,
    className,
    pnlTextSize = "text-[10px] sm:text-xs md:text-lg",
    tradeTextSize = "text-[8px] md:text-xs"
}: CalendarGridProps) {
    return (
        <div className={cn("grid grid-cols-7 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden", className)}>
            {/* Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-950 text-slate-500 text-[10px] md:text-xs text-center py-2 font-medium uppercase">
                    {day}
                </div>
            ))}

            {/* Empty cells for start of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-slate-900/30 min-h-[60px] md:min-h-[100px]" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const pnl = dailyPnL[day];
                const count = dailyTrades[day];

                let bgClass = "bg-slate-950";
                let textClass = "text-slate-400";
                let borderClass = "border-transparent"; // Add default border

                if (pnl > 0) {
                    bgClass = "bg-emerald-950/30";
                    textClass = "text-emerald-400";
                    borderClass = "border-emerald-500/20";
                } else if (pnl < 0) {
                    bgClass = "bg-red-950/30";
                    textClass = "text-red-400";
                    borderClass = "border-red-500/20";
                }

                return (
                    <div key={day} className={`${bgClass} min-h-[60px] md:min-h-[100px] p-0.5 md:p-2 transition-colors relative group border ${borderClass}`}>
                        <div className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1 pl-1">{day}</div>
                        {count && (
                            <div className="flex flex-col items-center justify-center h-full pb-4">
                                <div className={`font-bold ${textClass} ${pnlTextSize} whitespace-nowrap tracking-tighter leading-none`}>
                                    {pnl > 0 ? "+" : ""}{pnl.toFixed(2)}%
                                </div>
                                <div className={`${tradeTextSize} text-slate-600 leading-none mt-0.5 opacity-80`}>
                                    {count} {count === 1 ? 'trade' : 'trades'}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
