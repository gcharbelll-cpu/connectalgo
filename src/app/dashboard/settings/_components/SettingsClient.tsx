"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { updateSettings, updatePassword, deleteAccount } from "../actions";
import { useRouter } from "next/navigation";

export default function SettingsDashboard({ profile }: { profile: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSettingsSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateSettings(formData);
            if (result.success) {
                setMessage({ text: "Settings saved successfully.", type: "success" });
                router.refresh();
            } else {
                setMessage({ text: result.error || "Failed to save settings.", type: "error" });
            }
            setTimeout(() => setMessage({ text: "", type: "" }), 5000);
        });
    };

    const handlePasswordSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updatePassword(formData);
            if (result.success) {
                setMessage({ text: "Password updated successfully.", type: "success" });
                const form = document.getElementById("passwordForm") as HTMLFormElement;
                if (form) form.reset();
            } else {
                setMessage({ text: result.error || "Failed to update password.", type: "error" });
            }
            setTimeout(() => setMessage({ text: "", type: "" }), 5000);
        });
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you ABSOLUTELY sure? This will instantly delete your account, your active subscription, and lock you out. This action CANNOT BE UNDONE.")) return;

        startTransition(async () => {
            const result = await deleteAccount();
            if (result.success) {
                // The server action signs the user out, so we push them to the home page
                router.push("/");
                router.refresh();
            } else {
                setMessage({ text: result.error || "Failed to delete account.", type: "error" });
            }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-400 mt-2">Manage your account details and notification preferences.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="max-w-2xl space-y-6">
                <form action={handleSettingsSubmit}>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-200">Personal Information</CardTitle>
                            <CardDescription className="text-slate-400">Update your basic profile details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="full_name">Full Name</label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    defaultValue={profile?.full_name || ""}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="phone_number">Phone Number</label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    defaultValue={profile?.phone_number || ""}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    defaultValue={profile?.email || ""}
                                    disabled
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500">Contact support to change your primary email.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Broker Identification Card */}
                    <Card className="bg-slate-900 border-slate-800 mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-200">Broker Identification</CardTitle>
                            <CardDescription className="text-slate-400">
                                Save your broker details here to expedite the manual verification and file delivery process.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="bybit_uid">Bybit UID (For Copy Trading)</label>
                                <input
                                    id="bybit_uid"
                                    name="bybit_uid"
                                    type="text"
                                    defaultValue={profile?.bybit_uid || ""}
                                    placeholder="e.g. 12345678"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="mt_account">MT4 / MT5 Account Number (For EA Files)</label>
                                <input
                                    id="mt_account"
                                    name="mt_account"
                                    type="text"
                                    defaultValue={profile?.mt_account || ""}
                                    placeholder="e.g. 87654321"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Contact Info Card */}
                    <Card className="bg-slate-900 border-slate-800 mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-200">Support Contact Handle</CardTitle>
                            <CardDescription className="text-slate-400">
                                Provide your Telegram or WhatsApp handle so our team can easily identify your messages.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="contact_handle">Telegram Username / WhatsApp Number</label>
                                <input
                                    id="contact_handle"
                                    name="contact_handle"
                                    type="text"
                                    defaultValue={profile?.contact_handle || ""}
                                    placeholder="e.g. @username or +1234567890"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-800/50 pt-4">
                            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isPending ? "Saving..." : "Save All Details"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                <form id="passwordForm" action={handlePasswordSubmit}>
                    <Card className="bg-slate-900 border-slate-800 mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-200">Security</CardTitle>
                            <CardDescription className="text-slate-400">Update your password to secure your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="new_password">New Password</label>
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-800/50 pt-4">
                            <Button type="submit" disabled={isPending} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                {/* Danger Zone Card */}
                <Card className="bg-red-950/10 border-red-900/50 mt-12">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
                        <CardDescription className="text-slate-400">
                            Permanently delete your account and remove all associated data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isPending}
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isPending ? "Deleting..." : "Delete Account"}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
