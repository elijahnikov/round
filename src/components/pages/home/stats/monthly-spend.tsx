"use client";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
	amount: {
		label: "Amount",
		color: "#60a5fa",
	},
} satisfies ChartConfig;

const chartData = [
	{ month: "January", amount: 186 },
	{ month: "February", amount: 305 },
	{ month: "March", amount: 237 },
	{ month: "April", amount: 73 },
	{ month: "May", amount: 209 },
	{ month: "June", amount: 214 },
];

export default function MonthlySpend({
	monthlySpend,
}: { monthlySpend: string }) {
	return (
		<div className="bg-stone-100 border rounded-md p-4">
			<p className="text-sm font-medium text-stone-600">Monthly Spend</p>
			<p className="text-lg text-black font-medium">
				{Number(monthlySpend).toLocaleString(undefined, {
					style: "currency",
					currency: "GBP",
				})}
			</p>
			<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
				<BarChart accessibilityLayer data={chartData}>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />

					<Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
				</BarChart>
			</ChartContainer>
		</div>
	);
}
