

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function DashboardOverview() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/sign-in");
    }

    const hasActiveSubscription = profile.subscription_status === 'active';
    const planTier = profile.plan_tier; // 'none', 'pro', 'elite'

    if (!hasActiveSubscription) {
        return (
            <div className="space-y-8 max-w-4xl mx-auto mt-8">
                <div className="text-center space-y-4 mb-4">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-2">
                        <AlertCircle className="h-8 w-8 text-amber-500" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Complete Your Setup</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        To protect our strategies and prevent unauthorized sharing, our Master Copy Trading links are distributed <span className="text-emerald-400 font-semibold">privately</span> to verified members.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

                    {/* Step 1: Choose Plan */}
                    <Card className="bg-slate-900 border-slate-800 z-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">1</div>
                                <CardTitle className="text-xl text-white">Choose Your Plan</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Select between our Pro Copy Trading or Elite EA tiers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="space-y-3">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-white">Pro Tier</h3>
                                    </div>
                                    <p className="text-sm text-slate-400">Full Bybit Copy Trading Setup</p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-emerald-400">Elite Tier</h3>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Recommended</Badge>
                                    </div>
                                    <p className="text-sm text-slate-400">Pro + Prop Firm EA Downloads</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <Button className="w-full h-12 text-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" asChild>
                                    <Link href="/pricing">
                                        View Plans & Prices <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 2: Contact Us */}
                    <Card className="bg-slate-900 border-emerald-500/30 z-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">2</div>
                                <CardTitle className="text-xl text-white">Get Verified</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Contact our team after payment to receive your private Master Copy Trading link.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2 h-full flex flex-col justify-between">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>Send us a message with your username and payment receipt.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>We manually verify your subscription matrix to ensure security.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>We send you the private Bybit link directly and unlock this dashboard.</span>
                                    </li>
                                </ul>
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" asChild>
                                <a href="https://wa.me/96176374971?text=Hi!%20I%20just%20created%20an%20account%20on%20Connect%20Algo%20and%20want%20to%20verify%20my%20payment%20receipt." target="_blank" rel="noopener noreferrer">
                                    Message Support Team
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-400 mt-2">Manage your copy trading connections and strategy portfolio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Status Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-slate-200 flex items-center justify-between">
                            Active Subscription
                            <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Active</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Current Plan</p>
                                    <h3 className="text-2xl font-bold text-white capitalize">{planTier === 'none' ? 'No Plan' : `${planTier} Tier`}</h3>
                                </div>
                                <div className="text-right text-sm text-slate-400">
                                    <p>Billing: Lifetime</p>
                                    <p>Status: Active</p>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> All Copy Trading Strategies</li>
                            {planTier === 'elite' && (
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> EA Prop Firm Downloads</li>
                            )}
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Premium Support</li>
                        </ul>

                        <Button variant="outline" className="w-full mt-2 border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
                            <a
                                href="https://wa.me/96176374971?text=Hi!%20I%20need%20help%20managing%20my%20subscription."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                            >
                                Manage Subscription
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Bybit Connection Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-slate-200">Copy Trading Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            To protect our intellectual property, our Bybit Master Account is hidden from public search. You must request the private link from our team.
                        </p>

                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <h4 className="text-emerald-400 font-semibold mb-2">How to connect:</h4>
                            <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                                <li>Ensure you have a funded Bybit sub-account.</li>
                                <li>Contact our support team to receive the private Master link.</li>
                                <li>Click "Copy" on the Bybit page and allocate your desired capital.</li>
                            </ol>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" asChild>
                            <a
                                href="https://wa.me/96176374971?text=Hi!%20I%20would%20like%20my%20private%20Master%20Copy%20Trading%20link."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                            >
                                Message Support For Link
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
