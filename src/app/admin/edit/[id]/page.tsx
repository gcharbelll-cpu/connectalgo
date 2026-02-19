import { getStrategies } from "@/lib/data/strategies";
import { checkAuth } from "../../actions";
import { redirect } from "next/navigation";
import { StrategyForm } from "../../_components/StrategyForm";

export default async function EditStrategyPage({ params }: { params: Promise<{ id: string }> }) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const { id } = await params;
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === id);

    if (!strategy) {
        return <div className="text-white text-center py-20">Strategy not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Edit Strategy: {strategy.name}</h1>
                <StrategyForm strategy={strategy} />
            </div>
        </div>
    );
}
