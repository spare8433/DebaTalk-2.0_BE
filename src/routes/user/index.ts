import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import User from "../../models/user";
import { isLoggedIn, isNotLoggedIn } from "@routes/middlewares";
import { Op } from "sequelize";
import {
  CheckCodeRequestBody,
  CheckDuplicateEmailQuerry,
  CheckDuplicateIdQuerry,
  CreateCodeRequestBody,
  FindUserIdParam,
  LoginParam,
  SignUpParam,
  UpdatePasswordRequestBody,
} from "./type";
import AuthCode from "@models/authCode";
import dayjs from "dayjs";
import mailSender from "src/util/mail";

const router = express.Router();
const date = dayjs();

// 회원가입
router.post(
  "/",
  isNotLoggedIn,
  async (
    req: Request<any, any, SignUpParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const exUser = await User.findOne({
        where: {
          userId: req.body.userId,
        },
      });

      if (exUser) {
        res.status(403).send("이미 사용중인 아이디 입니다.");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      const newUser = User.create({
        nickname: req.body.nickname,
        userId: req.body.userId,
        email: req.body.email,
        password: hashedPassword,
      });
      return res.status(200).send("ok");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 로그인
router.post(
  "/login",
  isNotLoggedIn,
  async (
    req: Request<any, any, LoginParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      passport.authenticate(
        "local",
        (err: Error, user: User, info: { message: string }) => {
          if (err) {
            return next(err);
          }
          if (info) {
            return res.status(401).send(info.message);
          }
          req.logIn(user, async (loginErr: Error) => {
            if (loginErr) {
              console.log("로그인 에러", loginErr);
              next(loginErr);
            }

            const sucessLoginUser = await User.findOne({
              where: {
                userId: req.body.userId,
              },
              attributes: {
                exclude: ["password"],
              },
            });
            return res.status(200).json(sucessLoginUser);
          });
        }
      )(req, res, next);

      console.log("end");
      console.log(req.isAuthenticated());
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

// 로그아웃
router.delete("/logout", isLoggedIn, (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
  });
  return res.send("ok");
});

// 클라이언 쿠키 초기화
router.post("/clear-cookie", (req, res, next) => {
  res.clearCookie("connect.sid", {
    path: "/",
    domain:
      process.env.NODE_ENV === "production" ? "debatalk.kro.kr" : "localhost",
  });
  return res.send("ok");
});

// 본인 정보 가져오기
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json(null);

    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ["password"],
      },
    });

    console.log(" 유저 데이터 :", fullUserWithoutPassword);

    if (fullUserWithoutPassword) {
      res.status(200).json(fullUserWithoutPassword);
    } else res.status(404).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 아이디 찾기
router.post(
  "/find-id",
  isNotLoggedIn,
  async (
    req: Request<any, any, FindUserIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const searchedUser = await User.findOne({
        where: { email: req.body.email },
        attributes: ["id", "userId", "createdAt"],
      });

      if (!searchedUser)
        res.status(404).json({ message: "존재하지않는 사용자입니다." });

      res.status(200).send(searchedUser);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// 비밀번호 재설정 인증 코드 발송
router.post(
  "/send-authcode",
  isNotLoggedIn,
  async (
    req: Request<any, any, CreateCodeRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const MAX_REQUEST_NUMBER = 3;
    function createAuthCode(length: number): string {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
      }

      return result;
    }

    try {
      let where = {};
      if (req.body.email) where = { email: req.body.email };
      if (req.body.userId) where = { userId: req.body.userId };

      // 사용자 탐색
      const serarchUser = await User.findOne({
        where: where,
        attributes: ["id", "email"],
      });

      if (!serarchUser) {
        res.status(404).json({ message: "존재하지않는 사용자입니다." });
      }

      // 요청횟수 카운팅
      const requestCount = await AuthCode.count({
        where: {
          UserId: serarchUser!.id,
          expiration_date: { [Op.gt]: date.subtract(30, "m") },
        },
      });

      if (requestCount >= MAX_REQUEST_NUMBER) {
        return res
          .status(400)
          .json({ message: "최대 요청 횟수를 넘었습니다." });
      }

      // 인증 코드 생성
      const authCode = await AuthCode.create(
        {
          code: createAuthCode(6),
          expiration_date: date.add(30, "m"),
          UserId: serarchUser!.id,
        },
        {
          returning: true,
        }
      );

      mailSender.sendGmail({
        toEmail: serarchUser!.email,
        subject: "[ 디베이톡 ] 인증 코드 발급",
        text: `인증 코드는 ${authCode.code} 입니다.`,
      });

      return res.status(200).json({ id: serarchUser!.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 비밀번호 재설정 인증 코드 확인
router.post(
  "/check-authcode",
  isNotLoggedIn,
  async (
    req: Request<any, any, CheckCodeRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // AuthCode 확인
      const serarchAuthCode = await AuthCode.findOne({
        where: {
          expiration_date: { [Op.gt]: date.subtract(30, "m") },
          UserId: req.body.UserId,
        },
        attributes: ["code"],
        order: [["expiration_date", "DESC"]],
      });

      if (!serarchAuthCode) {
        return res
          .status(404)
          .json({ message: "유효한 인증코드가 존재하지 않습니다" });
      }

      if (serarchAuthCode!.code !== req.body.code) {
        return res
          .status(400)
          .json({ message: "인증코드가 일치하지 않습니다." });
      }

      return res.status(200).send("ok");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 비밀번호 재설정
router.patch(
  "/update-password",
  isNotLoggedIn,
  async (
    req: Request<any, any, UpdatePasswordRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 사용자 탐색
      const serarchUser = await User.findOne({
        where: { id: req.body.UserId },
        attributes: ["id", "password"],
      });

      if (!serarchUser) {
        return res.status(404).json({ message: "존재하지않는 사용자입니다." });
      }

      bcrypt.compare(
        req.body.password,
        serarchUser!.password,
        async (cmpErr, cmpRes) => {
          if (cmpRes) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 12);
            await User.update(
              { password: newPassword },
              {
                where: { id: req.body.UserId },
                returning: true, // 업데이트된 레코드를 반환할지 여부
              }
            );
            console.log();
            return res.status(200).send("ok");
          } else {
            return res
              .status(400)
              .json({ message: "비밀번호가 동일하지 않습니다." });
          }
        }
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 중복 아이디 조회
router.get(
  "/check-duplicate-id",
  isNotLoggedIn,
  async (
    req: Request<any, any, any, CheckDuplicateIdQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const duplicatedIdUser = await User.findOne({
        where: { userId: req.query.userId },
        attributes: ["id"],
      });

      if (duplicatedIdUser) {
        return res.status(404).json({ message: "중복된 아이디 입니다." });
      }

      return res.status(200).send("ok");
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// 중복 이메일 조회
router.get(
  "/check-duplicate-email",
  isNotLoggedIn,
  async (
    req: Request<any, any, any, CheckDuplicateEmailQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const duplicatedEmailUser = await User.findOne({
        where: { userId: req.query.email },
        attributes: ["id"],
      });

      if (duplicatedEmailUser) {
        return res.status(404).json({ message: "중복된 이메일 입니다." });
      }

      return res.status(200).send("ok");
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
