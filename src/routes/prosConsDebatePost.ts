import express from 'express';
import ProsConsDebatePost from '../models/prosConsDebatePost';
import { upload } from '../util/multer';

const router = express.Router();

// prosConsDebatePost 생성
router.post('', upload.single('image') ,async (req, res, next) => {
 try {
  type ResponseData = {
    method: string,
    category: string,
    title:string,
    description:string,
    issue1:string,
    issue2:string,
    article:string[]
  }
  const data:ResponseData = JSON.parse(req.body.data)
  const prosConsDebatePost = await ProsConsDebatePost.create({
    method : data.method,
    category : data.category,
    title : data.title,
    description : data.description,
    issue1 : data.issue1,
    issue2 : data.issue2,
    article : data.article.toString(),
    imgUrl : req.file !== undefined ? req.file.path : null
  })

  res.status(200).send({id: prosConsDebatePost.id})
 } catch (error) {
  console.log(error);
  next(error)
 } 
})

export default router;
