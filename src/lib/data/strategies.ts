import { createClient } from "@supabase/supabase-js";

export interface Strategy {
  id: string;
  name: string;
  description: string;
  roi: number; // Return on Investment (percentage)
  drawdown: number; // Max Drawdown (percentage)
  winRate: number; // Win Rate (percentage)
  price: number; // Monthly subscription price
  priceSixMonth: number; // 6-Month subscription price
  priceYearly: number; // Yearly subscription price
  subscribers: number;
  rating: number; // 0-5 stars
  riskReward: string; // e.g., "1:3"
  provenRecordUrl?: string; // Optional TradingView link
  maxSubscribers?: number; // Optional limit for scarcity
  assetClass?: 'Crypto' | 'Forex' | 'Indices' | 'Commodities'; // Asset class for filtering
  assetSubtype?: string; // Specific asset (e.g., BTC, ETH, EUR/USD)
  tags: string[];
  history: {
    date: string;
    profit: number; // Percentage gain/loss for that period
  }[];
  advancedMetrics?: {
    totalTrades: number;
    winRate: number; // Percentage
    profitFactor: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number; // Percentage
    avgTrade: number; // Percentage
    bestTrade: number; // Percentage
    worstTrade: number; // Percentage
    recoveryFactor: number;
  };
}

// Ensure the environment variables exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

// We use the service role key here to bypass any potential Row Level Security on the server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    }
  }
);

// Helper to get strategies (server-side only)
export async function getStrategies(): Promise<Strategy[]> {
  try {
    const { data, error } = await supabase
      .from("strategies")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Strategy[];
  } catch (error) {
    console.error("Error reading strategies from Supabase:", error);
    return [];
  }
}

// Helper to save strategies (server-side only)
export async function saveStrategies(strategies: Strategy[]): Promise<void> {
  try {
    // Upsert all records
    const { error } = await supabase
      .from("strategies")
      .upsert(strategies);

    if (error) throw error;

    // Clean up deletions
    const { data: currentDbStrategies } = await supabase.from("strategies").select("id");
    if (currentDbStrategies) {
      const newIds = strategies.map(s => s.id);
      const idsToDelete = currentDbStrategies
        .map(dbS => dbS.id)
        .filter(id => !newIds.includes(id));

      if (idsToDelete.length > 0) {
        await supabase.from("strategies").delete().in("id", idsToDelete);
      }
    }
  } catch (error) {
    console.error("Error saving strategies to Supabase:", error);
    throw new Error("Failed to save strategies");
  }
}
