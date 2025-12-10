import { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Documentation - TrueMailer",
    description: "Interactive API documentation for TrueMailer.",
};

export default function DocsPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
            </div>

            <div className="border border-border rounded-lg overflow-hidden h-full shadow-sm bg-background">
                <iframe
                    src="/api/docs"
                    className="w-full h-full"
                    title="API Documentation"
                />
            </div>
        </div>
    );
}
