import HomePageView from "@/components/pages/home";
import { Suspense } from "react";

export default async function HomePage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<HomePageView />
		</Suspense>
	);
}
