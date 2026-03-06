import { checkAuth } from "../actions";
import { redirect } from "next/navigation";
import { getAdmins } from "@/lib/data/admins";
import { AdminsManager } from "./_components/AdminsManager";
import { ShieldCheck } from "lucide-react";

export default async function AdminManagementPage() {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    const admins = await getAdmins();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                    System Administrators
                </h1>
                <p className="text-slate-400 mt-2">Manage which email and password combinations can access the Admin Command Center.</p>
            </div>

            <AdminsManager initialAdmins={admins} />
        </div>
    );
}
