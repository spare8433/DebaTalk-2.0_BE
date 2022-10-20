import express from 'express';
import IssueDebatePost from '../models/issueDebatePost';
import { upload } from '../util/multer';

const router = express.Router();

// issueDebatePost 생성
router.post('', upload.single('image') ,async (req, res, next) => {
 try {
  type ResponseData = {
    method: string,
    category: string,
    title:string,
    description:string,
    issue1:string,
    article:string[]
  }
  const data:ResponseData = JSON.parse(req.body.data)
  const issueDebatePost = await IssueDebatePost.create({
    method : data.method,
    category : data.category,
    title : data.title,
    description : data.description,
    issue1 : data.issue1,
    article : data.article.toString(),
    imgUrl : req.file !== undefined ? req.file.path : null
  })

  res.status(200).send({id: issueDebatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

export default router;
