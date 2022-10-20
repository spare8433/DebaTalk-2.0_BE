import express from 'express'
import expressSession  from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'
import hpp from 'hpp'
import helmet from 'helmet'
import passport from 'passport'

import userRotuer from './routes/user'
import debatePostsRotuer from './routes/debatePosts'
import debatePostRotuer from './routes/debatePost'

import balanceDebatePost from './routes/balanceDebatePost'
import prosConsDebatePost from './routes/prosConsDebatePost'
import issueDebatePost from './routes/issueDebatePost'


import { sequelize } from './models'
import passportConfig from './passport'

const app = express()

dotenv.config()

passportConfig();

sequelize.sync()
  .then(() => {
    console.log('db 연결 성공')
  }).catch(console.error)


app.use('/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json()) // json 데이터 처리
app.use(express.urlencoded({ extended: true })) // form 관련 데이터처리
app.use(cookieParser(process.env.COOKIE_SECRET))


app.use(cors({
  // origin: ['http://localhost:3000', `http://${process.env.FRONT_URL}`],
  origin: true,
  credentials: true,  // 쿠키 공유
}))

app.use(expressSession({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET!,
  cookie:{
    httpOnly:true,
    secure: false,
    // domain: (process.env.NODE_ENV) === 'production' ? '.spare8433.kro.kr' : 'http://localhost:3000'
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('hello express')
})

app.use('/balance-debate-post', balanceDebatePost)
app.use('/proscons-debate-post', prosConsDebatePost)
app.use('/issue-debate-post', issueDebatePost)
app.use('/debate-posts', debatePostsRotuer)
app.use('/debate-post', debatePostRotuer)
app.use('/user', userRotuer)
// app.use('/hashtag', hashtagRotuer)

if (process.env.NODE_ENV  === 'production') {
  app.use(morgan('combined'))
  app.use(hpp())
  app.use(helmet())
  app.listen(80, () => {
    console.log('실 서버 실행중');
  })
} else {
  app.use(morgan('dev'))
  app.listen(3065, () => {
    console.log('개발 서버 실행중');
  })
}
