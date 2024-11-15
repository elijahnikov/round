"use server";

import { db } from "@/server/db";
import { stats } from "@/server/db/schema";
import type { Transaction } from "plaid";

export const calculateStats = async (transactions: Transaction[]) => {
	const completedTransactions = transactions.filter((t) => !t.pending);

	const sortedTransactions = [...completedTransactions].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	// Get the date range
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const latestDate = new Date(sortedTransactions[0]!.date);
	const earliestDate = new Date(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		sortedTransactions[sortedTransactions.length - 1]!.date,
	);
	const monthsDifference =
		(latestDate.getTime() - earliestDate.getTime()) /
		(1000 * 60 * 60 * 24 * 30.44);

	const currentBalance = -sortedTransactions.reduce(
		(sum, t) => sum + t.amount,
		0,
	);

	const income = sortedTransactions
		.filter(
			(t) =>
				t.amount < 0 || t.personal_finance_category?.primary === "TRANSFER_IN",
		)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	const expenses = sortedTransactions
		.filter(
			(t) =>
				t.amount > 0 && t.personal_finance_category?.primary !== "TRANSFER_OUT",
		)
		.reduce((sum, t) => sum + t.amount, 0);

	const monthlyIncome = income / monthsDifference;
	const monthlySpend = expenses / monthsDifference;

	const runwayDays =
		monthlySpend === 0
			? Number.POSITIVE_INFINITY
			: currentBalance / (monthlySpend / 30.44);

	await db.insert(stats).values({
		monthlyInflow: String(monthlyIncome),
		monthlyOutflow: String(monthlySpend),
		runway: String(runwayDays),
		calculatedAt: new Date(),
	});

	return {
		runwayDays: Math.floor(runwayDays),
		monthlyIncome: Math.round(monthlyIncome),
		monthlySpend: Math.round(monthlySpend),
		currentBalance: Math.round(currentBalance),
	};
};
