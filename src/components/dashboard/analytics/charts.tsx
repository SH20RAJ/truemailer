"use client";

import useSWR from "swr";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { format, parseISO } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UsageData {
    dailyUsage: Array<{ date: string; requests: number }>;
    statusCodeDistribution: Array<{ statusCode: number; count: number }>;
}

export function UsageCharts() {
    const { data, isLoading } = useSWR<UsageData>("/api/usage?days=30", (url: string) => fetch(url).then((res) => res.json() as Promise<UsageData>));

    if (isLoading) return <div>Loading analytics...</div>;
    if (!data) return <div className="text-muted-foreground">No data available</div>;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-xl border bg-card shadow-sm h-[400px]">
                <h3 className="text-lg font-semibold mb-6">Request Volume (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyUsage}>
                        <defs>
                            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), "MMM d")}
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: "8px" }}
                            itemStyle={{ color: "var(--foreground)" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="requests"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorRequests)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="p-6 rounded-xl border bg-card shadow-sm h-[400px]">
                <h3 className="text-lg font-semibold mb-6">Status Code Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.statusCodeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="statusCode"
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)' }}
                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: "8px" }}
                            itemStyle={{ color: "var(--foreground)" }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
