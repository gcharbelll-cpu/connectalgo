import { getStrategies } from "@/lib/data/strategies";
import { getSiteSettings } from "@/lib/data/settings";
import { checkAuth, logout } from "./actions";
import { saveSiteSettings } from "./settingsActions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, LogOut, Users } from "lucide-react";
import { SettingsForm } from "./_components/SettingsForm";
import { DeleteStrategyButton } from "./_components/DeleteStrategyButton";

export default async function AdminDashboard() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const strategies = await getStrategies();
    const siteSettings = await getSiteSettings();

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Admin Command Center
                        </h1>
                        <p className="text-slate-400 mt-2">Manage trading strategies, site settings, and user subscriptions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                <Link href="/admin/users">
                                    <Users className="h-4 w-4 mr-2" />
                                    Subscribers
                                </Link>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                <Link href="/admin/testimonials">
                                    <Users className="h-4 w-4 mr-2" />
                                    Reviews
                                </Link>
                            </Button>
                        </div>
                        <form action={logout}>
                            <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950/50">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>

                {/* --- SEATS NOTIFIER --- */}
                <div className="mb-12">
                    <SettingsForm initialSettings={siteSettings} onSave={saveSiteSettings} />
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-white">Quick Links</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Link href="/admin/add">
                        <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="bg-emerald-500/10 p-3 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                                    <Plus className="h-6 w-6 text-emerald-500" />
                                </div>
                                <span className="font-medium text-slate-200">Add Strategy</span>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/users">
                        <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="bg-blue-500/10 p-3 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                    <Users className="h-6 w-6 text-blue-500" />
                                </div>
                                <span className="font-medium text-slate-200">Manage Users</span>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/testimonials">
                        <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/50 transition-colors cursor-pointer group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="bg-amber-500/10 p-3 rounded-full group-hover:bg-amber-500/20 transition-colors">
                                    <span className="text-xl font-bold text-amber-500 leading-none">★</span>
                                </div>
                                <span className="font-medium text-slate-200">Manage Reviews</span>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/faq">
                        <Card className="bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="bg-purple-500/10 p-3 rounded-full group-hover:bg-purple-500/20 transition-colors">
                                    <span className="text-xl font-bold text-purple-500 leading-none">?</span>
                                </div>
                                <span className="font-medium text-slate-200">Manage FAQs</span>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/admins">
                        <Card className="bg-slate-900 border-slate-800 hover:border-rose-500/50 transition-colors cursor-pointer group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="bg-rose-500/10 p-3 rounded-full group-hover:bg-rose-500/20 transition-colors">
                                    <span className="text-xl font-bold text-rose-500 leading-none">🔑</span>
                                </div>
                                <span className="font-medium text-slate-200">System Admins</span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="mt-12 mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Manage Strategies</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map((strategy) => (
                        <Card key={strategy.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium text-slate-200">
                                    {strategy.name}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Link href={`/admin/edit/${strategy.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Edit Strategy">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <DeleteStrategyButton strategyId={strategy.id} strategyName={strategy.name} />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-2xl font-bold text-white">+{strategy.roi}%</div>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase">Compounded Yearly ROI</p>
                                <div className="mt-4 flex justify-between text-sm">
                                    <span className="text-slate-400">Monthly Price:</span>
                                    <span className="text-emerald-400 font-mono">${strategy.price}</span>
                                </div>
                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-slate-400">Subscribers:</span>
                                    <span className="text-blue-400 font-mono">{strategy.subscribers}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800">
                                    <Link href={`/admin/edit/${strategy.id}`}>
                                        <Button variant="outline" className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700">
                                            Edit Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {strategies.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                            No strategies found. Click "Add Strategy" to create one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
