import { Metadata } from "next";
import { UsageCharts } from "@/components/dashboard/analytics/charts";

export const metadata: Metadata = {
    title: "Analytics - TrueMailer",
    description: "Detailed usage analytics and statistics.",
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">Monitor your API usage, performance, and error rates.</p>
            </div>

            <UsageCharts />
        </div>
    );
}
