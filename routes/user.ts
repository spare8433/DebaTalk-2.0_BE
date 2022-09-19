import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';

const router = express.Router();

router.get('/', async (req, res, next) => {
 try {
  const test = await User.findAll();
  res.status(200).json(test)
 } catch (error) {
  console.log(error);
 }
})
// import { isLoggedIn, isNotLoggedIn } from './middlewares';

// // 본인 정보 가져오기
// router.get('/', async (req, res, next) => {
//   try {
//     if (!req.user) return res.status(401).json(null)
//     const fullUserWithoutPassword = await User.findOne({
//       where: { id: req.user.id },
//       attributes: {
//         exclued: ['password']
//       },
//       include: [{
//         model: Post,
//         attributes: ['id'],
//       }, {
//         model: User,
//         as: 'Followings',
//         attributes: ['id'],
//       }, {  
//         model: User,
//         as: 'Followers',
//         attributes: ['id'],
//       }]
//     })

//     if(fullUserWithoutPassword) {
//       res.status(200).json(fullUserWithoutPassword)
//     } else
//       res.status(404).json(null)
//   } catch (error) {
//     console.error(error);
//     next(error)
//   }
// })
export default router;