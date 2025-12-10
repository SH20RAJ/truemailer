import { Metadata } from "next";
import { ListsManager } from "@/components/dashboard/lists/lists-manager";

export const metadata: Metadata = {
    title: "Personal Lists - TrueMailer",
    description: "Manage your personal blocklists and allowlists.",
};

export default function PersonalListsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Personal Lists</h1>
                <p className="text-muted-foreground mt-1">Customize validation rules by adding specific emails or domains to your lists.</p>
            </div>

            <ListsManager />
        </div>
    );
}
