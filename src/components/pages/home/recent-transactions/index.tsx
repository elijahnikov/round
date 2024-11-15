import type { GetRecentTransactionsQuery } from "@/queries/get-recent-transactions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function RecentTransactions({
	transactions,
}: {
	transactions: GetRecentTransactionsQuery;
}) {
	return (
		<div className="mt-4 border rounded-md bg-stone-100 p-4">
			<p className="text-md mb-2 text-stone-500 font-medium">
				Recent Transactions
			</p>
			{transactions.length > 0 ? (
				<DataTable columns={columns} data={transactions} />
			) : (
				<p className="text-sm text-stone-500">No transactions found</p>
			)}
		</div>
	);
}
