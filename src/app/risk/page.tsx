import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RiskDisclosure() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Risk Disclosure</h1>

                <div className="space-y-6 text-slate-400 leading-loose">
                    <p>
                        <strong>General Risk Warning:</strong> Trading in financial markets, including but not limited to Forex,
                        Cryptocurrencies, Indices, and Commodities, involves a significant level of risk and may not be suitable
                        for all investors. The high degree of leverage that is often associated with trading can work against you
                        as well as for you. Before deciding to trade, you should carefully consider your investment objectives,
                        level of experience, and risk appetite.
                    </p>

                    <p>
                        <strong>Loss of Capital:</strong> There is a possibility that you may sustain a loss of some or all of your
                        initial investment and therefore you should not invest money that you cannot afford to lose. You should be
                        aware of all the risks associated with trading and seek advice from an independent financial advisor if you
                        have any doubts.
                    </p>

                    <p>
                        <strong>Algo Trading Risks:</strong> While Connect Algo uses advanced automated systems, past performance is
                        not indicative of future results. Automated trading systems are subject to technical failures, internet
                        disruptions, and market conditions that may affect execution. Specifically, slippage and latency can impact
                        the final result of a trade compared to the signal or backtest.
                    </p>

                    <p>
                        <strong>Third-Party Execution:</strong> We utilize Bybit's Copy Trading infrastructure. While we strive to
                        maintain the integrity of our Master Account, we are not responsible for technical issues, downtime, or
                        policies enacted by the exchange that may affect copy trading functionality.
                    </p>

                    <p>
                        <strong>No Financial Advice:</strong> The content provided on this website and our strategies is for educational
                        and informational purposes only. It does not constitute financial advice, investment advice, or a recommendation
                        to buy or sell any financial instrument.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
