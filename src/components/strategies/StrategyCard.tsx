"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Strategy } from "@/lib/data/strategies";
import { cn } from "@/lib/utils";

interface StrategyCardProps {
    strategy: Strategy;
    isFeatured?: boolean;
}

export function StrategyCard({ strategy, isFeatured = false }: StrategyCardProps) {
    if (isFeatured) {
        return (
            <Card className="flex flex-col md:flex-row h-full border-slate-700 bg-slate-900/80 backdrop-blur-xl transition-all overflow-hidden">
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            {isFeatured && (
                                <Badge className="mb-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/50 w-fit">
                                    Most Popular
                                </Badge>
                            )}
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{strategy.name}</h3>
                                {strategy.assetSubtype && (
                                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                                        {strategy.assetSubtype}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-2xl">
                        {strategy.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {strategy.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300 whitespace-nowrap py-1">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <Button size="lg" className="w-fit bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/50" asChild>
                        <Link href={`/strategies/${strategy.id}`}>
                            View Details <ArrowUpRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 bg-slate-950/50 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <span className="text-sm text-slate-500 uppercase tracking-wider flex-shrink-0">Total Return</span>
                            <div className="text-2xl min-[400px]:text-3xl md:text-4xl font-bold text-emerald-400 mt-1 whitespace-nowrap">+{strategy.roi}%</div>
                        </div>
                        <div>
                            <span className="text-sm text-slate-500 uppercase tracking-wider flex-shrink-0">Win Rate</span>
                            <div className="text-2xl min-[400px]:text-3xl md:text-4xl font-bold text-white mt-1 whitespace-nowrap">{strategy.winRate}%</div>
                        </div>
                        <div>
                            <span className="text-sm text-slate-500 uppercase tracking-wider flex-shrink-0">Max Drawdown</span>
                            <div className="text-xl min-[400px]:text-2xl md:text-2xl font-bold text-slate-200 mt-1 whitespace-nowrap">{strategy.drawdown}%</div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl text-white">{strategy.name}</CardTitle>
                            {strategy.assetSubtype && (
                                <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs py-0.5 px-2">
                                    {strategy.assetSubtype}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {strategy.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-emerald-400">
                            +{strategy.roi}%
                        </span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">All Time ROI</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <p className="text-slate-400 text-sm leading-relaxed">
                    {strategy.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                            <TrendingUp className="h-3 w-3" /> Win Rate
                        </div>
                        <div className="text-lg font-semibold text-white">{strategy.winRate}%</div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                            <AlertTriangle className="h-3 w-3" /> Max Drawdown
                        </div>
                        <div className="text-lg font-semibold text-white">{strategy.drawdown}%</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-slate-800/50 flex items-center justify-end">
                <Button className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/50" asChild>
                    <Link href={`/strategies/${strategy.id}`}>
                        View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card >
    );
}
