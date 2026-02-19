import { getStrategies } from "@/lib/data/strategies";
import { getTrades, Trade } from "@/lib/data/trades";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceOverview } from "@/components/strategies/PerformanceOverview";
import { PerformanceCalendar } from "@/components/strategies/PerformanceCalendar";
import { TradeHistoryTable } from "@/components/strategies/TradeHistoryTable";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function VerifiedRecordPage({ params }: PageProps) {
    const { id } = await params;
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === id);

    if (!strategy) {
        notFound();
    }

    const allTrades = await getTrades();
    const trades = allTrades.filter(t => t.strategyId === id);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <Link href={`/strategies/${id}`} className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-2 transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Strategy
                            </Link>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white">{strategy.name}</h1>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Verified Record
                                </Badge>
                            </div>
                            <p className="text-slate-400 mt-1">
                                Official trading history and advanced performance metrics.
                            </p>
                        </div>
                        {/* Export button removed as per user request */}
                    </div>

                    {/* Dashboard Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-slate-900 border-slate-800 p-1">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                Calendar
                            </TabsTrigger>
                            <TabsTrigger value="trades" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                Trade History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
                            <PerformanceOverview strategy={strategy} trades={trades} />
                        </TabsContent>

                        <TabsContent value="calendar" className="space-y-6 animate-in fade-in-50 duration-500">
                            <PerformanceCalendar trades={trades} />
                        </TabsContent>

                        <TabsContent value="trades" className="animate-in fade-in-50 duration-500">
                            <TradeHistoryTable trades={trades} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div>
    );
}
