"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChartHorizontal } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <BarChartHorizontal className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Connect Algo
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/#strategies" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Strategies
                    </Link>
                    <Link href="/#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        How it Works
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                        <Link href="/#contact">Start Copying</Link>
                    </Button>
                </div>

                {/* Mobile Navigation Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-slate-300">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu (Simple implementation without Sheet for now to avoid dependency hell) */}
            {isOpen && (
                <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-slate-950 border-t border-slate-800 p-6 flex flex-col space-y-6 shadow-xl overflow-y-auto z-40">
                    <Link
                        href="/#strategies"
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
                        onClick={() => setIsOpen(false)}
                    >
                        Strategies
                    </Link>
                    <Link
                        href="/#how-it-works"
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
                        onClick={() => setIsOpen(false)}
                    >
                        How it Works
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
                        onClick={() => setIsOpen(false)}
                    >
                        Pricing
                    </Link>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12 mt-4" asChild>
                        <Link href="/#contact" onClick={() => setIsOpen(false)}>Start Copying</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}
