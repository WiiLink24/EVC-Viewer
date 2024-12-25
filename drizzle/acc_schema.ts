import { pgTable, varchar, boolean } from "drizzle-orm/pg-core"
import { sql, type InferSelectModel } from "drizzle-orm"

export const users = pgTable("users", {
    email: varchar().notNull(),
    wii_number: varchar().notNull(),
    dominos_linked: boolean()
})

export type users = InferSelectModel<typeof users>;