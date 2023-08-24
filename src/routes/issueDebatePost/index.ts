import express, { NextFunction, Request, Response } from "express";
import IssueDebatePost from "@models/issueDebatePost";
import IssueOpinion from "@models/issueOpinion";
import IssueReply from "@models/issueReply";
import User from "@models/user";
import { S3upload } from "../../util/multer";
import { isLoggedIn } from "../middlewares";
import {
  CreateOpinionRequestBody,
  CreatePostRequestData,
  CreateReplyRequestBody,
  GetPostRequestQuerry,
} from "./type";

const router = express.Router();

// IssueDebatePost 생성
router.post(
  "",
  isLoggedIn,
  S3upload.single("image"),
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    try {
      const data: CreatePostRequestData = JSON.parse(req.body.data);
      const issueDebatePost = await IssueDebatePost.create({
        category: data.category,
        title: data.title,
        description: data.description,
        issue1: data.issue1,
        article: data.article?.toString(),
        imgUrl: req.file && req.file.location,
        UserId: req.user?.id,
      });

      return res.status(200).send({ id: issueDebatePost.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// IssueDebatePost 가져오기
router.get(
  "",
  async (
    req: Request<any, any, any, GetPostRequestQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query.postId);

      const issueDebatePostData = await IssueDebatePost.findOne({
        where: {
          id: parseInt(req.query.postId),
        },
        attributes: {
          exclude: ["UserId"],
        },
        include: [
          {
            model: IssueOpinion,
            attributes: { exclude: ["UserId", "IssueDebatePostId"] },
            order: ["createdAt", "Desc"],
            include: [
              {
                model: User,
                attributes: ["id", "userId", "nickname", "imgUrl"],
              },
              {
                model: IssueReply,
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
        ],
      });

      if (!issueDebatePostData)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      const opinionCount = issueDebatePostData?.IssueOpinions.length ?? 0;
      const totalOpinionScore = issueDebatePostData!.IssueOpinions.reduce(
        (count, res) => count + res.score,
        0
      );

      issueDebatePostData!.dataValues.opinionCount = opinionCount;
      issueDebatePostData!.dataValues.opinionAvgScore = Number(
        (totalOpinionScore / opinionCount).toFixed(2)
      );

      // 조회수 증가
      issueDebatePostData!.increment("hits");

      return res.status(200).json(issueDebatePostData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// IssueOpinion 작성
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
      const post = await IssueDebatePost.findOne({
        where: { id: req.body.postId },
      });

      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      // 의견 조회 및 중복 확인
      const searchedOpinion = await IssueOpinion.findOne({
        where: { IssueDebatePostId: req.body.postId, UserId: req.user?.id },
      });

      if (searchedOpinion)
        return res.status(400).json({ message: "이미 의견을 작성하셨습니다." });

      // 의견 생성
      const comment = await IssueOpinion.create({
        content: req.body.content,
        score: req.body.score,
        IssueDebatePostId: req.body.postId,
        UserId: req.user?.id,
      });

      // 최종 의견 데이터 조회
      const fullOpinion = await IssueOpinion.findOne({
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

// IssueReply 작성
router.post(
  "/reply",
  isLoggedIn,
  async (
    req: Request<any, any, CreateReplyRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const opinion = await IssueOpinion.findOne({
        where: { id: req.body.opinionId },
      });
      if (!opinion)
        return res.status(404).json({ message: "존재하지 않는 의견입니다" });

      const post = await IssueDebatePost.findOne({
        where: { id: opinion!.IssueDebatePostId },
      });
      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      console.log(req.params);

      const reply = await IssueReply.create({
        content: req.body.content,
        IssueOpinionId: req.body.opinionId,
        UserId: req.user?.id,
        TargetId: req.body.targetId,
      });

      const fullReply = await IssueReply.findOne({
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
