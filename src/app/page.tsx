import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StrategyShowcase } from "@/components/sections/StrategyShowcase";
import { getStrategies } from "@/lib/data/strategies";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Ticker } from "@/components/ui/Ticker";
import { FAQ } from "@/components/sections/FAQ";
import { Testimonials } from "@/components/sections/Testimonials";

export default async function Home() {
  const strategies = await getStrategies();
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Ticker />
      <Navbar />

      <Hero />

      {/* Strategies Section */}
      <section id="strategies" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Available Strategies</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose a strategy that matches your risk appetite and investment goals.
              All strategies are monitored 24/7 by our algorithmic systems.
            </p>
          </div>

          <StrategyShowcase strategies={strategies} />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Institutional Grade. <span className="text-emerald-400">Zero Friction.</span>
            </h2>
            <p className="text-xl text-slate-400">
              We leverage Bybit's official Copy Trading infrastructure. Funds remain in your custody, no complex setup, just direct, secure replication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Strategy",
                desc: "Select a single strategy or the complete 'Ultimate' portfolio based on your risk tolerance and goals."
              },
              {
                step: "02",
                title: "Connect via Bybit",
                desc: "We provide access to our exclusive Master Trader account on Bybit. You simply click 'Copy' - funds remain in your custody."
              },
              {
                step: "03",
                title: "Automated Growth",
                desc: "Trades are replicated instantly and automatically in your own account. You maintain full control of your funds at all times."
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-bold text-slate-900 absolute -top-10 -left-6 z-0 group-hover:text-slate-800 transition-colors duration-300">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Pricing / Contact CTA */}
      <section id="contact" className="py-24 scroll-mt-16">
        <div id="pricing" className="absolute -top-24"></div>
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Automate Your Wealth?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Start copying our institutional strategies in minutes. No setup fees. Cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 text-lg" asChild>
                <a href="/pricing">
                  View Pricing & Plans
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white h-14 px-8 text-lg" asChild>
                <a href="/#strategies">
                  Explore Strategies
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
