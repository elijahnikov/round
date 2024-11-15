"use server";

import { z } from "zod";
import { actionClient } from ".";
import { plaidClient } from "@/lib/plaid";

const exchangePublicTokenSchema = z.object({
	publicToken: z.string(),
});

export const exchangePublicTokenAction = actionClient
	.schema(exchangePublicTokenSchema)
	.action(async ({ parsedInput, ctx }) => {
		const response = await plaidClient.itemPublicTokenExchange({
			public_token: parsedInput.publicToken,
		});

		const accessToken = response.data.access_token;
		const itemId = response.data.item_id;

		const accountsResponse = await plaidClient.accountsGet({
			access_token: accessToken,
		});

		const accountData = accountsResponse.data.accounts;

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - 30);

		const transactionsResponse = await plaidClient.transactionsGet({
			access_token: accessToken,
			start_date: "2024-01-01",
			end_date: "2024-10-31",
		});

		const transactionsData = transactionsResponse.data.transactions;

		return { accountData, transactionsData, itemId };
	});
