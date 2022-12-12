import { Request, Response, NextFunction } from 'express';

export const isLoggedIn = (req:Request, res:Response, next:NextFunction) => {
  console.log('[isLoggedIn] 로그인 여부 :', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).send('로그인이 필요합니다')
  }
}

export const isNotLoggedIn = (req:Request, res:Response, next:NextFunction) => {
  console.log('[isNotLoggedIn] 로그인 여부 :', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    next()
  } else {
    res.status(401).send('로그인 하지 않은 사용자만 접근 가능합니다')
  }
}