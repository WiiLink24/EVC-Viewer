import { db } from "~/drizzle";
import { usePercentage } from "~/server/utils/calc";
import { removeSingleLanguageCols, useFormatAnsCnt } from "~/server/utils/format";
import { questions, votes as votesTable } from "~/drizzle/schema";
import { eq } from "drizzle-orm";
import { language_columns } from "../../const"
import { Poll } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = getRouterParam(event, "id");

    const language = query.language as string || "english";
    const country = query.country as number || 49;
    const region = query.region as number
    const details = query.details as boolean || false;

    const columns = {
      questionId: true,
      type: true,
      category: true,
      date: true,
      ...Object.fromEntries(
        Object.entries(language_columns).flatMap(([lang, fields]) =>
          fields.map((field) => [field, language === lang])
        )
      ),
    };

  const question = await db.query.questions.findFirst({
    columns,
    where: eq(questions.questionId, parseInt(id as string)),
  }) as Poll

  if (!question) {
    throw createError({
      statusCode: 404,
      message: 'Question not found'
    })
  }
  
  removeSingleLanguageCols(question)

    const votes_data = await db
      .select({
        typeCd: votesTable.typeCd,
        ansCnt: votesTable.ansCnt,
      })
      .from(votesTable)
      .where(eq(votesTable.questionId, parseInt(id as string)))


    const votes = votes_data.filter(v => v.typeCd === 0);
    const predictions = votes_data.filter((v) => v.typeCd === 1);

    const format_votes = votes.map(vote => {
        return useFormatAnsCnt(vote.ansCnt?.toString() ?? '');
    })

    const format_predictions = predictions.map((vote) => {
      return useFormatAnsCnt(vote.ansCnt?.toString() ?? "");
    });

    const total_votes = format_votes.reduce((acc, curr) => {
        return acc.map((val, i) => {
            return val + curr[i]
        })
    })

    const total_predictions = format_predictions.reduce((acc, curr) => {
      return acc.map((val, i) => {
        return val + curr[i];
      });
    });

    const results = usePercentage([total_votes, total_predictions])

    return { question: question, data: results};
});
