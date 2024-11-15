import type { GetAccountsReturnType } from "@/queries/get-accounts";
import _ from "lodash";
import moment from "moment";
import AccountsCarousel from "./accounts-carousel";

export default function Accounts({
	accounts,
}: { accounts: GetAccountsReturnType }) {
	if (!accounts || accounts.length === 0) {
		return null;
	}

	const currency = accounts[0]?.isoCurrencyCode;
	const totalBalance = accounts
		.reduce((acc, account) => {
			return acc + Number.parseFloat(account.currentBalance);
		}, 0)
		.toLocaleString(undefined, {
			style: "currency",
			currency,
		});
	return (
		<div className="mt-4 gap-2 flex flex-col">
			<p className="text-xs text-stone-500">
				Total account balance ({accounts.length} accounts)
			</p>
			<div className="border rounded-md w-max h-max p-4 flex items-center gap-2">
				<p className="text-md text-stone-500">
					<span className="text-lg">🇬🇧</span>
					{currency}
				</p>
				<p className="text-2xl font-semibold">{totalBalance}</p>
			</div>
			<AccountsCarousel accounts={accounts} />
		</div>
	);
}
