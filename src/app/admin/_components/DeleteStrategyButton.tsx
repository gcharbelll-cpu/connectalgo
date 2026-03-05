"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteStrategy } from "../actions";
import { useRouter } from "next/navigation";

export function DeleteStrategyButton({ strategyId, strategyName }: { strategyId: string, strategyName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you absolutely sure you want to delete the strategy "${strategyName}"? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteStrategy(strategyId);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Failed to delete strategy.");
            }
        } catch (error) {
            alert("An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/50"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Strategy"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}
