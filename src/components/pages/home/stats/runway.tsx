"use client";

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
	amount: {
		label: "Amount",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const chartData = [
	{ month: "January", amount: 18600 },
	{ month: "February", amount: 30500 },
	{ month: "March", amount: 23700 },
	{ month: "April", amount: 7300 },
	{ month: "May", amount: 20900 },
	{ month: "June", amount: 21400 },
];

export default function Runway() {
	return (
		<div className="bg-stone-100 border rounded-md p-4">
			<p className="text-sm font-medium text-stone-600">Runway</p>
			<p className="text-lg text-black font-medium">123 days</p>
			<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
				<AreaChart
					accessibilityLayer
					data={chartData}
					margin={{
						left: 12,
						right: 12,
					}}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="dot" hideLabel />}
					/>
					<Area
						dataKey="amount"
						type="linear"
						fill="var(--color-amount)"
						fillOpacity={0.4}
						stroke="var(--color-amount)"
					/>
				</AreaChart>
			</ChartContainer>
		</div>
	);
}
