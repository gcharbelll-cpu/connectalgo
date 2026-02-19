const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE_PATH = 'c:/Users/Charbel/Downloads/Feb 26.xlsx';
const TRADES_OUTPUT_PATH = path.join(__dirname, '../src/lib/data/trades.json');
const STRATEGIES_OUTPUT_PATH = path.join(__dirname, '../src/lib/data/strategies.json');
const STRATEGY_ID = 'trend-intraday'; // Assumed based on BTC
const SYMBOL = 'BTCUSDT'; // Override symbol if needed, or take from file

function excelDateToJSDate(serial) {
    if (typeof serial === 'string') return new Date(serial).toISOString();
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds).toISOString();
}

try {
    const workbook = XLSX.readFile(FILE_PATH);

    // --- 1. Parse Performance Metrics ---
    // We need to hunt for values based on row labels because row indices might shift
    const performanceSheet = workbook.Sheets['Performance'];
    const analysisSheet = workbook.Sheets['Trades analysis'];
    const riskSheet = workbook.Sheets['Risk-adjusted performance'];

    const performanceData = XLSX.utils.sheet_to_json(performanceSheet, { header: 1 });
    const analysisData = XLSX.utils.sheet_to_json(analysisSheet, { header: 1 });
    const riskData = XLSX.utils.sheet_to_json(riskSheet, { header: 1 });

    const getValue = (data, label, colIndex = 1) => {
        const row = data.find(r => r[0] && r[0].toString().toLowerCase().includes(label.toLowerCase()));
        return row ? row[colIndex] : 0;
    };

    // Inspection showed "Percent profitable" row: [ 'Percent profitable', '', 62.5, '', 100, '', 50 ]
    // "Avg P&L" row: [ 'Avg P&L', 5764.22, 3.09, ... ]

    // For "Percent profitable", the value 62.5 is at index 2 (All %).
    const winRate = getValue(analysisData, 'Percent profitable', 2);

    // For "Largest winning trade percent", row 12: [ 'Largest winning trade percent', '', 9.52, ... ] -> Index 2
    const bestTrade = getValue(analysisData, 'Largest winning trade percent', 2);

    // For "Largest losing trade percent", row 14: [ 'Largest losing trade percent', '', 1.18, ... ] -> Index 2
    const worstTrade = getValue(analysisData, 'Largest losing trade percent', 2);

    const advancedMetrics = {
        totalTrades: getValue(analysisData, 'Total trades'),
        winRate: winRate, // %
        profitFactor: getValue(riskData, 'Profit factor'),
        sharpeRatio: getValue(riskData, 'Sharpe ratio'),
        sortinoRatio: getValue(riskData, 'Sortino ratio'),
        maxDrawdown: 0, // Still 0 for now
        avgTrade: getValue(analysisData, 'Avg P&L', 2), // % column is index 2
        bestTrade: bestTrade, // %
        worstTrade: worstTrade, // %
        recoveryFactor: 0
    };


    // --- 2. Parse Trades ---
    const sheet = workbook.Sheets['List of trades'];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const validTrades = [];
    const processedTradeNums = new Set();

    rawData.forEach(row => {
        const tradeNum = row['Trade #'];
        if (!tradeNum || processedTradeNums.has(tradeNum)) return;

        const tradeRows = rawData.filter(r => r['Trade #'] === tradeNum);
        const entryRow = tradeRows.find(r => r['Type'] && r['Type'].includes('Entry'));
        const exitRow = tradeRows.find(r => r['Type'] && r['Type'].includes('Exit'));

        if (!entryRow) return;

        const direction = entryRow['Type'].toLowerCase().includes('short') ? 'SHORT' : 'LONG';
        const dateIso = excelDateToJSDate(entryRow['Date and time']);

        const entryPrice = parseFloat(entryRow['Price USDT']);
        const exitPrice = exitRow ? parseFloat(exitRow['Price USDT']) : 0;

        // PnL info is on the EXIT row usually, or the row that closes the trade
        // Inspection showed "Net P&L %" on both entry and exit rows? No, usually cumulative or specific to that exec.
        // Let's take PnL from the Exit row if possible, or the one with non-zero PnL.
        // In the inspection, Exit row had "Net P&L %" filled.
        const pnlRow = exitRow || entryRow;

        const pnl = parseFloat(pnlRow['Net P&L %']) || 0;
        const pnlValue = parseFloat(pnlRow['Net P&L USDT']) || 0;
        const status = pnl > 0 ? 'WIN' : (pnl < 0 ? 'LOSS' : 'OPEN');

        const signal = entryRow['Signal'];
        const positionSize = parseFloat(entryRow['Position size (qty)']);
        const positionValue = parseFloat(entryRow['Position size (value)']);
        const runUp = parseFloat(pnlRow['Favorable excursion %']);
        const drawdown = parseFloat(pnlRow['Adverse excursion %']);

        const trade = {
            id: `${STRATEGY_ID}-${tradeNum}`,
            strategyId: STRATEGY_ID,
            date: dateIso,
            symbol: SYMBOL,
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
        };

        validTrades.push(trade);
        processedTradeNums.add(tradeNum);
    });

    // --- 3. Save Trades ---
    let existingTrades = [];
    if (fs.existsSync(TRADES_OUTPUT_PATH)) {
        existingTrades = JSON.parse(fs.readFileSync(TRADES_OUTPUT_PATH, 'utf-8'));
    }
    // Remove old trades for this strategy to replace with full new import
    const otherStrategyTrades = existingTrades.filter(t => t.strategyId !== STRATEGY_ID);
    const finalTrades = [...otherStrategyTrades, ...validTrades];
    fs.writeFileSync(TRADES_OUTPUT_PATH, JSON.stringify(finalTrades, null, 2));

    // --- 4. Update Strategy Metrics ---
    if (fs.existsSync(STRATEGIES_OUTPUT_PATH)) {
        const strategies = JSON.parse(fs.readFileSync(STRATEGIES_OUTPUT_PATH, 'utf-8'));
        const strategyIndex = strategies.findIndex(s => s.id === STRATEGY_ID);

        if (strategyIndex !== -1) {
            strategies[strategyIndex].advancedMetrics = advancedMetrics;

            // Also update main metrics to match file?
            if (advancedMetrics.winRate) strategies[strategyIndex].winRate = parseFloat(advancedMetrics.winRate);
            // ROI? Maybe calculate from Cumulative PnL % of last trade? 
            // In Sheet 3 row 0: "Cumulative P&L %".
            // Let's find the last trade's cumulative PnL.
            if (validTrades.length > 0) {
                // The rows might not be sorted by date in rawData, but usually are.
                // Let's trust the "Performance" sheet "All %" Net profit if possible.
                // "Net profit" row, index 2 (All %).
                const netProfitStr = getValue(performanceData, 'Net profit', 2);
                if (netProfitStr) strategies[strategyIndex].roi = parseFloat(netProfitStr);
            }

            fs.writeFileSync(STRATEGIES_OUTPUT_PATH, JSON.stringify(strategies, null, 2));
        }
    }

    console.log(`Imported ${validTrades.length} trades and updated metrics for ${STRATEGY_ID}.`);
    console.log("Metrics:", advancedMetrics);

} catch (error) {
    console.error("Error processing import:", error);
}
