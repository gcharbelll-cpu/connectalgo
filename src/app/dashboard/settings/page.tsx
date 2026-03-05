import { getUserProfile } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import SettingsClient from "./_components/SettingsClient";

export default async function SettingsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/sign-in");
    }

    return <SettingsClient profile={profile} />;
}
