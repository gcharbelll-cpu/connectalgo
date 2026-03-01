import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { AlertCircle } from "lucide-react";

export default async function SignUp(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 pt-40 pb-12">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-slate-400">Join to start copying institutional strategies and <span className="text-emerald-400 font-medium">Prop Firm EAs</span></p>
                        </div>

                        {searchParams?.error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium leading-relaxed">{searchParams.error}</p>
                            </div>
                        )}

                        <form className="space-y-6" action={signup}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 block" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 block" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 block" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder="Create a strong password"
                                />
                            </div>

                            <Button className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 transition-colors" type="submit">
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                            <p className="text-slate-400">
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
