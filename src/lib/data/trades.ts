import fs from "fs";
import path from "path";

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

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/data/trades.json");

export async function getTrades(strategyId?: string): Promise<Trade[]> {
    try {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const trades: Trade[] = JSON.parse(fileContent);

        if (strategyId) {
            return trades.filter(t => t.strategyId === strategyId);
        }

        return trades;
    } catch (error) {
        console.error("Error reading trades file:", error);
        return [];
    }
}
