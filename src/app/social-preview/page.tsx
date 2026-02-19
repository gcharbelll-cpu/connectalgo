"use client";

import { useRef, useState } from "react";
import { BarChartHorizontal, CheckCircle2, Shield, Zap, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toPng } from 'html-to-image';

export default function SocialPreview() {
    const previewRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!previewRef.current) return;

        setIsGenerating(true);
        try {
            // Wait for fonts/styles to stabilize
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(previewRef.current, {
                cacheBust: true,
                pixelRatio: 3, // Ultra-HD for Desktop
                skipAutoScale: true
            });
            const link = document.createElement('a');
            link.download = 'connect-algo-social-post.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
            alert("Error generating image. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const logoRef = useRef<HTMLDivElement>(null);

    const handleDownloadLogo = async () => {
        if (!logoRef.current) return;
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(logoRef.current, { cacheBust: true, pixelRatio: 4, skipAutoScale: true });
            const link = document.createElement('a');
            link.download = 'connect-algo-logo.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate logo', err);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 overflow-x-auto">

            <div className="mb-8 text-center space-y-4">
                <div>
                    <h1 className="text-white text-2xl font-bold mb-2">Social Media Pinned Post Generator</h1>
                    <p className="text-slate-400">High-Resolution Export for Instagram.</p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={handleDownloadLogo}
                        disabled={isGenerating}
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Download Logo
                    </Button>

                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-white text-slate-900 hover:bg-slate-200"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" /> Download Vertical Sequence (4:5)
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Hidden Logo Container for Capture */}
            <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
                <div ref={logoRef} className="w-[1080px] h-[1080px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] rounded-full bg-emerald-500/10 blur-[150px]" />
                    <div className="absolute top-[20%] -right-[10%] w-[60%] h-[120%] rounded-full bg-blue-600/10 blur-[150px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

                    {/* Logo Centerpiece */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-64 w-64 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-12">
                            <BarChartHorizontal className="h-32 w-32 text-white" />
                        </div>
                        <h1 className="text-8xl font-bold text-white tracking-tight">Connect Algo</h1>
                        <p className="text-emerald-400 text-3xl font-medium tracking-[0.2em] uppercase mt-4">Institutional Grade</p>
                    </div>
                </div>
            </div>

            {/* Container for the 3 panels - Aspect Ratio 2.4:1 (3 vertical 4:5 images) */}
            <div ref={previewRef} className="flex w-[1080px] h-[450px] md:w-[1350px] md:h-[562px] shrink-0 border border-slate-800 shadow-2xl overflow-hidden relative group bg-slate-950">

                {/* Continuous Background */}
                <div className="absolute inset-0 bg-slate-950">
                    {/* Gradients */}
                    <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] rounded-full bg-emerald-500/10 blur-[100px]" />
                    <div className="absolute top-[20%] -right-[10%] w-[60%] h-[120%] rounded-full bg-blue-600/10 blur-[100px]" />
                    <div className="absolute bottom-0 left-[30%] w-[40%] h-[50%] rounded-full bg-purple-500/5 blur-[80px]" />

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                {/* Panel 1: Brand & Tagline */}
                <div className="w-1/3 h-full relative border-r border-slate-800/50 flex flex-col justify-center items-center p-8 z-10">
                    <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                        <BarChartHorizontal className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2 text-center pb-1 leading-normal">
                        Connect Algo
                    </h1>
                    <p className="text-emerald-400 font-medium tracking-wider text-sm uppercase mb-6 text-center">
                        Institutional Grade
                    </p>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full px-4 py-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs text-slate-300">Live Performance Verification</span>
                    </div>
                </div>

                {/* Panel 2: Dashboard Mockup (Floating Glass) */}
                <div className="w-1/3 h-full relative border-r border-slate-800/50 flex items-center justify-center p-6 z-20 overflow-hidden">
                    {/* Simulated 3D Tilted Dashboard Card */}
                    <div className="relative w-[140%] transform -rotate-6 scale-90 hover:rotate-0 hover:scale-100 transition-all duration-500 ease-out shadow-2xl shadow-black/50">
                        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl text-xs md:text-sm">
                            <CardHeader className="p-3 border-b border-slate-800 flex flex-row justify-between items-center space-y-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="text-slate-500 font-mono text-[10px]">connectalgo.com</div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-slate-400 text-[10px] uppercase">Net Profit</div>
                                        <div className="text-2xl font-bold text-emerald-400">+$14,250.80</div>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">+24.5%</Badge>
                                </div>

                                {/* Mock Chart Area */}
                                <div className="h-24 w-full bg-gradient-to-t from-emerald-500/10 to-transparent rounded border border-emerald-500/10 relative overflow-hidden">
                                    <svg className="w-full h-full text-emerald-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <path d="M0,80 C20,70 40,90 60,40 S80,10 100,5" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                        <path d="M0,80 C20,70 40,90 60,40 S80,10 100,5 V100 H0 Z" fill="currentColor" fillOpacity="0.2" />
                                    </svg>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                                        <div className="text-[10px] text-slate-500">Win Rate</div>
                                        <div className="text-white font-bold">86.4%</div>
                                    </div>
                                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                                        <div className="text-[10px] text-slate-500">Drawdown</div>
                                        <div className="text-white font-bold">4.2%</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Glow behind dashboard */}
                        <div className="absolute -inset-4 bg-emerald-500/20 blur-xl -z-10 rounded-full"></div>
                    </div>
                </div>

                {/* Panel 3: Features & CTA */}
                <div className="w-1/3 h-full relative flex flex-col justify-center items-start p-8 z-10 pl-12">
                    <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                        The Only Tool You Need To <br />
                        <span className="text-emerald-400">Automate Wealth</span>
                    </h3>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <span className="text-slate-300 text-sm">100% Automated Copy Trading</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                                <Shield className="h-4 w-4" />
                            </div>
                            <span className="text-slate-300 text-sm">Funds Stay in Your Custody</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                                <Zap className="h-4 w-4" />
                            </div>
                            <span className="text-slate-300 text-sm">Proven 3-Year Track Record</span>
                        </li>
                    </ul>

                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                        Start Copying Today
                    </Button>
                </div>

            </div>

            <div className="mt-8 text-slate-500 text-sm max-w-lg text-center">
                Recommended: Click "Download Vertical Sequence" on your **Desktop Computer** then send the file to your phone.
                Crop into **3 Vertical (4:5)** images for Instagram.
            </div>
        </div>
    );
}
