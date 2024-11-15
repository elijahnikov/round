import { db } from "@/server/db";
import { unstable_cache } from "next/cache";

export type GetStatsQuery = Awaited<ReturnType<typeof getStatsQuery>>;
export const getStats = async () => {
	return unstable_cache(
		async () => {
			return getStatsQuery();
		},
		["stats"],
		{ tags: ["stats"] },
	)();
};

const getStatsQuery = async () => {
	const stats = await db.query.stats.findFirst();
	return stats;
};
