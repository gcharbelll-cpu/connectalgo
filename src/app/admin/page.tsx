import { getStrategies } from "@/lib/data/strategies";
import { checkAuth, logout } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, LogOut } from "lucide-react";

export default async function AdminDashboard() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const strategies = await getStrategies();

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Admin Dashboard
                    </h1>
                    <form action={logout}>
                        <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950/50">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map((strategy) => (
                        <Card key={strategy.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">
                                    {strategy.name}
                                </CardTitle>
                                <Link href={`/admin/edit/${strategy.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
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

                    {/* Add New Strategy Placeholder */}
                    <Card className="bg-slate-900/50 border-slate-800 border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-slate-900 transition-colors">
                        <div className="text-center text-slate-500">
                            <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <span>Add New Strategy (Coming Soon)</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
