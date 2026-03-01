"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-400 mt-2">Manage your account details and notification preferences.</p>
            </div>

            <div className="max-w-2xl space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-200">Personal Information</CardTitle>
                        <CardDescription className="text-slate-400">Update your basic profile details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                defaultValue="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                defaultValue="john.doe@example.com"
                                disabled
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500">Contact support to change your primary email.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800/50 pt-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
                    </CardFooter>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-200">Security</CardTitle>
                        <CardDescription className="text-slate-400">Update your password to secure your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="current_password">Current Password</label>
                            <input
                                id="current_password"
                                type="password"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="new_password">New Password</label>
                            <input
                                id="new_password"
                                type="password"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800/50 pt-4">
                        <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">Update Password</Button>
                    </CardFooter>
                </Card>

                {/* Broker Identification Card */}
                <Card className="bg-slate-900 border-slate-800">
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
                                type="text"
                                placeholder="e.g. 12345678"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="mt_account">MT4 / MT5 Account Number (For EA Files)</label>
                            <input
                                id="mt_account"
                                type="text"
                                placeholder="e.g. 87654321"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800/50 pt-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Broker Info</Button>
                    </CardFooter>
                </Card>

                {/* Support Contact Info Card */}
                <Card className="bg-slate-900 border-slate-800">
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
                                type="text"
                                placeholder="e.g. @username or +1234567890"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800/50 pt-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Contact Info</Button>
                    </CardFooter>
                </Card>

                {/* Danger Zone Card */}
                <Card className="bg-red-950/10 border-red-900/50 mt-12">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
                        <CardDescription className="text-slate-400">
                            Permanently delete your account and remove all associated data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
