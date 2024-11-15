"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GetRecentTransactionsQuery } from "@/queries/get-recent-transactions";
import type { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import moment from "moment";

export type Transaction = GetRecentTransactionsQuery[number];

export const columns: ColumnDef<Transaction>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div>{moment(row.getValue("date")).format("D MMM YYYY")}</div>;
		},
	},
	{
		accessorKey: "name",
		header: "To/From",
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue("amount"));
			const currency = row.original.isoCurrencyCode;
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: currency ?? "GBP",
				signDisplay: amount < 0 ? "exceptZero" : "never",
			}).format(Math.abs(amount));

			return (
				<div className={amount > 0 ? "text-red-500" : "text-green-600"}>
					{formatted}
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			return (
				<div>{_.upperFirst(row.getValue("category")).replace("_", " ")}</div>
			);
		},
	},
	{
		accessorKey: "subtype",
		header: "Account",
		cell: ({ row }) => {
			const subtype = row.original.account.subtype;
			const mask = row.original.account.mask;
			return (
				<div>
					{_.upperFirst(subtype ?? "")} Account
					{mask ? ` (**${mask})` : null}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(payment.plaidTransactionId)
							}
						>
							Copy transaction ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View transaction details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
