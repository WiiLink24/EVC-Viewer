import { pgTable, bigint, varchar, smallint, date, serial, integer } from "drizzle-orm/pg-core"
import { relations, sql, type InferSelectModel } from "drizzle-orm"



export const questions = pgTable("questions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	questionId: bigint("question_id", { mode: "number" }),
	contentEnglish: varchar("content_english", { length: 255 }),
	contentGerman: varchar("content_german", { length: 255 }),
	contentFrench: varchar("content_french", { length: 255 }),
	contentSpanish: varchar("content_spanish", { length: 255 }),
	contentItalian: varchar("content_italian", { length: 255 }),
	contentDutch: varchar("content_dutch", { length: 255 }),
	contentPortuguese: varchar("content_portuguese", { length: 255 }),
	contentFrenchCanada: varchar("content_french_canada", { length: 255 }),
	choice1English: varchar("choice1_english", { length: 255 }),
	choice1German: varchar("choice1_german", { length: 255 }),
	choice1French: varchar("choice1_french", { length: 255 }),
	choice1Spanish: varchar("choice1_spanish", { length: 255 }),
	choice1Italian: varchar("choice1_italian", { length: 255 }),
	choice1Dutch: varchar("choice1_dutch", { length: 255 }),
	choice1Portuguese: varchar("choice1_portuguese", { length: 255 }),
	choice1FrenchCanada: varchar("choice1_french_canada", { length: 255 }),
	choice2English: varchar("choice2_english", { length: 255 }),
	choice2German: varchar("choice2_german", { length: 255 }),
	choice2French: varchar("choice2_french", { length: 255 }),
	choice2Spanish: varchar("choice2_spanish", { length: 255 }),
	choice2Italian: varchar("choice2_italian", { length: 255 }),
	choice2Dutch: varchar("choice2_dutch", { length: 255 }),
	choice2Portuguese: varchar("choice2_portuguese", { length: 255 }),
	choice2FrenchCanada: varchar("choice2_french_canada", { length: 255 }),
	type: varchar({ length: 1 }),
	category: smallint(),
	date: date(),
});

export const suggestions = pgTable("suggestions", {
	id: serial().notNull(),
	countryCode: integer("country_code"),
	regionCode: integer("region_code"),
	languageCode: integer("language_code"),
	content: varchar(),
	choice1: varchar(),
	choice2: varchar(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	wiiNo: bigint("wii_no", { mode: "number" }),
});

export const user = pgTable("user", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 100 }),
	passwordHash: varchar("password_hash"),
});

export const votes = pgTable("votes", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).default(sql`nextval('votes_new_column_seq'::regclass)`),
	typeCd: smallint("type_cd"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	questionId: bigint("question_id", { mode: "number" }).references(() => questions.questionId),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	wiiNo: bigint("wii_no", { mode: "number" }),
	countryId: smallint("country_id"),
	regionId: smallint("region_id"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ansCnt: bigint("ans_cnt", { mode: "number" }),
	newColumn: serial("new_column").notNull(),
});


export const votesRelations = relations(votes, ({ one }) => ({
	question: one(questions, {
		fields: [votes.questionId],
		references: [questions.questionId],
	})
}))

export type votes = InferSelectModel<typeof votes>
export type questions = InferSelectModel<typeof questions>
export type suggestions = InferSelectModel<typeof suggestions>