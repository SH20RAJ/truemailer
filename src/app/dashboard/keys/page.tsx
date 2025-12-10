import { Metadata } from "next";
import { KeysTable } from "@/components/dashboard/keys/keys-table";
import { CreateKeyForm } from "@/components/dashboard/keys/create-key-form";
import { ApiPlayground } from "@/components/dashboard/keys/api-playground";

export const metadata: Metadata = {
    title: "API Keys - TrueMailer",
    description: "Manage your API keys and authentication.",
};

export default function ApiKeysPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                <p className="text-muted-foreground mt-1">Manage api keys to access the TrueMailer API programmatically.</p>
            </div>

            <CreateKeyForm />

            <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Your Keys</h2>
                <KeysTable />
            </div>

            <div className="pt-8 border-t border-border">
                <ApiPlayground />
            </div>
        </div>
    );
}
