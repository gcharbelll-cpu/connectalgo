import Link from "next/link";
import { BarChartHorizontal, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Brand */}
                <div className="space-y-4 md:col-span-2 lg:pr-12">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                                <BarChartHorizontal className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Connect Algo
                            </span>
                        </Link>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xs">
                        Institutional-grade automated trading strategies for the modern investor.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/#strategies" className="hover:text-emerald-400 transition-colors">Strategies</Link></li>
                        <li><Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link></li>
                        <li><Link href="/#pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/risk" className="hover:text-emerald-400 transition-colors">Risk Disclosure</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Connect</h3>
                    <div className="flex space-x-4">
                        <a href="https://instagram.com/connectalgo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                            <Instagram className="h-5 w-5" />
                            <span className="text-sm">@connectalgo</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Connect Algo. All rights reserved.</p>
            </div>
        </footer>
    );
}
