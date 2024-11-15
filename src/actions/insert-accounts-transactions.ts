"use server";

import { accounts, transactions } from "@/server/db/schema";
import { db } from "@/server/db";
import type { AccountBase, Transaction } from "plaid";
import { revalidatePath } from "next/cache";

export const insertAccountsTransactionsAction = async (
	accountData: AccountBase[],
	transactionsData: Transaction[],
	itemId: string,
) => {
	try {
		await db.insert(accounts).values(
			accountData.map((account) => ({
				plaidAccountId: account.account_id,
				plaidItemId: itemId,
				name: account.name,
				type: account.type,
				mask: account.mask || null,
				subtype: account.subtype || null,
				currentBalance: String(account.balances.current ?? 0),
				availableBalance: String(account.balances.available ?? 0),
				isoCurrencyCode: account.balances.iso_currency_code ?? "GBP",
				lastSynced: new Date(),
				metadata: account,
			})),
		);
		await db.insert(transactions).values(
			transactionsData.map((transaction) => {
				return {
					plaidAccountId: transaction.account_id,
					plaidTransactionId: transaction.transaction_id,
					amount: String(transaction.amount),
					date: new Date(transaction.date),
					description: transaction.original_description,
					name: transaction.name,
					merchantName: transaction.merchant_name,
					pending: transaction.pending ?? false,
					isoCurrencyCode: transaction.iso_currency_code ?? "GBP",
					category: transaction.personal_finance_category?.primary ?? "",
				};
			}),
		);

		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting accounts:", error);
	}
};
