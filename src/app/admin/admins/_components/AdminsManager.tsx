"use client";

import { useState, useTransition, useRef } from "react";
import { Admin } from "@/lib/data/admins";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Trash2, Edit2, KeyRound } from "lucide-react";
import { addAdminAction, deleteAdminAction, updateAdminAction } from "../actions";

export function AdminsManager({ initialAdmins }: { initialAdmins: Admin[] }) {
    const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>("");

    const formRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    async function handleAdd(formData: FormData) {
        setError("");
        const result = await addAdminAction(formData);

        if (result.success) {
            formRef.current?.reset();
            // Optimistic update would go here if we wanted it
            window.location.reload();
        } else {
            setError(result.error || "Failed to add admin");
        }
    }

    async function handleUpdate(formData: FormData) {
        setError("");
        const result = await updateAdminAction(formData);

        if (result.success) {
            setEditingId(null);
            window.location.reload();
        } else {
            setError(result.error || "Failed to edit admin");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to revoke admin access for this email?")) return;

        setError("");
        const result = await deleteAdminAction(id);

        if (result.success) {
            setAdmins(admins.filter(a => a.id !== id));
        } else {
            setError(result.error || "Failed to delete admin");
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* List Existing Admins */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Authorized Accounts</h2>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm mb-4">{error}</div>}

                {admins.map((admin) => (
                    <Card key={admin.id} className="bg-slate-900 border-slate-800">
                        {editingId === admin.id ? (
                            <CardContent className="p-6">
                                <form ref={editFormRef} action={e => { startTransition(() => handleUpdate(e)) }} className="space-y-4">
                                    <input type="hidden" name="id" value={admin.id} />
                                    <div className="space-y-2">
                                        <Label htmlFor={`email-${admin.id}`}>Email</Label>
                                        <Input
                                            id={`email-${admin.id}`}
                                            name="email"
                                            defaultValue={admin.email}
                                            className="bg-slate-950 border-slate-800 text-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`password-${admin.id}`}>New Password (leave blank to keep current)</Label>
                                        <Input
                                            id={`password-${admin.id}`}
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-slate-950 border-slate-800 text-white"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => setEditingId(null)} disabled={isPending}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                                            {isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        ) : (
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-800 p-2 rounded-full">
                                        <ShieldAlert className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <span className="text-white font-medium">{admin.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="hover:text-amber-500" onClick={() => setEditingId(admin.id)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="hover:text-red-500" onClick={() => { startTransition(() => handleDelete(admin.id)) }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {/* Add New Admin Form */}
            <div>
                <Card className="bg-slate-900 border-slate-800 sticky top-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-emerald-500" />
                            Add Master Account
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Create a new email/password combination that grants access to this entire command center.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} action={e => { startTransition(() => handleAdd(e)) }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-email">Email Address</Label>
                                <Input
                                    id="new-email"
                                    name="email"
                                    type="email"
                                    required
                                    className="bg-slate-950 border-slate-800 text-white"
                                    placeholder="partner@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Password</Label>
                                <Input
                                    id="new-password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-slate-950 border-slate-800 text-white"
                                    placeholder="Enter secure password"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
                                {isPending ? "Authorizing..." : "Grant Admin Access"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
