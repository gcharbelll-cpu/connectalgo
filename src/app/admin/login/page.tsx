"use client";

import { useState } from "react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await login(formData);
        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.error || "Login failed");
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-emerald-500" />
                    </div>
                    <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                className="bg-slate-950 border-slate-800 text-white"
                                required
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
