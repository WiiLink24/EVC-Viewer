import { formatAnsCnt } from '../utils/format';

const express = require('express');
const router = express.Router();

require("dotenv").config();
const pgp = require('pg-promise')();

const db = pgp(
  `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`
);

const languageColumns: { [key: string]: string[] } = {
  german: ['content_german', 'choice1_german', 'choice2_german'],
  french: ['content_french', 'choice1_french', 'choice2_french'],
  spanish: ['content_spanish', 'choice1_spanish', 'choice2_spanish'],
  italian: ['content_italian', 'choice1_italian', 'choice2_italian'],
  dutch: ['content_dutch', 'choice1_dutch', 'choice2_dutch'],
  portuguese: ['content_portuguese', 'choice1_portuguese', 'choice2_portuguese'],
  french_canada: ['content_french_canada', 'choice1_french_canada', 'choice2_french_canada'],
  english: ['content_english', 'choice1_english', 'choice2_english'],
};

const getItemsNumber = {
  polls: 'SELECT COUNT(*) FROM questions',
  votes: 'SELECT COUNT(*) FROM votes WHERE type_cd = 0 AND question_id = $1',
}

router.get('/api/polls', async (req:any, res:any) => {
  try {
    //route params
    const limit = req.query.limit || 50;
    const page = req.query.page || 1;
    const language = req.query.language || 'english';

    const offset = (page - 1) * limit;

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

    const query = `SELECT question_id, ${contentColumn}, ${choice1Column}, ${choice2Column}, type, category, date FROM questions LIMIT $1 OFFSET $2`;

    const data = await db.many(query, [limit, offset]);
    let total_items = await db.one(getItemsNumber.polls);
    total_items = total_items.count;
    const total_pages = Math.ceil(total_items / limit);

    res.json({ total_pages, total_items, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
})

router.get('/api/polls/:id', async (req:any, res:any) => {
  try {
    const id = req.params.id;
    const language = req.query.language || 'english';
    const details = req.query.details || false;
    const country_details = req.query.country_details || 49; //default is USA

    let contentColumn, choice1Column, choice2Column;

    if (languageColumns[language]) {
      [contentColumn, choice1Column, choice2Column] = languageColumns[language];
    } else {
      [contentColumn, choice1Column, choice2Column] = languageColumns.english;
    }

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
      const votes_query = `SELECT ans_cnt FROM votes WHERE question_id = $1 AND type_cd = 0`;
      const predictions_query = `SELECT ans_cnt FROM votes WHERE question_id = $1 AND type_cd = 1`;

      const votes_data = await db.many(votes_query, id);
      const predictions_data = await db.many(predictions_query, id);

      //format each ans_cnt
      const votes = votes_data.map((vote:any) => {
        return formatAnsCnt(vote.ans_cnt);
      });
      
      const predictions = predictions_data.map((prediction:any) => {
        return formatAnsCnt(prediction.ans_cnt);
      });

      let results_data: any = {};

      //add up every ans_cnt
      const total_votes_raw = votes.reduce((acc:any, curr:any) => {
        return acc.map((val:any, i:any) => {
          return val + curr[i];
        });
      });

      const total_predictions_raw = predictions.reduce((acc:any, curr:any) => {
        return acc.map((val:any, i:any) => {
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
        total: total_votes_raw[0] + total_votes_raw[1] + total_votes_raw[2] + total_votes_raw[3],
      }

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
        total: total_predictions_raw[0] + total_predictions_raw[1] + total_predictions_raw[2] + total_predictions_raw[3],
      }

      
      results_data.total_votes_percentage = {
        choice1: {
          male: ((total_votes_raw[0] / results_data.total_votes) * 100),
          female: ((total_votes_raw[1] / results_data.total_votes) * 100),
          total:((total_votes_raw[0] + total_votes_raw[1]) / results_data.total_votes) * 100,
        choice2: {
          male: ((total_votes_raw[2] / results_data.total_votes) * 100),
          female: ((total_votes_raw[3] / results_data.total_votes) * 100),
          total: ((total_votes_raw[2] + total_votes_raw[3]) / results_data.total_votes) * 100,
      }
    }}

      results_data.total_predictions_percentage = {
        choice1: ((total_predictions_raw[0] + total_predictions_raw[1]) / results_data.total_predictions) * 100,
        choice2: ((total_predictions_raw[2] + total_predictions_raw[3]) / results_data.total_predictions) * 100,
      }


    res.json({poll_data, results_data});

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as any).message });
  }
})

module.exports = router;

