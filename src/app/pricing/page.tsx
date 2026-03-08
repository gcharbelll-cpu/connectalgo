import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
    title: "Pricing | Connect Algo",
    description: "Simple, transparent pricing for institutional-grade trading strategies.",
};

export default async function PricingPage() {

    const settings = await getSiteSettings();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <main className="pt-32 pb-24 container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Transparent <span className="text-emerald-400">Pricing</span>
                    </h1>
                    <p className="text-xl text-slate-400">
                        Choose the plan that fits your capital. No hidden performance fees, just a flat monthly subscription for automated duplication.
                    </p>
                </div>

                <PricingGrid
                    proTotal={settings.pro_seats_total}
                    proRemaining={settings.pro_seats_remaining}
                    eliteTotal={settings.elite_seats_total}
                    eliteRemaining={settings.elite_seats_remaining}
                    whatsappNumber={settings.whatsapp_number}
                />

                {/* FAQ Section */}
                <div className="mt-32 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Do I need to give you my API keys?", a: "No. We use Bybit's official Copy Trading feature. You retain full custody of your funds at all times." },
                            { q: "Can I cancel anytime?", a: "Yes. You can stop copying at any moment directly from your Bybit dashboard. Subscriptions are prepaid for the selected period." },
                            { q: "What is the minimum capital required?", a: "We recommend at least $3,000 to ensure proper position sizing and risk management." },
                            { q: "Are there performance fees?", a: "No. We charge a flat subscription fee. You keep 100% of the profits generated in your account." }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                <p className="text-slate-400 text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
