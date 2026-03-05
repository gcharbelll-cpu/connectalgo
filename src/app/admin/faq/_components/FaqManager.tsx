"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, X, Save } from "lucide-react";
import { FAQ } from "@/lib/data/faq";
import { addFaq, updateFaq, deleteFaq } from "../actions";

export function FaqManager({ initialFaqs }: { initialFaqs: FAQ[] }) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (faq: FAQ) => {
        setEditingId(faq.id);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setQuestion("");
        setAnswer("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append("question", question);
        formData.append("answer", answer);

        try {
            if (editingId) {
                formData.append("id", editingId);
                const result = await updateFaq(formData);
                if (result.success) {
                    setFaqs(faqs.map(f => f.id === editingId ? { ...f, question, answer } : f));
                    handleCancel();
                } else {
                    alert("Failed to update FAQ");
                }
            } else if (isAdding) {
                const result = await addFaq(formData);
                if (result.success) {
                    // Quick UI update, hard refresh will fetch actual newest from server
                    window.location.reload();
                } else {
                    alert("Failed to add FAQ");
                }
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, q: string) => {
        if (!confirm(`Are you sure you want to delete the FAQ: "${q}"?`)) return;

        try {
            const result = await deleteFaq(id);
            if (result.success) {
                setFaqs(faqs.filter(f => f.id !== id));
            } else {
                alert("Failed to delete FAQ");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Active FAQs</h2>
                    <p className="text-sm text-slate-400">Manage the Frequently Asked Questions shown on the homepage.</p>
                </div>
                {!isAdding && !editingId && (
                    <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                        <Plus className="h-4 w-4 mr-2" /> Add FAQ
                    </Button>
                )}
            </div>

            {(isAdding || editingId) && (
                <Card className="bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-900/10">
                    <CardHeader>
                        <CardTitle className="text-lg text-emerald-400">
                            {isAdding ? "Add New FAQ" : "Edit FAQ"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Question</label>
                                <input
                                    required
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g. Is my capital safe?"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Answer</label>
                                <textarea
                                    required
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Detailed explanation..."
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 min-h-[100px] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save FAQ"}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                    <X className="h-4 w-4 mr-2" /> Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {faqs.map(faq => (
                    <Card key={faq.id} className={`bg-slate-950 border-slate-800 transition-colors ${editingId === faq.id ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'hover:border-slate-700'}`}>
                        <CardContent className="p-4 flex gap-4">
                            <div className="flex-1 space-y-1">
                                <h3 className="font-medium text-slate-200">{faq.question}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2">{faq.answer}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0 border-l border-slate-800/50 pl-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(faq)}
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                    title="Edit FAQ"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(faq.id, faq.question)}
                                    className="h-8 w-8 p-0 text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
                                    title="Delete FAQ"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {faqs.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-xl text-slate-500">
                        No FAQs found. Add one to display on the homepage.
                    </div>
                )}
            </div>
        </div>
    );
}
