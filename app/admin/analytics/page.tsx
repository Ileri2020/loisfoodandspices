"use client";

import { KpiSection } from "@/components/analytics/KpiSection";
import { ChartCard } from "@/components/analytics/cards/ChartCard";
import { RevenueChart } from "@/components/analytics/charts/RevenueChart";
import { CartStatusChart } from "@/components/analytics/charts/CartStatusChart";
import { TopProductsChart } from "@/components/analytics/charts/TopProductsChart";
import { ProfitChart } from "@/components/analytics/charts/ProfitChart";
import { VisitAnalysisChart } from "@/components/analytics/charts/VisitAnalysisChart";
import { RefundReasonChart } from "@/components/analytics/charts/RefundReasonChart";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function AnalyticsDashboard() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const queryParams = {
        from: date?.from?.toISOString(),
        to: date?.to?.toISOString()
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between space-x-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal w-[240px]">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <KpiSection params={queryParams} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartCard title="Revenue Over Time" className="col-span-4">
                    <RevenueChart params={queryParams} />
                </ChartCard>
                <ChartCard title="Cart Status Distribution" className="col-span-3">
                    <CartStatusChart params={queryParams} />
                </ChartCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartCard title="Profit & Revenue Analysis" className="col-span-4">
                    <ProfitChart params={queryParams} />
                </ChartCard>
                <ChartCard title="Top Selling Products" className="col-span-3">
                    <TopProductsChart params={queryParams} />
                </ChartCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartCard title="Page Visit Analysis" className="col-span-4">
                    <VisitAnalysisChart params={queryParams} />
                </ChartCard>
                <ChartCard title="Refund Reasons (Mock)" className="col-span-3">
                    <RefundReasonChart params={queryParams} />
                </ChartCard>
            </div>
        </div>
    );
}
