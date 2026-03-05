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
                    <h2 className="text-xl font-semibold text-white">Active Strategies</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map((strategy) => (
                        <Card key={strategy.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">
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
                            <CardContent>
                                <div className="text-2xl font-bold text-white">+{strategy.roi}%</div>
                                <p className="text-xs text-slate-500 mt-1">ROI</p>
                                <div className="mt-4 flex justify-between text-sm">
                                    <span className="text-slate-400">Monthly Price:</span>
                                    <span className="text-emerald-400 font-mono">${strategy.price}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Strategy Button */}
                    <Link href="/admin/add">
                        <Card className="bg-slate-900/50 border-emerald-500/30 border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-emerald-950/20 hover:border-emerald-500 transition-colors group">
                            <div className="text-center text-emerald-500/70 group-hover:text-emerald-400">
                                <Plus className="h-8 w-8 mx-auto mb-2" />
                                <span className="font-medium">Create New Strategy</span>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
