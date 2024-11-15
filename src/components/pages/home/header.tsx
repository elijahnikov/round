"use client";

import { exchangePublicTokenAction } from "@/actions/exchange-public-token";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useAction } from "next-safe-action/hooks";
import { createLinkTokenAction } from "@/actions/create-link-token";
import { insertAccountsTransactionsAction } from "@/actions/insert-accounts-transactions";
import { calculateStats } from "@/actions/calculate-stats";

export default function HomeHeader() {
	const [linkToken, setLinkToken] = useState<string | null>(null);

	const exchangePublicToken = useAction(exchangePublicTokenAction, {
		onSuccess: async (data) => {
			await insertAccountsTransactionsAction(
				data.data?.accountData ?? [],
				data.data?.transactionsData ?? [],
				data.data?.itemId ?? "",
			);
			await calculateStats(data.data?.transactionsData ?? []);
		},
	});
	const createLinkToken = useAction(createLinkTokenAction, {
		onSuccess: (data) => {
			setLinkToken(data.data?.linkToken ?? null);
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const createToken = async () => {
			try {
				await createLinkToken.executeAsync({
					clientUserId: "unique-user-id-idk-something-random-i-guess",
				});
			} catch (error) {
				console.error("Error generating link token:", error);
			}
		};
		createToken();
	}, []);

	const onSuccess = async (public_token: string) => {
		const response = await exchangePublicToken.executeAsync({
			publicToken: public_token,
		});
		console.log(response?.data);
	};

	const { open, ready } = usePlaidLink({
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		token: linkToken!,
		onSuccess,
	});

	return (
		<div className="flex items-center justify-between w-full">
			<div>
				<h1 className="text-2xl font-bold">Accounts</h1>
				<p className="text-sm text-stone-600">
					Add or manage your linked bank accounts
				</p>
			</div>
			<div className="flex gap-2">
				<Button variant={"outline"} size={"icon"}>
					<RefreshCcw />
				</Button>
				<Button onClick={() => open()} disabled={!ready}>
					<PlusIcon /> Link bank account
				</Button>
			</div>
		</div>
	);
}
