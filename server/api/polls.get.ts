import { db } from "~/drizzle";
import { count } from "drizzle-orm";
import { questions } from "~/drizzle/schema";
import { language_columns } from "../const";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const page = query.page as number || 1;
    const limit = query.limit as number || 50;
    const language = query.language as string || "english";
    const type = query.type as string || "all";

    const date: string = new Date().toISOString().split("T")[0];
    const offset: number = (page - 1) * limit;

    const columns = {
        questionId: true,
        type: true,
        category: true,
        date: true,
        ...Object.fromEntries(
            Object.entries(language_columns).flatMap(([lang, fields]) =>
                fields.map(field => [field, language === lang])
            )
        )
    };

    const [{ total_items }] = await db.select({ total_items: count() }).from(questions) as [{ total_items: number }];

    const data = await db.query.questions.findMany({
        columns,
        where: (questions, { lte, eq, and }) => 
            type === 'all' ? lte(questions.date, date) : and(lte(questions.date, date), eq(questions.type, type)),
        orderBy: (questions, { desc }) => [desc(questions.date)],
        limit,
        offset,
    });

    const total_pages = Math.ceil(total_items / limit);

    return { total_pages, total_items, data};
});
