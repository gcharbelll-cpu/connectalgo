const XLSX = require('xlsx');

// Inspect all sheets of both files
const files = [
    { name: 'Model I', path: 'C:/Users/Charbel/Downloads/Model_I_Copy_Trading_Connectalgo_com_BYBIT_BTCUSDT_P_2026_03_06.xlsx' },
    { name: 'Model II', path: 'C:/Users/Charbel/Downloads/Model_II_Copy_Trading_Connectalgo_com_BYBIT_BTCUSDT_P_2026_03_06.xlsx' }
];

files.forEach(f => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`FILE: ${f.name}`);
    console.log('='.repeat(60));

    const wb = XLSX.readFile(f.path);

    // Performance sheet - first 15 rows
    console.log('\n--- Performance Sheet ---');
    const perfData = XLSX.utils.sheet_to_json(wb.Sheets['Performance'], { header: 1 });
    perfData.slice(0, 15).forEach((r, i) => console.log(`  [${i}]: ${JSON.stringify(r)}`));

    // Trades analysis - first 20 rows
    console.log('\n--- Trades Analysis Sheet ---');
    const analysisData = XLSX.utils.sheet_to_json(wb.Sheets['Trades analysis'], { header: 1 });
    analysisData.slice(0, 20).forEach((r, i) => console.log(`  [${i}]: ${JSON.stringify(r)}`));

    // Risk-adjusted - first 10 rows
    console.log('\n--- Risk-adjusted Performance Sheet ---');
    const riskData = XLSX.utils.sheet_to_json(wb.Sheets['Risk-adjusted performance'], { header: 1 });
    riskData.slice(0, 10).forEach((r, i) => console.log(`  [${i}]: ${JSON.stringify(r)}`));

    // List of trades - first 10 rows
    console.log('\n--- List of Trades Sheet (first 10 rows) ---');
    const tradesData = XLSX.utils.sheet_to_json(wb.Sheets['List of trades'], { header: 1 });
    tradesData.slice(0, 10).forEach((r, i) => console.log(`  [${i}]: ${JSON.stringify(r)}`));
    console.log(`  ... Total trade rows: ${tradesData.length - 1}`);

    // Last 5 rows of trades
    console.log('\n--- List of Trades (last 5 rows) ---');
    tradesData.slice(-5).forEach((r, i) => console.log(`  [${tradesData.length - 5 + i}]: ${JSON.stringify(r)}`));
});
