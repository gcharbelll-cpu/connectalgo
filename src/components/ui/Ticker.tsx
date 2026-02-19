"use client";

import { motion } from "framer-motion";

export function Ticker() {
    const items = [
        "Total Volume Traded: $12,450,000+",
        "Active Copiers: 1,420",
        "Live PnL Today: +2.4%",
        "30-Day Win Rate: 82%",
        "Strategies Active: 4",
        "Total Profit Generated: $4.2M+",
    ];

    return (
        <div className="w-full bg-emerald-950/30 border-b border-emerald-500/10 overflow-hidden py-2 backdrop-blur-sm">
            <div className="flex whitespace-nowrap">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed here
                    }}
                    className="flex gap-16 px-8 min-w-full"
                >
                    {[...items, ...items, ...items].map((item, i) => (
                        <span key={i} className="text-emerald-400 text-sm font-medium tracking-wide">
                            {item}
                        </span>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed here
                    }}
                    className="flex gap-16 px-8 min-w-full absolute top-2 left-full"
                    aria-hidden="true"
                >
                    {[...items, ...items, ...items].map((item, i) => (
                        <span key={i} className="text-emerald-400 text-sm font-medium tracking-wide">
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
