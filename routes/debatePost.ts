import express from 'express';
import DebatePost from '../models/debatePost';
import date from '../util/date';
import { Op } from "sequelize";  

const router = express.Router();

// debatePost 생성
router.post('', async (req, res, next) => {
 try {
  const debatePost = await DebatePost.create({
    method : req.body.method,
    category : req.body.category,
    title : req.body.title,
    content : req.body.content,
  })
  res.status(200).send({id: debatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

// // 메인페이지 카테고리별 노출되는 게시물
// router.get('/hotTopics', async (req, res, next) => {
//   try {
//     const subject = await DebatePost.findAll({
//       where:{ 
//         method: '이슈토론',
//         createdAt: { [Op.lte]: date.add(3, 'month').format() }
//       },
//       limit: 4,
//       order: [
//         ['hits', 'DESC'],
//       ],
//       // attributes: ['id', 'title', 'category']
//     });

//     const prosCons = await DebatePost.findAll({
//       where:{ 
//         method: '찬반토론',
//         createdAt: { [Op.lte]: date.add(3, 'month') }
//       },
//       limit: 4,
//       order: [
//         ['hits', 'DESC'],
//       ],
//       // attributes: ['id', 'title', 'category']
//     });

//     const balance = await DebatePost.findAll({
//       where:{ 
//         method: '밸런스토론',
//         createdAt: { [Op.lte]: date.add(3, 'month') }
//       },
//       limit: 4,
//       order: [
//         ['hits', 'DESC'],
//       ],
//       // attributes: ['id', 'title', 'category']
//     });

//     const hotTopicData = {
//       subject,
//       prosCons,
//       balance
//     }

//     res.status(200).json(hotTopicData)
//   } catch (error) {
//    console.log(error);
//   } 
//  })

export default router;