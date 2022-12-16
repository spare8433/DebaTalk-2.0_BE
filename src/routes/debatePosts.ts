import express from 'express';
import DebatePost from '../models/debatePost';
import dayjs from 'dayjs'

import { FindOptions, Op } from "sequelize";  
import BalanceDebatePost from '@models/balanceDebatePost';
import IssueDebatePost from '@models/issueDebatePost';
import ProsConsDebatePost from '@models/prosConsDebatePost';
import IssueOpinion from '@models/issueOpinion';
import ProsConsOpinion from '@models/prosConsOpinion';
import BalanceOpinion from '@models/balanceOpinion';

const router = express.Router();
const date = dayjs()

// 메인 craousel 키워드
router.get('/keywords', async (req, res, next) => {
 try {
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 5
  const commonOption:FindOptions = {
    limit: limit,
    order: [ ['createdAt', 'DESC'], ],
    attributes: ['id', 'title', 'category']
  }
  const balanceKeyword = await BalanceDebatePost.findAll({...commonOption})
  const issueKeyword = await IssueDebatePost.findAll({...commonOption})
  const prosConsKeyword = await ProsConsDebatePost.findAll({...commonOption})

  const allKeywordsData = { balanceKeyword, issueKeyword, prosConsKeyword }

  res.status(200).json(allKeywordsData)
 } catch (error) {
  console.log(error);
 } 
})

// 메인페이지 카테고리별 노출되는 게시물
router.get('/hotTopics', async (req, res, next) => {
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 4
    const commonOption:FindOptions = {
      where:{ createdAt: { [Op.lte]: date.add(3, 'month').format() } },
      limit: limit,
      order: [ ['hits', 'DESC'], ],
    }

    const issue = await IssueDebatePost.findAll({
      ...commonOption,
      // include: [{
      //   model: IssueOpinion,
      //   attributes: { exclude: ['UserId', 'IssueDebatePostId'],},
      // }]
    });

    const prosCons = await ProsConsDebatePost.findAll({
      ...commonOption,
      // include: [{
      //   model: ProsConsOpinion,
      //   attributes: { exclude: ['UserId', 'ProsConsDebatePostId'],},
      // }]
    });

    const balance = await BalanceDebatePost.findAll({
      ...commonOption,
      // include: [{
      //   model: BalanceOpinion,
      //   attributes: { exclude: ['UserId', 'BalanceDebatePostId'],},
      // }]
    });

    const hotTopicData = { issue, prosCons, balance}

    res.status(200).json(hotTopicData)
  } catch (error) {
   console.log(error);
  } 
 })

export default router;