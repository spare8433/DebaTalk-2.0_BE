import express, { NextFunction, Request, Response } from 'express';
import IssueDebatePost from '@models/issueDebatePost';
import IssueOpinion from '@models/issueOpinion';
import IssueReply from '@models/issueReply';
import User from '@models/user';
import { upload } from '../../util/multer';
import { isLoggedIn } from '../middlewares';
import { CreateOpinionRequestBody, CreatePostRequestData, CreateReplyRequestBody, GetPostRequestQuerry } from './type';
import { col, fn } from 'sequelize';

const router = express.Router();

// IssueDebatePost 생성
router.post('', isLoggedIn, upload.single('image'), async (req: Request<any,any,any>, res: Response, next:NextFunction) => {
 try {
  const data:CreatePostRequestData = JSON.parse(req.body.data)
  const issueDebatePost = await IssueDebatePost.create({
    method : data.method,
    category : data.category,
    title : data.title,
    description : data.description,
    issue1 : data.issue1,
    article : data.article.toString(),
    imgUrl : req.file !== undefined ? req.file.path : null,
    UserId: req.user!.id,
  })

  res.status(200).send({id: issueDebatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

// IssueDebatePost 가져오기
router.get('', async (req: Request<any,any,any,GetPostRequestQuerry>, res: Response, next:NextFunction) => {
  try {
    console.log(req.query.postId);
    
    const issueDebatePostData = await IssueDebatePost.findOne({
      where: { 
        id: parseInt(req.query.postId),
      },
      order: [ [IssueOpinion, { model:IssueReply, as:'Replys' }, 'createdAt', 'ASC'] ],
      include: [{
        model: IssueOpinion,  
        attributes: { exclude: ['UserId', 'IssueDebatePostId'],},
        include:[{
            model: User,
            attributes: ['id', 'nickname', 'imgUrl'],
          },{
            model: IssueReply,
            as: 'Replys',
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
      }]
    })

    res.status(200).json(issueDebatePostData)
  } catch (error) {
    console.log(error);
    next(error)
  }
})

// IssueOpinion 작성
router.post('/opinion', isLoggedIn, async (req: Request<any,any,CreateOpinionRequestBody>, res: Response, next:NextFunction) => {
  try {
    const post = await IssueDebatePost.findOne({
      where: { id: req.body.postId },
    })

    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    console.log(req.params);
    const comment = await IssueOpinion.create({
      content: req.body.content,
      score: req.body.score,
      IssueDebatePostId: req.body.postId,
      UserId: req.user!.id,
    })

    const fullComment = await IssueOpinion.findOne({
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

 // IssueReply 작성
router.post('/reply', isLoggedIn, async (req: Request<any,any,CreateReplyRequestBody>, res: Response, next:NextFunction) => {
  try {
    const opinion = await IssueOpinion.findOne({ where: { id: req.body.opinionId }, })
    if(!opinion) return res.status(403).send('존재하지 않는 의견 입니다.')

    const post = await IssueDebatePost.findOne({ where: { id: opinion!.IssueDebatePostId }, })
    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    
    console.log(req.params);

    const reply = await IssueReply.create({
      content: req.body.content,
      IssueOpinionId: req.body.opinionId,
      UserId: req.user!.id,
      TargetId: req.body.targetId
    })

    const fullReply = await IssueReply.findOne({
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
