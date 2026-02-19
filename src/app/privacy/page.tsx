import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="prose prose-invert max-w-none space-y-8 text-slate-400">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Information We Collect</h2>
                        <p>
                            We respect your privacy. Connect Algo collects minimal personal information, primarily to facilitate communication and service delivery.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>**Contact Information:** Name, email, or WhatsApp number when you contact us directly.</li>
                            <li>**Usage Data:** Anonymous analytics data regarding website visits and interaction (via standard web analytics tools).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. How We Use Your Information</h2>
                        <p>
                            We use the collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>To provide customer support and answer inquiries.</li>
                            <li>To send updates regarding our strategies or service changes.</li>
                            <li>To analyze website performance and improve user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. Financial Data</h2>
                        <p>
                            **We do not collect or store your financial data, wallet private keys, or exchange login credentials.**
                            All financial transactions and copy trading connections are handled securely by Bybit. We do not have access to your funds.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. Data Sharing</h2>
                        <p>
                            We do not sell, trade, or rent your personal identification information to others.
                            We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">5. Third-Party Websites</h2>
                        <p>
                            Users may find content on our Site that links to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties (e.g., Bybit).
                            We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">6. Cookies</h2>
                        <p>
                            Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them.
                            You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via our official WhatsApp support channel.
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
