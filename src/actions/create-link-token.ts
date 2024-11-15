"use server";

import { z } from "zod";
import { actionClient } from ".";
import { CountryCode, type LinkTokenCreateRequest, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";

const createLinkTokenSchema = z.object({
	clientUserId: z.string(),
});

export const createLinkTokenAction = actionClient
	.schema(createLinkTokenSchema)
	.action(async ({ parsedInput, ctx }) => {
		const tokenParams = {
			user: { client_user_id: parsedInput.clientUserId },
			client_name: "Round Treasury",
			products: [Products.Auth, Products.Transactions],
			country_codes: [CountryCode.Gb],
			language: "en",
		} satisfies LinkTokenCreateRequest;

		const response = await plaidClient.linkTokenCreate(tokenParams);

		return {
			linkToken: response.data.link_token,
		};
	});
