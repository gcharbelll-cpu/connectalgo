"use server";

import { checkAuth } from "./actions";
import { getStrategies, saveStrategies, Strategy } from "@/lib/data/strategies";
import { saveTrades } from "@/lib/data/trades";
import { revalidatePath } from "next/cache";

// Excel date serial number to ISO string (UTC-based to avoid timezone shifts)
function excelDateToISO(serial: number | string): string {
    if (typeof serial === 'string') return new Date(serial).toISOString();
    // Excel epoch: Jan 1, 1900. JS epoch: Jan 1, 1970. Offset: 25569 days.
    const totalDays = serial - 25569;
    const wholeDays = Math.floor(totalDays);
    const fractionalDay = totalDays - wholeDays;
    // Convert to milliseconds from epoch
    const ms = wholeDays * 86400000 + Math.round(fractionalDay * 86400000);
    return new Date(ms).toISOString();
}

// Find a value in sheet data by row label
function getValue(data: any[][], label: string, colIndex: number = 1): any {
    const row = data.find(r => r[0] && r[0].toString().toLowerCase().includes(label.toLowerCase()));
    return row ? row[colIndex] : 0;
}

export async function importTradesFromExcel(strategyId: string, formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No file provided" };
    }

    try {
        // Dynamically import xlsx to avoid bundling issues
        const XLSX = await import("xlsx");

        // Read the file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        // --- 1. Parse Performance Metrics ---
        const performanceSheet = workbook.Sheets['Performance'];
        const analysisSheet = workbook.Sheets['Trades analysis'];
        const riskSheet = workbook.Sheets['Risk-adjusted performance'];
        const tradesSheet = workbook.Sheets['List of trades'];

        if (!performanceSheet || !analysisSheet || !riskSheet || !tradesSheet) {
            return { success: false, error: "Excel file is missing required sheets (Performance, Trades analysis, Risk-adjusted performance, List of trades)" };
        }

        const performanceData: any[][] = XLSX.utils.sheet_to_json(performanceSheet, { header: 1 });
        const analysisData: any[][] = XLSX.utils.sheet_to_json(analysisSheet, { header: 1 });
        const riskData: any[][] = XLSX.utils.sheet_to_json(riskSheet, { header: 1 });

        // Extract metrics
        const netProfit = parseFloat(getValue(performanceData, 'Net profit', 2)) || 0;
        const totalTrades = parseFloat(getValue(analysisData, 'Total trades', 1)) || 0;
        const winRate = parseFloat(getValue(analysisData, 'Percent profitable', 2)) || 0;
        const avgTrade = parseFloat(getValue(analysisData, 'Avg P&L', 2)) || 0;
        const bestTrade = parseFloat(getValue(analysisData, 'Largest winning trade percent', 2)) || 0;
        const worstTrade = parseFloat(getValue(analysisData, 'Largest losing trade percent', 2)) || 0;
        const profitFactor = parseFloat(getValue(riskData, 'Profit factor', 1)) || 0;
        const sharpeRatio = parseFloat(getValue(riskData, 'Sharpe ratio', 1)) || 0;
        const sortinoRatio = parseFloat(getValue(riskData, 'Sortino ratio', 1)) || 0;

        const advancedMetrics: Strategy['advancedMetrics'] = {
            totalTrades,
            winRate,
            profitFactor,
            sharpeRatio,
            sortinoRatio,
            maxDrawdown: 0,
            avgTrade,
            bestTrade,
            worstTrade,
            recoveryFactor: 0
        };

        // --- 2. Parse All Trades ---
        const rawTradeData: any[][] = XLSX.utils.sheet_to_json(tradesSheet, { header: 1 });
        const headers = rawTradeData[0] as string[];

        // Detect column names (handles both "USDT" and "USD" variants)
        const colPrice = headers.findIndex(h => h && h.toString().startsWith('Price'));
        const colQty = headers.findIndex(h => h && h.toString().includes('Position size (qty)'));
        const colValue = headers.findIndex(h => h && h.toString().includes('Position size (value)'));
        const colPnlValue = headers.findIndex(h => h && h.toString().startsWith('Net P&L') && !h.toString().includes('%'));
        const colPnlPct = headers.findIndex(h => h && h.toString().includes('Net P&L') && h.toString().includes('%'));
        const colFavExcPct = headers.findIndex(h => h && h.toString().includes('Favorable excursion') && h.toString().includes('%'));
        const colAdvExcPct = headers.findIndex(h => h && h.toString().includes('Adverse excursion') && h.toString().includes('%'));

        // Group rows by trade number
        const tradeGroups = new Map<number, any[][]>();
        for (let i = 1; i < rawTradeData.length; i++) {
            const row = rawTradeData[i];
            const tradeNum = row[0];
            if (!tradeNum || typeof tradeNum !== 'number') continue;
            if (!tradeGroups.has(tradeNum)) tradeGroups.set(tradeNum, []);
            tradeGroups.get(tradeNum)!.push(row);
        }

        interface TradeRecord {
            id: string;
            strategyId: string;
            date: string;
            symbol: string;
            type: 'LONG' | 'SHORT';
            entryPrice: number;
            exitPrice: number;
            pnl: number;
            pnlValue: number;
            status: 'WIN' | 'LOSS' | 'OPEN';
            signal: string;
            positionSize: number;
            positionValue: number;
            runUp: number;
            drawdown: number;
        }

        const parsedTrades: TradeRecord[] = [];

        tradeGroups.forEach((rows, tradeNum) => {
            // Find entry and exit rows
            const entryRow = rows.find(r => r[1] && r[1].toString().includes('Entry'));
            const exitRow = rows.find(r => r[1] && r[1].toString().includes('Exit'));

            if (!entryRow) return;

            const typeStr = entryRow[1].toString().toLowerCase();
            const direction: 'LONG' | 'SHORT' = typeStr.includes('short') ? 'SHORT' : 'LONG';
            const dateIso = excelDateToISO(entryRow[2]);
            const signal = entryRow[3]?.toString() || '';

            const entryPrice = parseFloat(entryRow[colPrice]) || 0;
            const exitPrice = exitRow ? (parseFloat(exitRow[colPrice]) || 0) : 0;

            // PnL from exit row if available
            const pnlRow = exitRow || entryRow;
            const pnl = parseFloat(pnlRow[colPnlPct]) || 0;
            const pnlValue = parseFloat(pnlRow[colPnlValue]) || 0;
            const status: 'WIN' | 'LOSS' | 'OPEN' = pnl > 0 ? 'WIN' : (pnl < 0 ? 'LOSS' : 'OPEN');

            const positionSize = parseFloat(entryRow[colQty]) || 0;
            const positionValue = parseFloat(entryRow[colValue]) || 0;
            const runUp = Math.abs(parseFloat(pnlRow[colFavExcPct]) || 0);
            const drawdown = Math.abs(parseFloat(pnlRow[colAdvExcPct]) || 0);

            parsedTrades.push({
                id: `${strategyId}-${tradeNum}`,
                strategyId,
                date: dateIso,
                symbol: 'BTCUSDT',
                type: direction,
                entryPrice,
                exitPrice,
                pnl,
                pnlValue,
                status,
                signal,
                positionSize,
                positionValue,
                runUp,
                drawdown
            });
        });

        // --- 3. Extract Max Drawdown from Performance sheet ---
        const sortedTrades = [...parsedTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const maxDrawdownPct = parseFloat(getValue(performanceData, 'Max equity drawdown (close-to-close)', 2)) || 0;
        advancedMetrics!.maxDrawdown = Math.abs(maxDrawdownPct);

        // --- 4. Save trades to Supabase ---
        await saveTrades(sortedTrades, strategyId);

        // --- 5. Update strategy in Supabase ---
        const strategies = await getStrategies();
        const strategyIndex = strategies.findIndex(s => s.id === strategyId);

        if (strategyIndex === -1) {
            return { success: false, error: `Strategy "${strategyId}" not found in database` };
        }

        strategies[strategyIndex].advancedMetrics = advancedMetrics;
        strategies[strategyIndex].roi = netProfit;
        if (advancedMetrics!.winRate) {
            strategies[strategyIndex].winRate = advancedMetrics!.winRate;
        }

        await saveStrategies(strategies);

        revalidatePath("/", "layout");
        revalidatePath("/admin");
        revalidatePath("/strategies");

        return {
            success: true,
            tradesImported: parsedTrades.length,
            metrics: advancedMetrics,
            roi: netProfit
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return { success: false, error: error.message || "Failed to import trades" };
    }
}
