'use client';
import { getTasksByStage } from '@/app/actions/task';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    stage: {
        label: "Stage",
    },
    todo: {
        label: "todo",
        color: "hsl(var(--chart-1))",
    },
    inprogress: {
        label: "inprogress",
        color: "hsl(var(--chart-2))",
    },
    completed: {
        label: "completed",
        color: "hsl(var(--chart-3))",
    },
    review: {
        label: "review",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const StageChart = () => {
    const params = useParams();
    const { userId } = useAuth();
    const projectId = params?.pid;
    const [chartData, setChartData] = useState<any>();

    useEffect(() => {
        tasksByStage();
    }, [setChartData]);

    const tasksByStage = async () => {
        const data = await getTasksByStage(projectId as string, userId!);
        setChartData(data);
        // console.log(data);
    }
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Tasks by stage</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="stage" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="count">
                            {/* <LabelList
                                dataKey="count"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            /> */}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="stage" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center capitalize"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total tasks for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

export default StageChart
