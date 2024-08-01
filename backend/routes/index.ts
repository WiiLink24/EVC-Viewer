import { formatAnsCnt } from "../utils/format";

const express = require("express");
const router = express.Router();

require("dotenv").config();
const pgp = require("pg-promise")();

const db = pgp(
  `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`
);

const languageColumns: { [key: string]: string[] } = {
  german: ["content_german", "choice1_german", "choice2_german"],
  french: ["content_french", "choice1_french", "choice2_french"],
  spanish: ["content_spanish", "choice1_spanish", "choice2_spanish"],
  italian: ["content_italian", "choice1_italian", "choice2_italian"],
  dutch: ["content_dutch", "choice1_dutch", "choice2_dutch"],
  portuguese: [
    "content_portuguese",
    "choice1_portuguese",
    "choice2_portuguese",
  ],
  french_canada: [
    "content_french_canada",
    "choice1_french_canada",
    "choice2_french_canada",
  ],
  english: ["content_english", "choice1_english", "choice2_english"],
};

const getItemsNumber = {
  polls: "SELECT COUNT(*) FROM questions WHERE date <= NOW()",
  votes: "SELECT COUNT(*) FROM votes WHERE type_cd = 0 AND question_id = $1",
};

router.get("/api/polls", async (req: any, res: any) => {
  try {
    //route params
    const limit = req.query.limit || 50;
    const page = req.query.page || 1;
    const language = req.query.language || "english";
    const type = req.query.type || "all";
    const date = new Date().toISOString().split("T")[0];

    const offset = (page - 1) * limit;

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

    let query;
    if (type === "all") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 ORDER BY date DESC LIMIT $2 OFFSET $3`;
    } else if (type === "n") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 AND type = 'n' ORDER BY date DESC LIMIT $2 OFFSET $3`;
    } else if (type === "w") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 AND type = 'w' ORDER BY date DESC LIMIT $2 OFFSET $3`;
    }

    const data = await db.many(query, [date, limit, offset]);

    //rename contentColumn, choice1Column and choice2Column to content, choice1 and choice2
    data.forEach((poll: any) => {
      poll.content = poll[contentColumn];
      poll.choice1 = poll[choice1Column];
      poll.choice2 = poll[choice2Column];
      delete poll[contentColumn];
      delete poll[choice1Column];
      delete poll[choice2Column];
    });

    let total_items;
    let total_items_query = getItemsNumber.polls;
    if (type === "all") {
      total_items = await db.one(getItemsNumber.polls);
    } else if (type === "n") {
      total_items_query += " AND type = 'n'";
      total_items = await db.one(total_items_query);
    } else if (type === "w") {
      total_items_query += " AND type = 'w'";
      total_items = await db.one(total_items_query);
    }
    
    total_items = total_items.count;
    const total_pages = Math.ceil(total_items / limit);

    res.json({ total_pages, total_items, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get("/api/polls/poll/:id", async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const language = req.query.language || "english";
    const country = req.query.country || 49;
    const region = req.query.region;
    const details = req.query.details || false;

    let isNational = false;
    let response;

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

    //query the poll data
    const query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE question_id = $1`;

    const poll_data = await db.one(query, id);
    poll_data.language = language;

    //rename contentColumn, choice1Column and choice2Column to content, choice1 and choice2
    poll_data.content = poll_data[contentColumn];
    poll_data.choice1 = poll_data[choice1Column];
    poll_data.choice2 = poll_data[choice2Column];
    delete poll_data[contentColumn];
    delete poll_data[choice1Column];
    delete poll_data[choice2Column];

    //process the votes data
    let votes_query = `SELECT ans_cnt, type_cd FROM votes WHERE question_id = $1`;

    const data = await db.many(votes_query, id);

    const votes_data = data.filter((votes: any) => votes.type_cd === 0);
    const predictions_data = data.filter((votes: any) => votes.type_cd === 1);

    //format each ans_cnt
    const votes = votes_data.map((vote: any) => {
      return formatAnsCnt(vote.ans_cnt);
    });

    const predictions = predictions_data.map((prediction: any) => {
      return formatAnsCnt(prediction.ans_cnt);
    });

    let results_data: any = {};

    //add up every ans_cnt
    const total_votes_raw = votes.reduce((acc: any, curr: any) => {
      return acc.map((val: any, i: any) => {
        return val + curr[i];
      });
    });

    const total_predictions_raw = predictions.reduce((acc: any, curr: any) => {
      return acc.map((val: any, i: any) => {
        return val + curr[i];
      });
    });

    results_data.total_votes = {
      choice1: {
        male: total_votes_raw[0],
        female: total_votes_raw[1],
        total: total_votes_raw[0] + total_votes_raw[1],
      },
      choice2: {
        male: total_votes_raw[2],
        female: total_votes_raw[3],
        total: total_votes_raw[2] + total_votes_raw[3],
      },
      total:
        total_votes_raw[0] +
        total_votes_raw[1] +
        total_votes_raw[2] +
        total_votes_raw[3],
    };

    results_data.total_predictions = {
      choice1: {
        male: total_predictions_raw[0],
        female: total_predictions_raw[1],
        total: total_predictions_raw[0] + total_predictions_raw[1],
      },
      choice2: {
        male: total_predictions_raw[2],
        female: total_predictions_raw[3],
        total: total_predictions_raw[2] + total_predictions_raw[3],
      },
      total:
        total_predictions_raw[0] +
        total_predictions_raw[1] +
        total_predictions_raw[2] +
        total_predictions_raw[3],
    };

    results_data.total_votes_percentage = {
      choice1: {
        male:
          (total_votes_raw[0] / results_data.total_votes.choice1.total) * 100,
        female:
          (total_votes_raw[1] / results_data.total_votes.choice1.total) * 100,
        total:
          ((total_votes_raw[0] + total_votes_raw[1]) /
            results_data.total_votes.total) *
          100,
      },
      choice2: {
        male:
          (total_votes_raw[2] / results_data.total_votes.choice2.total) * 100,
        female:
          (total_votes_raw[3] / results_data.total_votes.choice2.total) * 100,
        total:
          ((total_votes_raw[2] + total_votes_raw[3]) /
            results_data.total_votes.total) *
          100,
      },
    };

    results_data.total_predictions_percentage = {
      choice1: {
        male:
          (total_predictions_raw[0] /
            results_data.total_predictions.choice1.total) *
          100,
        female:
          (total_predictions_raw[1] /
            results_data.total_predictions.choice1.total) *
          100,
        total:
          ((total_predictions_raw[0] + total_predictions_raw[1]) /
            results_data.total_predictions.total) *
          100,
      },
      choice2: {
        male:
          (total_predictions_raw[2] /
            results_data.total_predictions.choice2.total) *
          100,
        female:
          (total_predictions_raw[3] /
            results_data.total_predictions.choice2.total) *
          100,
        total:
          ((total_predictions_raw[2] + total_predictions_raw[3]) /
            results_data.total_predictions.total) *
          100,
      },
    };

    response = { poll_data, results_data };

    //if details is true, query the votes data for the provided country and/or region
    if (details) {
      //first, check if the poll is national or worldwide
      //if national, query only depending on the region id
      //if worldwide, query depending on the country id and region id if provided
      //the worldwide response should return both the country details and region details if the region is provided
      let country_query = `SELECT ans_cnt, type_cd FROM votes WHERE question_id = $1 AND country_id = $2`;
      let region_query = `SELECT ans_cnt, type_cd FROM votes WHERE question_id = $1 AND country_id = $2 AND region_id = $3`;
      let country_data;
      let region_data;

      if (isNational) {
        region_data = await db.many(region_query, [id, country, region]);
      } else {
        if (region) {
          country_data = await db.many(country_query, [id, country]);
          region_data = await db.many(region_query, [id, country, region]);
        } else {
          country_data = await db.many(country_query, [id, country]);
        }
      }

      let details_data: any = {
        country: {
          country_id: parseInt(country),
          region_id: parseInt(region) || "none",
        },
        country_data: {},
        region_data: {},
      };
      //create 2 objects for country and region details
      if (country_data) {
        const country_votes = country_data.filter(
          (votes: any) => votes.type_cd === 0
        );
        const country_predictions = country_data.filter(
          (votes: any) => votes.type_cd === 1
        );

        const country_data_votes = country_votes.map((vote: any) => {
          return formatAnsCnt(vote.ans_cnt);
        });

        const country_data_predictions = country_predictions.map(
          (prediction: any) => {
            return formatAnsCnt(prediction.ans_cnt);
          }
        );

        const country_total_votes_raw = country_data_votes.reduce(
          (acc: any, curr: any) => {
            return acc.map((val: any, i: any) => {
              return val + curr[i];
            });
          }
        );

        const country_total_predictions_raw = country_data_predictions.reduce(
          (acc: any, curr: any) => {
            return acc.map((val: any, i: any) => {
              return val + curr[i];
            });
          }
        );

        (details_data.country_data.total_votes = {
          choice1: {
            male: country_total_votes_raw[0],
            female: country_total_votes_raw[1],
            total: country_total_votes_raw[0] + country_total_votes_raw[1],
          },
          choice2: {
            male: country_total_votes_raw[2],
            female: country_total_votes_raw[3],
            total: country_total_votes_raw[2] + country_total_votes_raw[3],
          },
          total:
            country_total_votes_raw[0] +
            country_total_votes_raw[1] +
            country_total_votes_raw[2] +
            country_total_votes_raw[3],
        }),
          (details_data.country_data.total_predictions = {
            choice1: {
              male: country_total_predictions_raw[0],
              female: country_total_predictions_raw[1],
              total:
                country_total_predictions_raw[0] +
                country_total_predictions_raw[1],
            },
            choice2: {
              male: country_total_predictions_raw[2],
              female: country_total_predictions_raw[3],
              total:
                country_total_predictions_raw[2] +
                country_total_predictions_raw[3],
            },
            total:
              country_total_predictions_raw[0] +
              country_total_predictions_raw[1] +
              country_total_predictions_raw[2] +
              country_total_predictions_raw[3],
          });

        details_data.country_data.total_votes_percentage = {
          choice1: {
            male:
              (country_total_votes_raw[0] /
                details_data.country_data.total_votes.choice1.total) *
              100,
            female:
              (country_total_votes_raw[1] /
                details_data.country_data.total_votes.choice1.total) *
              100,
            total:
              ((country_total_votes_raw[0] + country_total_votes_raw[1]) /
                details_data.country_data.total_votes.total) *
              100,
          },
          choice2: {
            male:
              (country_total_votes_raw[2] /
                details_data.country_data.total_votes.choice2.total) *
              100,
            female:
              (country_total_votes_raw[3] /
                details_data.country_data.total_votes.choice2.total) *
              100,
            total:
              ((country_total_votes_raw[2] + country_total_votes_raw[3]) /
                details_data.country_data.total_votes.total) *
              100,
          },
        };

        details_data.country_data.total_predictions_percentage = {
          choice1: {
            male:
              (country_total_predictions_raw[0] /
                details_data.country_data.total_predictions.choice1.total) *
              100,
            female:
              (country_total_predictions_raw[1] /
                details_data.country_data.total_predictions.choice1.total) *
              100,
            total:
              ((country_total_predictions_raw[0] +
                country_total_predictions_raw[1]) /
                details_data.country_data.total_predictions.total) *
              100,
          },
          choice2: {
            male:
              (country_total_predictions_raw[2] /
                details_data.country_data.total_predictions.choice2.total) *
              100,
            female:
              (country_total_predictions_raw[3] /
                details_data.country_data.total_predictions.choice2.total) *
              100,
            total:
              ((country_total_predictions_raw[2] +
                country_total_predictions_raw[3]) /
                details_data.country_data.total_predictions.total) *
              100,
          },
        };
      }
      if (region_data) {
        const region_votes = region_data.filter(
          (votes: any) => votes.type_cd === 0
        );
        const region_predictions = region_data.filter(
          (votes: any) => votes.type_cd === 1
        );

        const region_data_votes = region_votes.map((vote: any) => {
          return formatAnsCnt(vote.ans_cnt);
        });

        const region_data_predictions = region_predictions.map(
          (prediction: any) => {
            return formatAnsCnt(prediction.ans_cnt);
          }
        );

        const region_total_votes_raw = region_data_votes.reduce(
          (acc: any, curr: any) => {
            return acc.map((val: any, i: any) => {
              return val + curr[i];
            });
          }
        );

        const region_total_predictions_raw = region_data_predictions.reduce(
          (acc: any, curr: any) => {
            return acc.map((val: any, i: any) => {
              return val + curr[i];
            });
          }
        );

        details_data.region_data.total_votes = {
          choice1: {
            male: region_total_votes_raw[0],
            female: region_total_votes_raw[1],
            total: region_total_votes_raw[0] + region_total_votes_raw[1],
          },
          choice2: {
            male: region_total_votes_raw[2],
            female: region_total_votes_raw[3],
            total: region_total_votes_raw[2] + region_total_votes_raw[3],
          },
          total:
            region_total_votes_raw[0] +
            region_total_votes_raw[1] +
            region_total_votes_raw[2] +
            region_total_votes_raw[3],
        };

        details_data.region_data.total_predictions = {
          choice1: {
            male: region_total_predictions_raw[0],
            female: region_total_predictions_raw[1],
            total:
              region_total_predictions_raw[0] + region_total_predictions_raw[1],
          },
          choice2: {
            male: region_total_predictions_raw[2],
            female: region_total_predictions_raw[3],
            total:
              region_total_predictions_raw[2] + region_total_predictions_raw[3],
          },
          total:
            region_total_predictions_raw[0] +
            region_total_predictions_raw[1] +
            region_total_predictions_raw[2] +
            region_total_predictions_raw[3],
        };

        details_data.region_data.total_votes_percentage = {
          choice1: {
            male:
              (region_total_votes_raw[0] /
                details_data.region_data.total_votes.choice1.total) *
              100,
            female:
              (region_total_votes_raw[1] /
                details_data.region_data.total_votes.choice1.total) *
              100,
            total:
              ((region_total_votes_raw[0] + region_total_votes_raw[1]) /
                details_data.region_data.total_votes.total) *
              100,
          },
          choice2: {
            male:
              (region_total_votes_raw[2] /
                details_data.region_data.total_votes.choice2.total) *
              100,
            female:
              (region_total_votes_raw[3] /
                details_data.region_data.total_votes.choice2.total) *
              100,
            total:
              ((region_total_votes_raw[2] + region_total_votes_raw[3]) /
                details_data.region_data.total_votes.total) *
              100,
          },
        };

        details_data.region_data.total_predictions_percentage = {
          choice1: {
            male:
              (region_total_predictions_raw[0] /
                details_data.region_data.total_predictions.choice1.total) *
              100,
            female:
              (region_total_predictions_raw[1] /
                details_data.region_data.total_predictions.choice1.total) *
              100,
            total:
              ((region_total_predictions_raw[0] +
                region_total_predictions_raw[1]) /
                details_data.region_data.total_predictions.total) *
              100,
          },
          choice2: {
            male:
              (region_total_predictions_raw[2] /
                details_data.region_data.total_predictions.choice2.total) *
              100,
            female:
              (region_total_predictions_raw[3] /
                details_data.region_data.total_predictions.choice2.total) *
              100,
            total:
              ((region_total_predictions_raw[2] +
                region_total_predictions_raw[3]) /
                details_data.region_data.total_predictions.total) *
              100,
          },
        };
      }
      response = { poll_data, results_data, details_data };
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.get("/api/polls/current", async (req: any, res: any) => {
  try {
    const language = req.query.language || "english";
    const type = req.query.type || "all";

    const date = new Date().toISOString().split("T")[0];
    let date_delayed;
    let date_delayed_w = new Date(new Date().setDate(new Date().getDate() - 13))
      .toISOString()
      .split("T")[0];

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

    let query;
    //query the polls that are at least 6 days old
    if (type === "all") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 AND date >= $2 AND type = 'n' OR date <= $3 AND date >= $4 AND type = 'w'`;
      date_delayed = new Date(new Date().setDate(new Date().getDate() - 6))
        .toISOString()
        .split("T")[0];
    } else if (type === "national") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 AND date >= $2 AND type = 'n'`;
      date_delayed = new Date(new Date().setDate(new Date().getDate() - 6))
        .toISOString()
        .split("T")[0];
    } else if (type === "worldwide") {
      query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions WHERE date <= $1 AND date >= $2 AND type = 'w'`;
      date_delayed = new Date(new Date().setDate(new Date().getDate() - 13))
        .toISOString()
        .split("T")[0];
    }

    let data;
    if (type === "all") {
      data = await db.many(query, [date, date_delayed, date, date_delayed_w]);
    } else {
      data = await db.many(query, [date, date_delayed]);
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
});

router.post("/api/polls/search", async (req: any, res: any) => {
  try {
    const language = req.body.language || "english";
    const search = req.body.search;

    const maxLength = 50;
    if (
      typeof search !== "string" ||
      search.length > maxLength ||
      search.length < 3
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid search query. Please retry using another term",
        });
    }

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

    const query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date 
               FROM questions 
               WHERE ${contentColumn} ILIKE $1 
               AND date <= NOW() 
               ORDER BY date DESC`;

    const data = await db.many(query, [`%${search}%`]);

    //rename contentColumn, choice1Column and choice2Column to content, choice1 and choice2
    data.forEach((poll: any) => {
      poll.content = poll[contentColumn];
      poll.choice1 = poll[choice1Column];
      poll.choice2 = poll[choice2Column];
      delete poll[contentColumn];
      delete poll[choice1Column];
      delete poll[choice2Column];
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
});

module.exports = router;
