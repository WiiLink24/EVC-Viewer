import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema"
import * as acc_schema from "./acc_schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema: schema });

export const acc_db = drizzle(process.env.ACCOUNTS_DATABASE_URL!, { schema: acc_schema })