import { createClient } from "@supabase/supabase-js";

export interface Trade {
    id: string;
    strategyId: string;
    date: string;
    symbol: string;
    type: 'LONG' | 'SHORT';
    entryPrice: number;
    exitPrice: number;
    pnl: number; // Percentage
    pnlValue: number; // USDT
    status: 'WIN' | 'LOSS' | 'OPEN';
    duration?: string;
    signal?: string;
    positionSize?: number; // Qty
    positionValue?: number; // USDT
    runUp?: number; // Favorable excursion %
    drawdown?: number; // Adverse excursion %
}

// Ensure the environment variables exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            persistSession: false,
        }
    }
);

export async function getTrades(strategyId?: string): Promise<Trade[]> {
    try {
        let query = supabase
            .from("trades")
            .select("*")
            .order("date", { ascending: true });

        if (strategyId) {
            query = query.eq("strategyId", strategyId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return (data || []) as Trade[];
    } catch (error) {
        console.error("Error reading trades from Supabase:", error);
        return [];
    }
}

export async function saveTrades(trades: Trade[], strategyId: string): Promise<void> {
    try {
        // Delete existing trades for this strategy
        const { error: deleteError } = await supabase
            .from("trades")
            .delete()
            .eq("strategyId", strategyId);

        if (deleteError) throw deleteError;

        if (trades.length === 0) return;

        // Insert in batches of 500 to avoid payload limits
        const batchSize = 500;
        for (let i = 0; i < trades.length; i += batchSize) {
            const batch = trades.slice(i, i + batchSize);
            const { error: insertError } = await supabase
                .from("trades")
                .insert(batch);

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error("Error saving trades to Supabase:", error);
        throw new Error("Failed to save trades");
    }
}
