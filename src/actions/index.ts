import { db } from "@/server/db";
import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";

export const _actionClient = createSafeActionClient({
	handleServerError(e) {
		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
});

export const actionClient = _actionClient
	.use(async ({ next, clientInput, metadata }) => {
		const result = await next({ ctx: undefined });

		if (process.env.NODE_ENV === "development") {
			console.log("Input ->", clientInput);
			console.log("Result ->", result.data);
			console.log("Metadata ->", metadata);

			return result;
		}

		return result;
	})
	.use(async ({ next }) => {
		// add db to action context
		return next({
			ctx: {
				db,
			},
		});
	});
