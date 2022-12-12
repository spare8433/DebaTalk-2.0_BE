import express, { NextFunction, Request, Response } from 'express';
import IssueDebatePost from '@models/issueDebatePost';
import { Op } from "sequelize"; 
import { GetPostsRequestBody } from './type';

const router = express.Router();

// IssueDebatePosts 가져오기
router.post('', async (req: Request<any,any,GetPostsRequestBody>, res: Response, next:NextFunction) => {
 try {
  const limit = req.body.limit !== undefined ? req.body.limit : 12
  const order = req.body.order !== undefined ? req.body.order : "DESC"
  const key = req.body.key !== undefined ? req.body.key : "createdAt"
  const offset = req.body.page !== undefined ? (req.body.page - 1) * limit : 0
  let where:{[index:string]:string} = {}

  if(req.body.category) where['category'] = req.body.category
  if(req.body.searchText) {
    where = {
      ...where,
      [Op.or]: [
        { title: { [Op.substring]: req.body.searchText } },
        { description: { [Op.substring]: req.body.searchText }},
        { issue1: { [Op.substring]: req.body.searchText }},
        { issue2: { [Op.substring]: req.body.searchText }}
      ]
    }
  }

  const issueDebatePostsData = await IssueDebatePost.findAll({
    limit, offset, where, order:[[key,order]],
  })
  res.status(200).json(issueDebatePostsData)
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

export default router;
