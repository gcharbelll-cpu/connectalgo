import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Terms of Service</h1>
                <div className="prose prose-invert max-w-none space-y-8 text-slate-400">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing Connect Algo ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Nature of Service</h2>
                        <p>
                            Connect Algo provides algorithmic trading signals and educational content via the Bybit Copy Trading platform.
                            We are not a financial institution, bank, or licensed financial advisor.
                            The Service is strictly for informational and educational purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. No Financial Advice</h2>
                        <p>
                            Nothing on this website or in our Service constitutes financial, investment, legal, or tax advice.
                            Performance statistics are historical and do not guarantee future results.
                            You are solely responsible for your investment decisions and should consult with a qualified financial advisor before investing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. Risks of Trading</h2>
                        <p>
                            Trading cryptocurrencies and derivatives involves a high degree of risk and is not suitable for all investors.
                            You acknowledges that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>You may lose some or all of your invested capital.</li>
                            <li>Past performance of our algorithms is not indicative of future performance.</li>
                            <li>Market conditions, liquidity, and slippage can affect trade execution.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">5. Third-Party Platforms</h2>
                        <p>
                            Our Service relies on the Bybit exchange platform. We have no control over Bybit's operations, security, or availability.
                            You agree to comply with Bybit's separate Terms of Service and acknowledge that Connect Algo is not liable for any issues arising from the use of Bybit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">6. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Connect Algo shall not be liable for any direct, indirect, incidental, or consequential damages resulting from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>The use or inability to use the Service.</li>
                            <li>Financial losses incurred through copy trading.</li>
                            <li>Unauthorized access to or alteration of your transmissions or data.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">7. Subscription & Refunds</h2>
                        <p>
                            Subscriptions are processed via the Bybit platform or direct agreement.
                            Refund policies are subject to the specific terms agreed upon at the time of subscription or Bybit's platform policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">8. Modifications</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Continued use of the Service constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-800 text-sm text-slate-500">
                        Last Updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
