import { plaidClient } from "@/lib/plaid";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { public_token } = await req.json();
	try {
		const response = await plaidClient.itemPublicTokenExchange({
			public_token,
		});
		const { access_token } = response.data;
		return NextResponse.json({ access_token });
	} catch (error) {
		return NextResponse.json(
			{ error: "Error exchanging public token" },
			{ status: 500 },
		);
	}
}
