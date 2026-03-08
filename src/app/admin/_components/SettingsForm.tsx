"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/lib/data/settings";
import { Save, AlertCircle } from "lucide-react";

interface SettingsFormProps {
    initialSettings: SiteSettings;
    onSave: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
}

export function SettingsForm({ initialSettings, onSave }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>(initialSettings);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await onSave(settings);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Failed to save settings");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isStringField = name.startsWith('hero_') || name === 'whatsapp_number';
        setSettings(prev => ({
            ...prev,
            [name]: isStringField ? value : (parseInt(value) || 0)
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-xl text-white">Pricing Plan Seats</CardTitle>
                <CardDescription className="text-slate-400">
                    Control the scarcity numbers shown on the public pricing page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pro Tier Settings */}
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-4">
                        <h3 className="font-medium text-emerald-400">Pro Copy Trading Tier</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pro_seats_total" className="text-slate-300">Total Seats</Label>
                                <Input
                                    id="pro_seats_total"
                                    name="pro_seats_total"
                                    type="number"
                                    value={settings.pro_seats_total}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pro_seats_remaining" className="text-slate-300">Seats Remaining</Label>
                                <Input
                                    id="pro_seats_remaining"
                                    name="pro_seats_remaining"
                                    type="number"
                                    value={settings.pro_seats_remaining}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Elite Tier Settings */}
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-4">
                        <h3 className="font-medium text-amber-400">Elite Access Tier</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="elite_seats_total" className="text-slate-300">Total Seats</Label>
                                <Input
                                    id="elite_seats_total"
                                    name="elite_seats_total"
                                    type="number"
                                    value={settings.elite_seats_total}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="elite_seats_remaining" className="text-slate-300">Seats Remaining</Label>
                                <Input
                                    id="elite_seats_remaining"
                                    name="elite_seats_remaining"
                                    type="number"
                                    value={settings.elite_seats_remaining}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hero Section Settings */}
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-4">
                        <h3 className="font-medium text-cyan-400">Hero Section Stats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hero_total_return" className="text-slate-300">Total Return</Label>
                                <Input
                                    id="hero_total_return"
                                    name="hero_total_return"
                                    type="text"
                                    value={settings.hero_total_return}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_active_investors" className="text-slate-300">Active Investors</Label>
                                <Input
                                    id="hero_active_investors"
                                    name="hero_active_investors"
                                    type="text"
                                    value={settings.hero_active_investors}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_strategies" className="text-slate-300">Strategies</Label>
                                <Input
                                    id="hero_strategies"
                                    name="hero_strategies"
                                    type="text"
                                    value={settings.hero_strategies}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Setting */}
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-4">
                        <h3 className="font-medium text-emerald-500">
                            WhatsApp Contact
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_number" className="text-slate-300">WhatsApp Number (e.g. 96176374971)</Label>
                            <Input
                                id="whatsapp_number"
                                name="whatsapp_number"
                                type="text"
                                value={settings.whatsapp_number}
                                onChange={handleChange}
                                placeholder="Enter number without + or spaces"
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                            <p className="text-xs text-slate-500">
                                This number will be used for all "Contact Us" and "Support" links on the site.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-900/30 border border-red-900/50 flex items-start gap-3 text-sm text-red-400">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isLoading ? "Saving..." : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>

                    {success && <span className="ml-4 text-emerald-400 text-sm animate-pulse">Settings saved successfully!</span>}
                </form>
            </CardContent>
        </Card>
    );
}
