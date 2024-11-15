import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	json,
	pgTableCreator,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `round_${name}`);

export const accounts = createTable("accounts", {
	plaidAccountId: varchar("account_id", { length: 50 }).primaryKey(),
	plaidItemId: varchar("item_id", { length: 50 }),
	name: varchar("name", { length: 100 }).notNull(),
	type: varchar("type", { length: 50 }).notNull(),
	mask: varchar("mask", { length: 50 }),
	subtype: varchar("subtype", { length: 50 }),
	currentBalance: decimal("balance", { precision: 12, scale: 2 }).notNull(),
	availableBalance: decimal("available_balance", {
		precision: 12,
		scale: 2,
	}).notNull(),
	isoCurrencyCode: varchar("currency", { length: 3 }).notNull(),
	lastSynced: timestamp("last_synced").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions),
	stats: many(stats),
}));

export const transactions = createTable("transactions", {
	id: serial("id").primaryKey(),
	plaidTransactionId: varchar("transaction_id", { length: 50 })
		.notNull()
		.unique(),
	plaidAccountId: varchar("account_id", { length: 50 }).notNull(),
	amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
	date: timestamp("date").notNull(),
	description: text("description"),
	category: varchar("category", { length: 100 }),
	name: varchar("name", { length: 100 }).notNull(),
	merchantName: varchar("merchant_name", { length: 100 }),
	pending: boolean("pending").notNull().default(false),
	isoCurrencyCode: varchar("currency", { length: 3 }).notNull(),
	logoUrl: varchar("logo_url", { length: 255 }),
	createdAt: timestamp("created_at").defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.plaidAccountId],
		references: [accounts.plaidAccountId],
	}),
}));

export const stats = createTable("stats", {
	id: serial("id").primaryKey(),
	monthlyInflow: decimal("monthly_inflow", {
		precision: 12,
		scale: 2,
	}).notNull(),
	monthlyOutflow: decimal("monthly_outflow", {
		precision: 12,
		scale: 2,
	}).notNull(),
	runway: decimal("runway", { precision: 12, scale: 2 }).notNull(),
	calculatedAt: timestamp("calculated_at").notNull(),
});
