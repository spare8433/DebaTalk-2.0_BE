import express, { NextFunction, Request, Response } from "express";
import { S3upload } from "../../util/multer";
import { isLoggedIn } from "../middlewares";
import {
  CreateOpinionRequestBody,
  CreatePostRequestData,
  CreateReplyRequestBody,
  GetPostRequestQuerry,
} from "./type";
import BalanceDebatePost from "@models/balanceDebatePost";
import BalanceReply from "@models/balanceReply";
import BalanceOpinion from "@models/balanceOpinion";
import User from "@models/user";

const router = express.Router();

// balanceDebatePost 생성
router.post(
  "",
  isLoggedIn,
  S3upload.single("image"),
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    try {
      const data: CreatePostRequestData = JSON.parse(req.body.data);
      const balanceDebatePost = await BalanceDebatePost.create({
        category: data.category,
        title: data.title,
        optionA: data.optionA,
        optionB: data.optionB,
        description: data.description,
        issue1: data.issue1,
        issue2: data.issue2,
        article: data.article?.toString(),
        imgUrl: req.file && req.file.location,
        UserId: req.user?.id,
      });

      return res.status(200).send({ id: balanceDebatePost.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// balanceDebatePost 가져오기
router.get(
  "",
  async (
    req: Request<any, any, any, GetPostRequestQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query.postId);

      const balanceDebatePostData = await BalanceDebatePost.findOne({
        where: {
          id: parseInt(req.query.postId),
        },
        attributes: {
          exclude: ["UserId"],
        },
        include: [
          {
            model: BalanceOpinion,
            attributes: { exclude: ["UserId", "BalanceDebatePostId"] },
            order: ["createdAt", "Desc"],
            include: [
              {
                model: User,
                attributes: ["id", "userId", "nickname", "imgUrl"],
              },
              {
                model: BalanceReply,
                as: "Replys",
                attributes: { exclude: ["UserId", "TargetId"] },
                order: ["createdAt", "Desc"],
                include: [
                  {
                    model: User,
                    attributes: ["id", "userId", "nickname", "imgUrl"],
                  },
                  {
                    model: User,
                    as: "Target",
                    attributes: ["id", "userId", "nickname", "imgUrl"],
                  },
                ],
              },
            ],
          },
          {
            model: BalanceOpinion,
            as: "OptionAList",
            attributes: ["id"],
          },
          {
            model: BalanceOpinion,
            as: "OptionBList",
            attributes: ["id"],
          },
        ],
      });
      if (!balanceDebatePostData)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      balanceDebatePostData!.dataValues.opinionCount =
        balanceDebatePostData?.BalanceOpinions.length ?? 0;

      balanceDebatePostData!.dataValues.optionAListCount =
        balanceDebatePostData?.OptionAList.length ?? 0;

      balanceDebatePostData!.dataValues.optionBListCount =
        balanceDebatePostData?.OptionBList.length ?? 0;

      // 조회수 증가
      balanceDebatePostData!.increment("hits");

      return res.status(200).json(balanceDebatePostData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// balanceOpinion 작성
router.post(
  "/opinion",
  isLoggedIn,
  async (
    req: Request<any, any, CreateOpinionRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 게시물 확인
      const post = await BalanceDebatePost.findOne({
        where: { id: req.body.postId },
      });

      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      // 의견 조회 및 중복 확인
      const searchedOpinion = await BalanceOpinion.findOne({
        where: { BalanceDebatePostId: req.body.postId, UserId: req.user?.id },
      });

      if (searchedOpinion)
        return res.status(400).json({ message: "이미 의견을 작성하셨습니다." });

      // 의견 생성
      const comment = await BalanceOpinion.create({
        content: req.body.content,
        selection: req.body.selection,
        BalanceDebatePostId: req.body.postId,
        UserId: req.user?.id,
      });

      // 최종 의견 데이터 조회
      const fullOpinion = await BalanceOpinion.findOne({
        where: { id: comment.id },
        attributes: { exclude: ["UserId"] },
        include: [
          {
            model: User,
            attributes: ["id", "userId", "nickname"],
          },
        ],
      });

      if (!fullOpinion)
        return res.status(404).json({ message: "존재하지 않는 의견입니다" });

      return res.status(201).json(fullOpinion);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// balanceReply 작성
router.post(
  "/reply",
  isLoggedIn,
  async (
    req: Request<any, any, CreateReplyRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const opinion = await BalanceOpinion.findOne({
        where: { id: req.body.opinionId },
      });
      if (!opinion)
        return res.status(404).json({ message: "존재하지 않는 의견입니다" });

      const post = await BalanceDebatePost.findOne({
        where: { id: opinion!.BalanceDebatePostId },
      });
      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      console.log(req.params);

      const reply = await BalanceReply.create({
        content: req.body.content,
        BalanceOpinionId: req.body.opinionId,
        UserId: req.user?.id,
        TargetId: req.body.targetId,
      });

      const fullReply = await BalanceReply.findOne({
        where: { id: reply.id },
        attributes: { exclude: ["UserId"] },
        include: [
          {
            model: User,
            attributes: ["id", "userId", "nickname", "imgUrl"],
          },
        ],
      });
      if (!fullReply)
        return res.status(404).json({ message: "존재하지 않는 댓글입니다" });

      return res.status(201).json(fullReply);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
