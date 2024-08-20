'use client';
// import { chartData } from '@/app/data';
import React, { useEffect, useState } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useParams } from 'next/navigation';
import { getTasksByPriority } from '@/app/actions/task';
import { useAuth } from '@clerk/nextjs';
import { TrendingUp } from 'lucide-react';

const chartConfig = {
  priority: {
    label: "Priority",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const PrioritiesChart = () => {
  const params = useParams();
  const { userId } = useAuth();
  const projectId = params?.pid;
  const [chartData, setChartData] = useState<any>();
  useEffect(() => {
    tasksByPriority();
  }, [setChartData]);
  const tasksByPriority = async () => {
    const data = await getTasksByPriority(projectId as string, userId!);
    setChartData(data);
    // console.log(data);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Priority</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="priority"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-priority)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total tasks for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default PrioritiesChart;