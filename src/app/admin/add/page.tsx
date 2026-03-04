import { checkAuth } from "../actions";
import { redirect } from "next/navigation";
import { StrategyForm } from "../_components/StrategyForm";
import { Strategy } from "@/lib/data/strategies";

export default async function AddStrategyPage() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const emptyStrategy: Strategy = {
        id: "",
        name: "",
        description: "",
        roi: 0,
        drawdown: 0,
        winRate: 0,
        price: 0,
        priceSixMonth: 0,
        priceYearly: 0,
        subscribers: 0,
        rating: 5,
        riskReward: "1:2",
        tags: [],
        history: [{ date: new Date().toISOString().slice(0, 7), profit: 0 }]
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Add New Strategy</h1>
                <StrategyForm strategy={emptyStrategy} isNew={true} />
            </div>
        </div>
    );
}
