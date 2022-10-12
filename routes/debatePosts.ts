import express from 'express';
import DebatePost from '../models/debatePost';
import date from '../util/date';
import { Op } from "sequelize";  

const router = express.Router();

// 메인 craousel 키워드
router.get('/keywords', async (req, res, next) => {
 try {

  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 12
  const kewordData = await DebatePost.findAll({
    limit: limit,
    order: [
      ['createdAt', 'DESC'],
    ],
    attributes: ['id', 'title', 'category']
  });
  res.status(200).json(kewordData)
 } catch (error) {
  console.log(error);
 } 
})

// 메인페이지 카테고리별 노출되는 게시물
router.get('/hotTopics', async (req, res, next) => {
  try {
    const subject = await DebatePost.findAll({
      where:{ 
        method: '이슈토론',
        createdAt: { [Op.lte]: date.add(3, 'month').format() }
      },
      limit: 4,
      order: [
        ['hits', 'DESC'],
      ],
      // attributes: ['id', 'title', 'category']
    });

    const prosCons = await DebatePost.findAll({
      where:{ 
        method: '찬반토론',
        createdAt: { [Op.lte]: date.add(3, 'month') }
      },
      limit: 4,
      order: [
        ['hits', 'DESC'],
      ],
      // attributes: ['id', 'title', 'category']
    });

    const balance = await DebatePost.findAll({
      where:{ 
        method: '밸런스토론',
        createdAt: { [Op.lte]: date.add(3, 'month') }
      },
      limit: 4,
      order: [
        ['hits', 'DESC'],
      ],
      // attributes: ['id', 'title', 'category']
    });

    const hotTopicData = {
      subject,
      prosCons,
      balance
    }

    res.status(200).json(hotTopicData)
  } catch (error) {
   console.log(error);
  } 
 })

export default router;