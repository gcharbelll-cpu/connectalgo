"use client";

import { Strategy } from "@/lib/data/strategies";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateStrategy, addStrategy, uploadStrategyRecord } from "../actions";
import { importTradesFromExcel } from "../importTrades";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Plus, Trash2, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StrategyFormProps {
    strategy: Strategy;
    isNew?: boolean;
}

const defaultAdvancedMetrics = {
    totalTrades: 0, winRate: 0, profitFactor: 0, sharpeRatio: 0,
    sortinoRatio: 0, maxDrawdown: 0, avgTrade: 0, bestTrade: 0,
    worstTrade: 0, recoveryFactor: 0
};

export function StrategyForm({ strategy, isNew = false }: StrategyFormProps) {
    const [formData, setFormData] = useState<Strategy>(strategy);
    const [loading, setLoading] = useState(false);
    const [uploadingRecord, setUploadingRecord] = useState(false);
    const [importingTrades, setImportingTrades] = useState(false);
    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingRecord(true);
        try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const result = await uploadStrategyRecord(uploadData);
            if (result.success && result.url) {
                setFormData(prev => ({ ...prev, provenRecordUrl: result.url }));
                alert("File uploaded successfully. Don't forget to push 'Save Changes'!");
            } else {
                alert(result.error || "Failed to upload file.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setUploadingRecord(false);
        }
    };

    const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportingTrades(true);
        try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const result = await importTradesFromExcel(formData.id, uploadData);
            if (result.success) {
                // Update form with parsed data
                setFormData(prev => ({
                    ...prev,
                    roi: result.roi ?? prev.roi,
                    advancedMetrics: result.metrics ?? prev.advancedMetrics
                }));
                alert(`Successfully imported ${result.tradesImported} trades! ROI: ${result.roi}%. Don't forget to Save Changes.`);
            } else {
                alert(result.error || "Failed to import trades.");
            }
        } catch (error) {
            console.error("Import error:", error);
            alert("An error occurred during import.");
        } finally {
            setImportingTrades(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Handle number inputs
        if (['roi', 'drawdown', 'winRate', 'price', 'priceSixMonth', 'priceYearly', 'rating', 'subscribers', 'maxSubscribers'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isNew) {
                await addStrategy(formData);
                alert("Strategy created successfully!");
                router.push("/admin");
            } else {
                await updateStrategy(formData);
                alert("Strategy updated successfully!");
                router.refresh();
            }
        } catch (error) {
            alert(isNew ? "Failed to create strategy" : "Failed to update strategy");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin" className="text-slate-400 hover:text-white flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Strategy ID {isNew ? "(Auto-generates if blank)" : "(Read-only)"}</label>
                            <Input
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                disabled={!isNew}
                                className={`bg-slate-900 border-slate-800 ${!isNew ? "text-slate-500" : "text-white"}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Name</label>
                            <Input name="name" value={formData.name} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Asset Class</label>
                            <Select
                                value={formData.assetClass || "Crypto"}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, assetClass: value as any }))}
                            >
                                <SelectTrigger className="bg-slate-950 border-slate-800">
                                    <SelectValue placeholder="Select asset class" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    <SelectItem value="Crypto">Crypto</SelectItem>
                                    <SelectItem value="Forex">Forex</SelectItem>
                                    <SelectItem value="Indices">Indices</SelectItem>
                                    <SelectItem value="Commodities">Commodities</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Asset Subtype</label>
                            <Input name="assetSubtype" value={formData.assetSubtype || ""} onChange={handleChange} placeholder="e.g. BTC, ETH, EUR/USD" className="bg-slate-950 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Description</label>
                            <Textarea name="description" value={formData.description} onChange={handleChange} className="bg-slate-950 border-slate-800 min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Tags (comma separated)</label>
                            <Input
                                name="tags"
                                value={formData.tags.join(", ")}
                                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Verified Record File / URL</label>
                            <div className="flex gap-2">
                                <Input
                                    name="provenRecordUrl"
                                    value={formData.provenRecordUrl || ""}
                                    onChange={handleChange}
                                    placeholder="https://www.tradingview.com/... or upload a file"
                                    className="bg-slate-950 border-slate-800 flex-1"
                                />
                                <div>
                                    <input
                                        type="file"
                                        id={`record-upload-${isNew ? 'new' : strategy.id}`}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".pdf,image/*,.csv,.xlsx,.xls,.txt,.doc,.docx"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                                        onClick={() => document.getElementById(`record-upload-${isNew ? 'new' : strategy.id}`)?.click()}
                                        disabled={uploadingRecord}
                                    >
                                        {uploadingRecord ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload File"}
                                    </Button>
                                </div>
                            </div>
                            {formData.provenRecordUrl && formData.provenRecordUrl.includes('supabase.co') && (
                                <p className="text-xs text-emerald-400 mt-1">
                                    Current file: <a href={formData.provenRecordUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-300">View Active File</a>
                                </p>
                            )}
                            {!isNew && (
                                <div className="mt-3 pt-3 border-t border-slate-800">
                                    <label className="text-sm text-slate-400 block mb-2">Import Trades from Excel (.xlsx)</label>
                                    <input
                                        type="file"
                                        id={`excel-import-${strategy.id}`}
                                        className="hidden"
                                        onChange={handleExcelImport}
                                        accept=".xlsx,.xls"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-emerald-700/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                                        onClick={() => document.getElementById(`excel-import-${strategy.id}`)?.click()}
                                        disabled={importingTrades}
                                    >
                                        {importingTrades ? (
                                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Importing...</>
                                        ) : (
                                            <><FileSpreadsheet className="h-4 w-4 mr-2" /> Import Trades from Excel</>
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-slate-600 mt-1">Parses Performance, Trades Analysis, and List of Trades sheets. Updates ROI, metrics, and all trades.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">ROI (%)</label>
                                <Input type="number" step="0.1" name="roi" value={formData.roi} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Drawdown (%)</label>
                                <Input type="number" step="0.1" name="drawdown" value={formData.drawdown} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Win Rate (%)</label>
                                <Input type="number" step="0.1" name="winRate" value={formData.winRate} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Risk Reward</label>
                                <Input name="riskReward" value={formData.riskReward} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Subscribers (Investors)</label>
                                <Input type="number" name="subscribers" value={formData.subscribers} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Max Subscribers (Limit)</label>
                                <Input type="number" name="maxSubscribers" value={formData.maxSubscribers || ""} onChange={handleChange} placeholder="Optional" className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Rating (0-5)</label>
                                <Input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Monthly Price ($)</label>
                            <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">6-Month Price ($)</label>
                            <Input type="number" step="0.01" name="priceSixMonth" value={formData.priceSixMonth} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Yearly Price ($)</label>
                            <Input type="number" step="0.01" name="priceYearly" value={formData.priceYearly} onChange={handleChange} className="bg-slate-950 border-slate-800" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Advanced Metrics (Verified Record)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-slate-500 -mt-2 mb-2">These values are displayed on the Verified Record page. Leave at 0 if not applicable.</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Total Trades</label>
                                <Input type="number" value={formData.advancedMetrics?.totalTrades ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, totalTrades: parseInt(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Win Rate (%)</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.winRate ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, winRate: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Profit Factor</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.profitFactor ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, profitFactor: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Sharpe Ratio</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.sharpeRatio ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, sharpeRatio: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Sortino Ratio</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.sortinoRatio ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, sortinoRatio: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Max Drawdown (%)</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.maxDrawdown ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, maxDrawdown: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Avg Trade (%)</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.avgTrade ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, avgTrade: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Best Trade (%)</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.bestTrade ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, bestTrade: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Worst Trade (%)</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.worstTrade ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, worstTrade: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Recovery Factor</label>
                                <Input type="number" step="0.01" value={formData.advancedMetrics?.recoveryFactor ?? 0} onChange={(e) => setFormData(prev => ({ ...prev, advancedMetrics: { ...defaultAdvancedMetrics, ...prev.advancedMetrics, recoveryFactor: parseFloat(e.target.value) || 0 } }))} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Trading History</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                history: [...prev.history, { date: new Date().toISOString().slice(0, 7), profit: 0 }]
                            }))}
                            className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Month
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.history.map((entry, index) => (
                                <div key={index} className="flex gap-2 items-end bg-slate-950 p-3 rounded border border-slate-800">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-slate-500">Date (YYYY-MM)</label>
                                        <Input
                                            value={entry.date}
                                            onChange={(e) => {
                                                const newHistory = [...formData.history];
                                                newHistory[index].date = e.target.value;
                                                setFormData(prev => ({ ...prev, history: newHistory }));
                                            }}
                                            className="bg-slate-900 border-slate-700 h-8 text-sm"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-slate-500">Profit (%)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={entry.profit}
                                            onChange={(e) => {
                                                const newHistory = [...formData.history];
                                                newHistory[index].profit = parseFloat(e.target.value) || 0;
                                                setFormData(prev => ({ ...prev, history: newHistory }));
                                            }}
                                            className={`bg-slate-900 border-slate-700 h-8 text-sm ${entry.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const newHistory = formData.history.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, history: newHistory }));
                                        }}
                                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form >
    );
}
