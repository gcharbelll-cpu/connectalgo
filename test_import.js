const XLSX = require('xlsx');
const path = require('path');

function excelDateToISO(serial) {
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

function getValue(data, label, colIndex = 1) {
    const row = data.find(r => r[0] && r[0].toString().toLowerCase().includes(label.toLowerCase()));
    return row ? row[colIndex] : 0;
}

const files = [
    { name: 'Model I', path: 'C:/Users/Charbel/Downloads/Model_I_Copy_Trading_Connectalgo_com_BYBIT_BTCUSDT_P_2026_03_06.xlsx', strategyId: 'trend-swing' },
    { name: 'Model II', path: 'C:/Users/Charbel/Downloads/Model_II_Copy_Trading_Connectalgo_com_BYBIT_BTCUSDT_P_2026_03_06.xlsx', strategyId: 'steady-income' }
];

files.forEach(f => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing: ${f.name} (${f.strategyId})`);
    console.log('='.repeat(50));

    const wb = XLSX.readFile(f.path);
    const perfData = XLSX.utils.sheet_to_json(wb.Sheets['Performance'], { header: 1 });
    const analysisData = XLSX.utils.sheet_to_json(wb.Sheets['Trades analysis'], { header: 1 });
    const riskData = XLSX.utils.sheet_to_json(wb.Sheets['Risk-adjusted performance'], { header: 1 });
    const rawTradeData = XLSX.utils.sheet_to_json(wb.Sheets['List of trades'], { header: 1 });

    // Metrics
    const roi = parseFloat(getValue(perfData, 'Net profit', 2)) || 0;
    const totalTrades = parseFloat(getValue(analysisData, 'Total trades', 1)) || 0;
    const winRate = parseFloat(getValue(analysisData, 'Percent profitable', 2)) || 0;
    const avgTrade = parseFloat(getValue(analysisData, 'Avg P&L', 2)) || 0;
    const bestTrade = parseFloat(getValue(analysisData, 'Largest winning trade percent', 2)) || 0;
    const worstTrade = parseFloat(getValue(analysisData, 'Largest losing trade percent', 2)) || 0;
    const profitFactor = parseFloat(getValue(riskData, 'Profit factor', 1)) || 0;
    const sharpeRatio = parseFloat(getValue(riskData, 'Sharpe ratio', 1)) || 0;
    const sortinoRatio = parseFloat(getValue(riskData, 'Sortino ratio', 1)) || 0;

    console.log('\nMETRICS:');
    console.log(`  ROI: ${roi}%`);
    console.log(`  Total Trades: ${totalTrades}`);
    console.log(`  Win Rate: ${winRate}%`);
    console.log(`  Avg Trade: ${avgTrade}%`);
    console.log(`  Best Trade: ${bestTrade}%`);
    console.log(`  Worst Trade: ${worstTrade}%`);
    console.log(`  Profit Factor: ${profitFactor}`);
    console.log(`  Sharpe Ratio: ${sharpeRatio}`);
    console.log(`  Sortino Ratio: ${sortinoRatio}`);

    // Parse trades
    const headers = rawTradeData[0];
    const colPnlPct = headers.findIndex(h => h && h.toString().includes('Net P&L') && h.toString().includes('%'));

    const tradeGroups = new Map();
    for (let i = 1; i < rawTradeData.length; i++) {
        const row = rawTradeData[i];
        const tradeNum = row[0];
        if (!tradeNum || typeof tradeNum !== 'number') continue;
        if (!tradeGroups.has(tradeNum)) tradeGroups.set(tradeNum, []);
        tradeGroups.get(tradeNum).push(row);
    }

    let parsedCount = 0;
    let skippedCount = 0;
    tradeGroups.forEach((rows, tradeNum) => {
        const entryRow = rows.find(r => r[1] && r[1].toString().includes('Entry'));
        if (!entryRow) {
            skippedCount++;
            console.log(`  SKIPPED trade #${tradeNum} - no entry row. Types: ${rows.map(r => r[1]).join(', ')}`);
        } else {
            parsedCount++;
        }
    });

    console.log(`\nTRADES:`);
    console.log(`  Groups found: ${tradeGroups.size}`);
    console.log(`  Parsed: ${parsedCount}`);
    console.log(`  Skipped: ${skippedCount}`);
    console.log(`  Expected (from sheet): ${totalTrades}`);
    console.log(`  Match: ${parsedCount === totalTrades ? '✅' : '❌'}`);
});
