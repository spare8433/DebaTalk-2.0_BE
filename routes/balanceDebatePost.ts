import express, { NextFunction, Request, Response } from 'express';
import BalanceDebatePost from '../models/balanceDebatePost';
import BalanceOpinion from '../models/balanceOpinion';
import BalanceReply from '../models/balanceReply';
import User from '../models/user';
import { upload } from '../util/multer';
import { isLoggedIn } from './middlewares';

const router = express.Router();

// balanceDebatePost 생성
router.post('', isLoggedIn, upload.single('image'), async (req: Request, res: Response, next:NextFunction) => {
 try {
  type ResponseData = {
    method: string,
    category: string,
    title:string,
    optionA:string,
    optionB:string,
    description:string,
    issue1:string,
    issue2:string,
    article:string[]
  }
  const data:ResponseData = JSON.parse(req.body.data)
  const balanceDebatePost = await BalanceDebatePost.create({
    method : data.method,
    category : data.category,
    title : data.title,
    optionA: data.optionA,
    optionB: data.optionB,
    description : data.description,
    issue1 : data.issue1,
    issue2 : data.issue2,
    article : data.article.toString(),
    imgUrl : req.file !== undefined ? req.file.path : null,
    UserId: req.user!.id,
  })

  res.status(200).send({id: balanceDebatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

// balanceDebatePost 가져오기
router.get('', async (req: Request, res: Response, next:NextFunction) => {
  try {
    console.log(req.query.postId);
    
    const balanceDebatePostData = await BalanceDebatePost.findOne({
      where: { 
        id: parseInt(req.query.postId as string),
      },
      order: [ [BalanceOpinion, { model:BalanceReply, as:'BalanceReplys' }, 'createdAt', 'ASC'] ],
      include: [{
        model: BalanceOpinion,  
        attributes: { exclude: ['UserId', 'BalanceDebatePostId'] },
        include:[{
            model: User,
            attributes: ['id', 'nickname', 'imgUrl'],
          },{
            model: BalanceReply,
            as: 'BalanceReplys',
            attributes: { exclude: ['UserId', 'TargetId'] },
            include:[{
                model: User,
                attributes: ['id', 'nickname', 'imgUrl'],
              },{
                model: User,
                as:'Target',
                attributes: ['id', 'nickname', 'imgUrl'],
              }
            ]
          }
        ]
      },{
        model: BalanceOpinion,
        as: 'OptionAList',
        attributes: ['UserId'],
      },{
        model: BalanceOpinion,
        as: 'OptionBList',
        attributes: ['UserId'],
      }]
    })

    res.status(200).json(balanceDebatePostData)
  } catch (error) {
    console.log(error);
    next(error)
  }
})

// balanceOpinion 작성
router.post('/opinion', isLoggedIn, async (req: Request, res: Response, next:NextFunction) => {
  try {
    const post = await BalanceDebatePost.findOne({
      where: { id: req.body.postId },
    })

    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    console.log(req.params);
    const comment = await BalanceOpinion.create({
      content: req.body.content,
      selection: req.body.selection,
      BalanceDebatePostId: parseInt(req.body.postId),
      UserId: req.user!.id,
    })

    const fullComment = await BalanceOpinion.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }]
    })
    res.status(201).json(fullComment)
  } catch (error) {
   console.log(error);
   next(error)
  } 
 })

 // balanceReply 작성
router.post('/reply', isLoggedIn, async (req: Request, res: Response, next:NextFunction) => {
  try {
    const opinion = await BalanceOpinion.findOne({ where: { id: req.body.opinionId }, })
    if(!opinion) return res.status(403).send('존재하지 않는 의견 입니다.')

    const post = await BalanceDebatePost.findOne({ where: { id: opinion!.BalanceDebatePostId }, })
    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    
    console.log(req.params);

    const reply = await BalanceReply.create({
      content: req.body.content,
      BalanceOpinionId: parseInt(req.body.opinionId),
      UserId: req.user!.id,
      TargetId: req.body.targetId
    })

    const fullReply = await BalanceOpinion.findOne({
      where: { id: reply.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'imgUrl'],
      }]
    })
    res.status(201).json(fullReply)
  } catch (error) {
   console.log(error);
   next(error)
  } 
 })

export default router;
