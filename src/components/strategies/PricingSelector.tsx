"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Strategy } from "@/lib/data/strategies";
import Link from "next/link";

interface PricingSelectorProps {
    strategy: Strategy;
}

export function PricingSelector({ strategy }: PricingSelectorProps) {
    return (
        <CardContent className="p-6">
            <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 group" asChild>
                <Link href={`/strategies/${strategy.id}/record`}>
                    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500 group-hover:text-emerald-400" /> View Verified Record
                </Link>
            </Button>
        </CardContent>
    );
}
