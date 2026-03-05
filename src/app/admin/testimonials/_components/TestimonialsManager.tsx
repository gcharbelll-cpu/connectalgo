"use client";

import { useState } from "react";
import { Testimonial } from "@/lib/data/testimonials";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Star } from "lucide-react";

export function TestimonialsManager({ initialData }: { initialData: Testimonial[] }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Testimonial>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateNew = () => {
        setEditingId("NEW");
        setFormData({
            name: "",
            role: "",
            content: "",
            rating: 5,
        });
    };

    const handleEdit = (t: Testimonial) => {
        setEditingId(t.id);
        setFormData({ ...t });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        setIsLoading(true);
        await deleteTestimonial(id);
        setTestimonials(testimonials.filter((t) => t.id !== id));
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingId === "NEW") {
                const newT = { ...formData, id: "" } as Testimonial;
                await addTestimonial(newT);
                // In a perfect world we would fetch the raw object back to get the new ID, 
                // but doing a hard reload is easiest to sync state
                window.location.reload();
            } else {
                await updateTestimonial(editingId!, formData);
                setTestimonials(testimonials.map(t => t.id === editingId ? { ...t, ...formData } as Testimonial : t));
                setEditingId(null);
            }
        } catch (error) {
            alert("Failed to save changes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {editingId && (
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {editingId === "NEW" ? "Add New Review" : "Edit Review"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-300">Reviewer Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-950 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-slate-300">Role / Title</Label>
                                    <Input
                                        id="role"
                                        required
                                        value={formData.role || ""}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="bg-slate-950 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating" className="text-slate-300">Star Rating (1-5)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="1" max="5" required
                                    value={formData.rating || 5}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    className="bg-slate-950 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-slate-300">Review Content</Label>
                                <Textarea
                                    id="content"
                                    required
                                    rows={4}
                                    value={formData.content || ""}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="bg-slate-950 border-slate-700 text-white"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                                    {isLoading ? "Saving..." : "Save Review"}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel} className="border-slate-700 text-slate-300 hover:bg-slate-800 flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {!editingId && (
                <div className="flex justify-end">
                    <Button onClick={handleCreateNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Add New Review
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {testimonials.map((t) => (
                    <Card key={t.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                                        <p className="text-sm text-slate-400">{t.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-300 italic text-sm border-l-2 border-slate-700 pl-4 py-1">"{t.content}"</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(t)} className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(t.id)} className="border-red-900/50 text-red-400 hover:bg-red-950/50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {testimonials.length === 0 && (
                    <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        No reviews found. Click the button above to add one!
                    </div>
                )}
            </div>
        </div>
    );
}
