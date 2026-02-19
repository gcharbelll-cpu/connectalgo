import fs from "fs";
import path from "path";

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

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/data/strategies.json");

// Helper to get strategies (server-side only)
export async function getStrategies(): Promise<Strategy[]> {
  try {
    const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading strategies file:", error);
    return [];
  }
}

// Helper to save strategies (server-side only)
export async function saveStrategies(strategies: Strategy[]): Promise<void> {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(strategies, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving strategies file:", error);
    throw new Error("Failed to save strategies");
  }
}

// Fallback for client-side usage if needed (though we should avoid using this directly in client components if we want real-time updates)
// We export a static version for components that might still be importing it directly, 
// but we should refactor them to use the async getter or pass data as props.
import data from "./strategies.json";
export const strategies: Strategy[] = data as Strategy[];
