import { getStrategies } from "@/lib/data/strategies";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Calendar, Lock } from "lucide-react";
import Link from "next/link";
import { PerformanceChart } from "@/components/strategies/PerformanceChart";
import { ProfitCalculator } from "@/components/strategies/ProfitCalculator";
import { PricingSelector } from "@/components/strategies/PricingSelector";

// Generate static params for all strategies
export async function generateStaticParams() {
    const strategies = await getStrategies();
    return strategies.map((strategy) => ({
        id: strategy.id,
    }));
}

export default async function StrategyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === id);

    if (!strategy) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Strategy Not Found</h1>
                    <Button asChild>
                        <Link href="/">Go Back Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <main className="container mx-auto px-4 py-24">
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link href="/#strategies" className="flex items-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Strategies
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mr-2">{strategy.name}</h1>
                            {strategy.assetSubtype && (
                                <Badge variant="outline" className="border-slate-700 text-slate-400 text-lg py-1 px-3">
                                    {strategy.assetSubtype}
                                </Badge>
                            )}
                            {strategy.tags.map(tag => (
                                <Badge key={tag} className="bg-slate-800 text-slate-300 pointer-events-none whitespace-nowrap py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-xl text-slate-400 max-w-2xl">{strategy.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-emerald-400 text-4xl md:text-5xl font-bold mb-1">+{strategy.roi}%</div>
                        <div className="text-slate-500 uppercase tracking-widest text-xs">Yearly Return</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Chart & Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Performance Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PerformanceChart data={strategy.history} />
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <TrendingUp className="h-4 w-4" /> Win Rate
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-white">{strategy.winRate}%</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <AlertTriangle className="h-4 w-4" /> Drawdown
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-white">{strategy.drawdown}%</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <Lock className="h-4 w-4" /> Risk:Reward
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-white">{strategy.riskReward}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <Calendar className="h-4 w-4" /> History
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-white">
                                        {strategy.history.length >= 12 ? '1 Year' : `${strategy.history.length} Months`}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Monthly Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {strategy.history.map((month) => (
                                        <div key={month.date} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                                            <div className="text-xs text-slate-500 mb-1">{month.date}</div>
                                            <div className={`font-mono font-bold ${month.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {month.profit >= 0 ? '+' : ''}{month.profit}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Subscription */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* <Card className="bg-emerald-950/20 border-emerald-500/30 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
                                <PricingSelector strategy={strategy} />
                            </Card> */}

                            {/* <ProfitCalculator avgMonthlyReturn={
    strategy.history.reduce((acc, curr) => acc + curr.profit, 0) / strategy.history.length
} /> */}

                            <Card className="bg-slate-900/50 border-slate-800 opacity-70 hover:opacity-100 transition-opacity">
                                <CardHeader>
                                    <CardTitle className="text-white text-sm">Risk Warning</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Trading involves significant risk. Past performance is not indicative of future results.
                                        Only trade with capital you can afford to lose.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main >

            <Footer />
        </div >
    );
}
