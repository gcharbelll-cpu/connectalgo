"use client";

import { useState } from "react";
import { Strategy } from "@/lib/data/strategies";
import { StrategyCard } from "@/components/strategies/StrategyCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Hammer } from "lucide-react";

interface StrategyShowcaseProps {
    strategies: Strategy[];
}

export function StrategyShowcase({ strategies }: StrategyShowcaseProps) {
    const [activeTab, setActiveTab] = useState("Crypto");

    const categories = ["Crypto", "Forex", "Indices", "Commodities"];

    const filteredStrategies = strategies.filter((strategy) => {
        // "The Ultimate" always shows in every category
        if (strategy.id === 'the-ultimate') return true;

        return strategy.assetClass === activeTab;
    });

    // Separate Ultimate from others for layout
    const ultimateStrategy = filteredStrategies.find(s => s.id === 'the-ultimate');
    const otherStrategies = filteredStrategies.filter(s => s.id !== 'the-ultimate');

    return (
        <div className="space-y-8">
            <Tabs defaultValue="Crypto" className="w-full flex justify-center" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 px-6 py-2 rounded-lg transition-all"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {otherStrategies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {otherStrategies.map((strategy) => (
                                <div key={strategy.id} className="h-full">
                                    <StrategyCard strategy={strategy} />
                                </div>
                            ))}

                            {/* If Ultimate is in the filtered list, show it full width at bottom */}
                            {ultimateStrategy && (
                                <div className="md:col-span-3 mt-8">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative">
                                            <StrategyCard strategy={ultimateStrategy} isFeatured={true} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/50 group">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                                <div className="bg-slate-900 p-6 rounded-2xl ring-1 ring-slate-800 relative z-10 transition-transform group-hover:scale-105 duration-500">
                                    <Clock className="h-10 w-10 text-emerald-500 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-800">
                                        <Hammer className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{activeTab} Strategies Coming Soon</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Our quantitative team is finalizing the backtesting for our {activeTab} algorithms.
                                Stay tuned for the launch!
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
