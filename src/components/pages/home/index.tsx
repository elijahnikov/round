import { getAccounts } from "@/queries/get-accounts";
import HomeHeader from "./header";
import Accounts from "./accounts";
import { getRecentTransactions } from "@/queries/get-recent-transactions";
import RecentTransactions from "./recent-transactions";
import Stats from "./stats";
import { getStats } from "@/queries/get-stats";

export default async function HomePageView() {
	const [accounts, recentTransactions, stats] = await Promise.all([
		getAccounts(),
		getRecentTransactions(),
		getStats(),
	]);

	if (!accounts || accounts.length === 0) {
		return (
			<main className="flex flex-col w-full text-black px-8">
				<HomeHeader />
				<div className="w-full flex mt-16 flex-col justify-center items-center h-32">
					<h1 className="text-2xl font-semibold">No accounts found</h1>
					<p className="text-sm text-stone-500">
						Please add an account to get started
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="flex flex-col w-full text-black px-8">
			<HomeHeader />
			<Accounts accounts={accounts} />
			{accounts && accounts.length > 0 && (
				<>
					<Stats stats={stats} />
					<RecentTransactions transactions={recentTransactions} />
				</>
			)}
		</main>
	);
}
