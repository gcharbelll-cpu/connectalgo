const fs = require('fs');
const path = require('path');

const TRADES_FILE = 'src/lib/data/trades.json';
const STRATEGIES_FILE = 'src/lib/data/strategies.json';

try {
    const tradesRaw = fs.readFileSync(TRADES_FILE, 'utf8');
    const trades = JSON.parse(tradesRaw);

    console.log(`Total trades in file: ${trades.length}`);

    const strategiesRaw = fs.readFileSync(STRATEGIES_FILE, 'utf8');
    const strategies = JSON.parse(strategiesRaw);

    strategies.forEach(s => {
        const sTrades = trades.filter(t => t.strategyId === s.id);
        console.log(`\nStrategy: ${s.name} (ID: ${s.id})`);
        console.log(`- Trade Count: ${sTrades.length}`);
        if (sTrades.length > 0) {
            console.log(`- Sample Trade Date: ${sTrades[0].date}`);
        }
    });

} catch (e) {
    console.error("Error verifying data:", e);
}
