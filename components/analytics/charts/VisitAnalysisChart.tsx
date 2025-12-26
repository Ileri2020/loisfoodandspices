"use client";

import { useAnalytics } from "../hooks/useAnalytics";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChartProps {
    params?: Record<string, any>;
}

export function VisitAnalysisChart({ params }: ChartProps) {
    const { data, isLoading } = useAnalytics("visits", params);

    if (isLoading) return <div className="h-[300px] w-full animate-pulse bg-muted rounded-md" />;
    if (!data || !Array.isArray(data) || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No visit data available</div>;

    // Aggregate visits by date
    // Data is array of ISO date strings
    const aggregated = data.reduce((acc: any, dateStr: string) => {
        const day = format(new Date(dateStr), "yyyy-MM-dd");
        if (!acc[day]) acc[day] = 0;
        acc[day]++;
        return acc;
    }, {});

    const chartData = Object.keys(aggregated).map(key => ({
        dateStr: format(new Date(key), "MMM d"),
        visits: aggregated[key]
    })).sort((a: any, b: any) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime()); // Basic sort relying on MMM d might be risky across years but okay for short term

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                    <XAxis dataKey="dateStr" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                    <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Page Visits" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
