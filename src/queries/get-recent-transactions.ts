import { db } from "@/server/db";
import { unstable_cache } from "next/cache";

export type GetRecentTransactionsQuery = Awaited<
	ReturnType<typeof getRecentTransactionsQuery>
>;

export const getRecentTransactions = async () => {
	return unstable_cache(
		async () => {
			return getRecentTransactionsQuery();
		},
		["get-recent-transactions"],
		{ tags: ["get-recent-transactions"] },
	)();
};

export const getRecentTransactionsQuery = async () => {
	const transactions = await db.query.transactions.findMany({
		orderBy: (transactions, { desc }) => [desc(transactions.date)],
		with: {
			account: {
				columns: {
					subtype: true,
					mask: true,
				},
			},
		},
	});
	return transactions;
};
