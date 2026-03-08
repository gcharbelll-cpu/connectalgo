"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SiteSettings } from "@/lib/data/settings";

interface HeroProps {
    settings?: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
    // Fallbacks just in case props don't load instantly
    const totalReturn = settings?.hero_total_return || "+2,450%";
    const activeInvestors = settings?.hero_active_investors || "1,500+";
    const strategiesCount = settings?.hero_strategies || "4";

    return (
        <section className="relative w-full overflow-hidden bg-slate-950 py-24 md:py-32 lg:py-40">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-800 rounded-full px-3 py-1 text-sm text-emerald-400 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Live Performance Verification</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl"
                    >
                        Institutional Grade <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 block mt-2 md:inline">
                            Trading Strategies
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
                    >
                        Automated copy trading on Bybit and exclusive EA access for Prop Firms.
                        Transparent records, verified results, and instant execution.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:min-w-[160px] h-12 text-lg shadow-lg shadow-emerald-500/20" asChild>
                            <Link href="/strategies/the-ultimate">
                                View Portfolio <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200 w-full sm:min-w-[160px] h-12 text-lg" asChild>
                            <Link href="#how-it-works">
                                Investment Process
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trusted Partners */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col items-center mt-12 mb-4 w-full max-w-3xl"
                    >
                        <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-8 text-center mt-6">Official Partners</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80 hover:opacity-100 transition-opacity duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/partners/bybit.png" alt="Bybit Official Partner" className="h-10 md:h-14 w-auto object-contain drop-shadow-lg" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/partners/ftmo.png" alt="FTMO Official Partner" className="h-9 md:h-12 w-auto object-contain drop-shadow-lg" />
                        </div>
                    </motion.div>

                    {/* Fund Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-3 gap-4 md:gap-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mt-8 backdrop-blur-md"
                    >
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] md:text-sm uppercase tracking-wider font-medium whitespace-nowrap">Compounded Yearly Return</span>
                            <span className="text-2xl md:text-4xl font-bold text-emerald-400 mt-1">{totalReturn}</span>
                        </div>
                        <div className="flex flex-col border-x border-slate-800/50 px-4 md:px-8">
                            <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">Active Investors</span>
                            <span className="text-2xl md:text-4xl font-bold text-white mt-1">{activeInvestors}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">Strategies</span>
                            <span className="text-2xl md:text-4xl font-bold text-white mt-1">{strategiesCount}</span>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-800/50 w-full max-w-5xl"
                    >
                        <div className="flex flex-col items-center p-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                                <BarChart2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Verified Performance</h3>
                            <p className="text-slate-400 text-sm">Real-time tracking of every trade and PnL.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Secure Execution</h3>
                            <p className="text-slate-400 text-sm">
                                Funds stay in your Bybit account. Trades are replicated automatically.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Instant Setup</h3>
                            <p className="text-slate-400 text-sm">
                                Connect to our Copy Trading on Bybit or deploy our EAs to your funded accounts.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
