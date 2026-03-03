import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin relative z-10" />
            </div>
            <p className="text-slate-400 text-sm animate-pulse">Fetching admin data...</p>
        </div>
    );
}
