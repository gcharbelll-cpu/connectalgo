

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Lock, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { requireAuth, getUserProfile } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function DownloadsDashboard() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/sign-in");
    }

    // Only Elite users can view this page
    const isEliteUser = profile.plan_tier === 'elite';

    if (!isEliteUser) {
        return (
            <div className="space-y-8 relative">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">EA Downloads</h1>
                    <p className="text-slate-400 mt-2">Access Prop Firm Expert Advisors to pass your challenges.</p>
                </div>

                {/* Unpaid Overlay */}
                <div className="fixed inset-0 z-50 flex items-center justify-center md:pl-64 px-4 pointer-events-none">
                    <Card className="w-full max-w-md bg-slate-900/95 border-emerald-500/30 backdrop-blur-md shadow-2xl mx-auto pointer-events-auto">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                                <Lock className="h-8 w-8 text-emerald-500" />
                            </div>
                            <CardTitle className="text-2xl text-white">Elite Access Required</CardTitle>
                            <CardDescription className="text-slate-400">
                                Expert Advisor downloads are available exclusively to our Elite tier members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Button className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                <Link href="/pricing">
                                    Upgrade to Elite <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Blurred Content Behind */}
                <div className="space-y-8 blur-md pointer-events-none opacity-50 select-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-white mb-1">Prop Firm EA - MT4</CardTitle>
                                        <CardDescription className="text-slate-400">Version 2.4.1 (Latest)</CardDescription>
                                    </div>
                                    <Badge className="bg-blue-500/20 text-blue-400">Windows/VPS</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-16 bg-slate-800/50 rounded-md w-full"></div>
                                <div className="h-8 bg-slate-800/50 rounded-md w-full mt-2"></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-blue-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-white mb-1">Prop Firm EA - MT5</CardTitle>
                                        <CardDescription className="text-slate-400">Version 2.4.1 (Latest)</CardDescription>
                                    </div>
                                    <Badge className="bg-blue-500/20 text-blue-400">Windows/VPS</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-16 bg-slate-800/50 rounded-md w-full"></div>
                                <div className="h-8 bg-slate-800/50 rounded-md w-full mt-2"></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">EA Access</h1>
                <p className="text-slate-400 mt-2">Request your custom-compiled Prop Firm Expert Advisors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl text-white mb-1">Prop Firm EA - MT4</CardTitle>
                                <CardDescription className="text-slate-400">Version 2.4.1 (Latest)</CardDescription>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400">Windows/VPS</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-300">
                            The MetaTrader 4 version of our prop firm passing strategy. Pre-configured for FTMO and FundedNext. <br /><br />
                            <span className="text-emerald-400 font-medium">Files are custom-compiled for your specific MT4 account number to ensure maximum security.</span>
                        </p>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Auto lot size calculation</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Daily drawdown protection</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-slate-800/50">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" asChild>
                            <Link href="#" onClick={(e) => { e.preventDefault(); alert('Redirect to Support WhatsApp/Telegram for MT4 File'); }}>
                                <FileText className="h-4 w-4 mr-2" /> Message Support for MT4 File
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-blue-500">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl text-white mb-1">Prop Firm EA - MT5</CardTitle>
                                <CardDescription className="text-slate-400">Version 2.4.1 (Latest)</CardDescription>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400">Windows/VPS</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-300">
                            The MetaTrader 5 version. Recommended for faster execution and better backtesting capabilities. <br /><br />
                            <span className="text-emerald-400 font-medium">Files are custom-compiled for your specific MT5 account number to ensure maximum security.</span>
                        </p>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Auto lot size calculation</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Daily drawdown protection</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-slate-800/50">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" asChild>
                            <Link href="#" onClick={(e) => { e.preventDefault(); alert('Redirect to Support WhatsApp/Telegram for MT5 File'); }}>
                                <FileText className="h-4 w-4 mr-2" /> Message Support for MT5 File
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800 mt-8">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-200">Installation Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                        <p>1. Message our support team with your MT4 or MT5 account number to receive your custom .ex4 or .ex5 file.</p>
                        <p>2. Open your MetaTrader terminal and go to <strong>File {'>'} Open Data Folder</strong>.</p>
                        <p>3. Navigate to <strong>MQL4/Experts</strong> (or MQL5/Experts) and paste the downloaded file.</p>
                        <p>4. Restart your MetaTrader terminal.</p>
                        <p>5. Drag the EA from the Navigator panel onto any chart (recommended: EURUSD M15).</p>
                        <p>6. Ensure "Allow Auto Trading" is enabled in the platform and the EA settings.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
