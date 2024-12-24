import { db } from "~/drizzle";
import { language_columns } from "../../const";
import { removeLanguageCols } from "~/server/utils/format";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const search = await readBody(event)

    const language = query.language as string || "english";

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
        where: (questions, { ilike, lte, and }) => {
            switch (language) {
                case "english":
                    return ilike(questions.contentEnglish, `%${search.search}%`);
                case "french":
                    return ilike(questions.contentFrench, `%${search.search}%`);
                case "german":
                    return ilike(questions.contentGerman, `%${search.search}%`);
                case "spanish":
                    return ilike(questions.contentSpanish, `%${search.search}%`);
                case "portuguese":
                    return ilike(questions.contentPortuguese, `%${search.search}%`);
                case "dutch":
                    return ilike(questions.contentDutch, `%${search.search}%`);
                case "french_canada":
                    return ilike(questions.contentFrenchCanada, `%${search.search}%`);
                case "italian":
                    return ilike(questions.contentItalian, `%${search.search}%`);
                default:
                    return ilike(questions.contentEnglish, `%${search.search}%`); // fallback to English
            }
        },
        orderBy: (questions, { desc }) => [desc(questions.date)],
    });

    removeLanguageCols(data);

    return data;
});
