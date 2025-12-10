"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardDocsPage() {
    const { data, isLoading } = useSWR("/api/keys", fetcher);
    // Use the first active key if available
    const apiKey = data?.keys?.[0]?.secretKey || "";

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] rounded-xl overflow-hidden border border-border bg-card">
            <ApiReferenceReact
                configuration={{
                    spec: {
                        url: "/api/docs/json",
                    },
                    authentication: {
                        preferredSecurityScheme: "BearerAuth",
                        security: {
                            BearerAuth: {
                                token: apiKey,
                            },
                        },
                    },
                    theme: "purple",
                    darkMode: true,
                    hideDownloadButton: true,
                    hideTestRequestButton: false,
                }}
            />
        </div>
    );
}
