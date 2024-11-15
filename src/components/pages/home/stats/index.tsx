import type { GetStatsQuery } from "@/queries/get-stats";
import MonthlyIncome from "./monthly-income";
import MonthlySpend from "./monthly-spend";
import Runway from "./runway";

export default function Stats({ stats }: { stats: GetStatsQuery }) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
			<Runway />
			<MonthlySpend monthlySpend={stats?.monthlyOutflow ?? "0"} />
			<MonthlyIncome monthlyIncome={stats?.monthlyInflow ?? "0"} />
		</div>
	);
}
