"use server";

import { db } from "@/server/db";

export type GetAccountsReturnType = Awaited<ReturnType<typeof getAccounts>>;
export const getAccounts = async () => {
	return getAccountsQuery();
};

const getAccountsQuery = async () => {
	const accounts = await db.query.accounts.findMany();

	return accounts;
};
