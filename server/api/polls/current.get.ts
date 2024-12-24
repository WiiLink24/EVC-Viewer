import { db } from "~/drizzle";
import { language_columns } from "../../const";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const language = query.language as string || "english";
    const type = query.type as string || "all";

    const date: string = new Date().toISOString().split("T")[0];
    const delayed_date: string = type === "w" ? new Date(new Date().setDate(new Date().getDate() - 13)).toISOString().split("T")[0] : new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split("T")[0];

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

    const data = await db.query.questions.findMany({
        columns,
        where: (questions, { gte, lte, eq, and }) => 
            type === 'all' ? and(lte(questions.date, date), gte(questions.date, delayed_date)) : and(lte(questions.date, date), gte(questions.date, delayed_date), eq(questions.type, type)),
        orderBy: (questions, { desc }) => [desc(questions.date)],

    });

    removeLanguageCols(data)

    return data;
});
