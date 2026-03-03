"use client";

import { useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { updateUserProfile, deleteUserAccount } from "../adminActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function UsersTableBody({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Simple handler to save changes instantly from the UI controls
    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        // Optimistic UI update
        setUsers(users.map(u => u.id === userId ? { ...u, subscription_status: newStatus } : u));

        // Background save
        const result = await updateUserProfile(userId, { subscription_status: newStatus });
        if (!result.success) {
            alert(`Failed to update status: ${result.error}`);
            setUsers(initialUsers); // Revert on failure
        }
    };

    const changeUserTier = async (userId: string, newTier: string) => {
        setUsers(users.map(u => u.id === userId ? { ...u, plan_tier: newTier } : u));
        const result = await updateUserProfile(userId, { plan_tier: newTier });
        if (!result.success) {
            alert(`Failed to update plan tier: ${result.error}`);
            setUsers(initialUsers); // Revert on failure
        }
    };

    const toggleBybitLink = async (userId: string, currentStatus: boolean) => {
        setUsers(users.map(u => u.id === userId ? { ...u, bybit_link_sent: !currentStatus } : u));
        const result = await updateUserProfile(userId, { bybit_link_sent: !currentStatus });
        if (!result.success) {
            alert(`Failed to update Bybit status: ${result.error}`);
            setUsers(initialUsers); // Revert on failure
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;

        // Optimistic UI update: Remove user from table immediately
        setUsers(users.filter(u => u.id !== userId));

        // Background delete
        const result = await deleteUserAccount(userId);
        if (!result.success) {
            alert(`Failed to delete user: ${result.error}`);
            // Revert changes if delete failed
            setUsers(initialUsers);
        }
    };

    return (
        <TableBody>
            {users.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        No users have signed up yet.
                    </TableCell>
                </TableRow>
            ) : (
                users.map((user) => (
                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell>
                            <div className="font-medium text-slate-300">{user.email}</div>
                            {user.phone_number && <div className="text-xs text-slate-500 mt-1">{user.phone_number}</div>}
                        </TableCell>
                        <TableCell className="text-slate-400">
                            {new Date(user.join_date).toLocaleDateString()}
                        </TableCell>

                        {/* Status Toggle */}
                        <TableCell>
                            <button
                                onClick={() => toggleUserStatus(user.id, user.subscription_status)}
                                className="focus:outline-none transition-transform hover:scale-105"
                            >
                                <Badge className={`cursor-pointer ${user.subscription_status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
                                    {user.subscription_status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </button>
                        </TableCell>

                        {/* Tier Selector */}
                        <TableCell>
                            <Select
                                defaultValue={user.plan_tier}
                                onValueChange={(val) => changeUserTier(user.id, val)}
                            >
                                <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-900 border-slate-700 text-slate-300">
                                    <SelectValue placeholder="Select Tier" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                    <SelectItem value="elite">Elite</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>

                        {/* Bybit Link Toggle */}
                        <TableCell className="text-center">
                            <div className="flex justify-center items-center">
                                <Switch
                                    checked={user.bybit_link_sent}
                                    onCheckedChange={() => toggleBybitLink(user.id, user.bybit_link_sent)}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </TableCell>

                        {/* View Details Action */}
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => {
                                    alert(`Extracted Info:\n\nBybit UID: ${user.bybit_uid || 'None'}\nMT Account: ${user.mt_account_number || 'None'}\nContact: ${user.contact_handle || 'None'}`);
                                }}>
                                    View Info
                                </Button>
                                <Button variant="outline" size="icon" className="h-9 w-9 border-red-900/50 text-red-500 hover:bg-red-950/50 hover:text-red-400" onClick={() => handleDeleteUser(user.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    );
}
