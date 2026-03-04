import { checkAuth, logout } from "../actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, LogOut } from "lucide-react";
import { getAllUsers } from "@/utils/supabase/queries";
import UsersTableBody from "./_components/UsersTableBody";

export default async function AdminUsersPage() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    // Fetch real users from Supabase
    const users = await getAllUsers();

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" asChild>
                                <Link href="/admin">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                User Management
                            </h1>
                        </div>
                        <p className="text-slate-400">View and manually activate subscriptions after payment verification.</p>
                    </div>
                    <form action={logout}>
                        <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950/50">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </form>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Registered Users</CardTitle>
                        <CardDescription className="text-slate-400">
                            Change a user's status to Active to unlock their dashboard wall.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="rounded-md border border-slate-800 overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader className="bg-slate-950">
                                    <TableRow className="border-slate-800 hover:bg-slate-950">
                                        <TableHead className="text-slate-400">User Email</TableHead>
                                        <TableHead className="text-slate-400">Joined</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400">Plan Tier</TableHead>
                                        <TableHead className="text-slate-400">Expires On</TableHead>
                                        <TableHead className="text-slate-400 text-center">Bybit Link Sent</TableHead>
                                        <TableHead className="text-right text-slate-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <UsersTableBody initialUsers={users} />
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
