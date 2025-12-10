import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - TrueMailer",
    description: "View your usage statistics and manage your account.",
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder cards */}
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Validations</h3>
                    <div className="text-2xl font-bold">0</div>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Credits Used</h3>
                    <div className="text-2xl font-bold">0 / 5000</div>
                </div>
            </div>
        </div>
    );
}
