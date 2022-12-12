import express, { NextFunction, Request, Response } from 'express';
import { upload } from '../../util/multer';
import { isLoggedIn } from '../middlewares';
import { 
  CreateOpinionRequestBody, CreatePostRequestData, CreateReplyRequestBody, GetPostRequestQuerry
} from './type';
import ProsConsDebatePost from '@models/prosConsDebatePost';
import ProsConsReply from '@models/prosConsReply';
import ProsConsOpinion from '@models/prosConsOpinion';
import User from '@models/user';

const router = express.Router();

// prosConsDebatePost 생성
router.post('', isLoggedIn, upload.single('image'), async (req: Request<any,any,any>, res: Response, next:NextFunction) => {
 try {
  const data:CreatePostRequestData = req.body.data
  const prosConsDebatePost = await ProsConsDebatePost.create({
    method : data.method,
    category : data.category,
    title : data.title,
    description : data.description,
    issue1 : data.issue1,
    article : data.article.toString(),
    imgUrl : req.file !== undefined ? req.file.path : null,
    UserId: req.user!.id,
  })

  res.status(200).send({id: prosConsDebatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

// prosConsDebatePost 가져오기
router.get('', async (req: Request<any,any,any,GetPostRequestQuerry>, res: Response, next:NextFunction) => {
  try {
    console.log(req.query.postId);
    
    const prosConsDebatePostData = await ProsConsDebatePost.findOne({
      where: { 
        id: parseInt(req.query.postId),
      },
      order: [ [ProsConsOpinion, { model:ProsConsReply, as: 'Replys' }, 'createdAt', 'ASC'] ],
      include: [{
        model: ProsConsOpinion,  
        attributes: { exclude: ['UserId', 'ProsConsDebatePostId'] },
        include:[{
            model: User,
            attributes: ['id', 'nickname', 'imgUrl'],
          },{
            model: ProsConsReply,
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
      },{
        model: ProsConsOpinion,
        as: 'OptionAList',
        attributes: ['UserId'],
      },{
        model: ProsConsOpinion,
        as: 'OptionBList',
        attributes: ['UserId'],
      }]
    })
    console.log(prosConsDebatePostData!.id);
    res.status(200).json(prosConsDebatePostData)
  } catch (error) {
    console.log(error);
    next(error)
  }
})

// prosConsOpinion 작성
router.post('/opinion', isLoggedIn, async (req: Request<any,any,CreateOpinionRequestBody>, res: Response, next:NextFunction) => {
  try {
    const post = await ProsConsDebatePost.findOne({
      where: { id: req.body.postId },
    })

    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    console.log(req.params);
    const comment = await ProsConsOpinion.create({
      content: req.body.content,
      selection: req.body.selection,
      ProsConsDebatePostId: req.body.postId,
      UserId: req.user!.id,
    })

    const fullComment = await ProsConsOpinion.findOne({
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

 // ProsConsReply 작성
router.post('/reply', isLoggedIn, async (req: Request<any,any,CreateReplyRequestBody>, res: Response, next:NextFunction) => {
  try {
    const opinion = await ProsConsOpinion.findOne({ where: { id: req.body.opinionId }, })
    if(!opinion) return res.status(403).send('존재하지 않는 의견 입니다.')

    const post = await ProsConsDebatePost.findOne({ where: { id: opinion!.ProsConsDebatePostId }, })
    if(!post) return res.status(403).send('존재하지 않는 게시글입니다.')
    
    console.log(req.params);

    const reply = await ProsConsReply.create({
      content: req.body.content,
      ProsConsOpinionId: req.body.opinionId,
      UserId: req.user!.id,
      TargetId: req.body.targetId
    })

    const fullReply = await ProsConsReply.findOne({
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
