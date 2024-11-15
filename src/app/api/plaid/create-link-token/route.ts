import { plaidClient } from "@/lib/plaid";
import { type NextRequest, NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";

export async function POST(req: NextRequest) {
	try {
		const { client_user_id } = await req.json();
		const response = await plaidClient.linkTokenCreate({
			user: { client_user_id },
			client_name: "Round Treasury",
			products: [Products.Auth, Products.Transactions],
			country_codes: [CountryCode.Gb],
			language: "en",
		});
		return NextResponse.json({ link_token: response.data.link_token });
	} catch (error) {
		return NextResponse.json(
			{ error: "Error generating link token" },
			{ status: 500 },
		);
	}
}
