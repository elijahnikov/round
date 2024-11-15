"use client";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselPrevious,
	CarouselNext,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import type { GetAccountsReturnType } from "@/queries/get-accounts";
import _ from "lodash";
import { ChevronLast, ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";

export default function AccountsCarousel({
	accounts,
}: {
	accounts: GetAccountsReturnType;
}) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	const currency = accounts[0]?.isoCurrencyCode;

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<Carousel setApi={setApi} className="w-full relative">
			<div className="absolute left-0 gap-1 -top-12  z-50 flex justify-end ml-auto w-full">
				<Button
					onClick={() => api?.scrollPrev()}
					className="rounded-full"
					variant={"outline"}
					size={"icon"}
				>
					<ChevronLeft />
				</Button>
				<Button
					onClick={() => api?.scrollNext()}
					className="rounded-full"
					size={"icon"}
					variant={"outline"}
				>
					<ChevronRight />
				</Button>
			</div>
			<CarouselContent className="-ml-2 md:-ml-4">
				{accounts.map((account) => (
					<CarouselItem
						key={account.plaidAccountId}
						className="pl-2 md:pl-4 basis-[300px]"
					>
						<div className="bg-stone-100 border rounded-md p-4">
							<p className="text-sm font-medium text-stone-600">
								{account.name}
							</p>
							<p className="text-2xl">
								{Number(account.currentBalance).toLocaleString(undefined, {
									style: "currency",
									currency,
								})}
							</p>
							{account.subtype ? (
								<p className="text-xs text-stone-500">
									{_.upperFirst(account.subtype)} Account (**{account.mask})
								</p>
							) : null}
							<p className="text-xs text-stone-500">
								Last synced {moment(account.lastSynced).fromNow()}
							</p>
						</div>
					</CarouselItem>
				))}
				<CarouselItem className="basis-[300px]">
					<div className="bg-stone-100 shadow-md border rounded-md p-4 h-full flex flex-col items-center justify-center gap-2 cursor-pointer">
						<div className="flex gap-1 text-sm items-center font-medium">
							<PlusIcon size={16} />
							<span>Link bank account</span>
						</div>
						<p className="text-xs text-stone-500">
							Click to link another bank account
						</p>
					</div>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	);
}
