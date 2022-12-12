import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';
import { isLoggedIn, isNotLoggedIn } from './middlewares';
import Opinion from '../models/opinion';
import DebatePost from '../models/debatePost';
import { Model } from 'sequelize';
import Comment from '../models/comment';
import CommunityPostLike from '../models/communityPostLike';
import Reply from '../models/reply';
import CommunityPost from '../models/communityPost';
import BalanceOpinion from '../models/balanceOpinion';
import BalanceReply from '../models/balanceReply';

const router = express.Router();

// 회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        userId:req.body.userId
      }
    })

    if(exUser) {
      res.status(403).send('이미 사용중인 아이디 입니다.')
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      userEmail: req.body.userEmail,
      password: hashedPassword,
    })
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    next(error)
  }
})

// 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
  try {
    passport.authenticate('local', (err:Error, user:User, info:{ message: string}) => {
      if(err) {
        return next(err)
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      req.logIn(user, async (loginErr: Error) => {
        if (loginErr) {
          console.log('로그인 에러',loginErr);
          next(loginErr)
        }

        const sucessLoginUser = await User.findOne({
          where: {
            userId:req.body.userId,
          },
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model:Opinion,
              as:'LikedOpinions',
              attributes: ['id']
            }, {
              model:Comment,
              as:'LikedComments',
              attributes: ['id']
            },{
              model:Reply,
              as:'LikedReplys',
              attributes: ['id']
            },{
              model:CommunityPost,
              as:'LikedCommunityPosts',
              attributes: ['id']
            }
          ]
        })
        return res.status(200).json(sucessLoginUser)
      })
    })(req, res, next)
    
    console.log('end');
    console.log(req.isAuthenticated());

  } catch (error) {
    console.log(error)
    return next(error)
  }
})

// 로그아웃
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logOut((err)=>{
    if(err) return next(err)
  })
  req.session.destroy((err)=>{
    if(err) return next(err)
  })
  res.send('ok')
})

// 본인 정보 가져오기
router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json(null)
    
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: BalanceOpinion,
        as: 'BalanceOpinions',
        attributes: ['id'],
      }, {
        model: BalanceReply,
        as: 'BalanceReplys',
        attributes: ['id'],
      }]
    })

    console.log(" 유저 데이터 :",fullUserWithoutPassword);
    

    if(fullUserWithoutPassword) {
      res.status(200).json(fullUserWithoutPassword)
    } else
      res.status(404).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
})
export default router;