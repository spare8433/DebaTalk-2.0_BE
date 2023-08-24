import express, { NextFunction, Request, Response } from "express";
import { S3upload } from "../../util/multer";
import { isLoggedIn } from "../middlewares";
import {
  CreateOpinionRequestBody,
  CreatePostRequestData,
  CreateReplyRequestBody,
  GetPostRequestQuerry,
} from "./type";
import DebateTopicReply from "@models/debateTopicReply";
import DebateTopicOpinion from "@models/debateTopicOpinion";
import User from "@models/user";
import DebateTopicPost from "@models/debateTopicPost";

const router = express.Router();

// debateTopicPost 생성
router.post(
  "",
  isLoggedIn,
  S3upload.single("image"),
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    try {
      const data: CreatePostRequestData = JSON.parse(req.body.data);
      const debateTopicPost = await DebateTopicPost.create({
        category: data.category,
        title: data.title,
        description: data.description,
        imgUrl: req.file && req.file.location,
        UserId: req.user?.id,
      });

      return res.status(200).send({ id: debateTopicPost.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// debateTopicPost 가져오기
router.get(
  "",
  async (
    req: Request<any, any, any, GetPostRequestQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const debateTopicPost = await DebateTopicPost.findOne({
        where: {
          id: parseInt(req.query.postId),
        },
        include: [
          {
            model: DebateTopicOpinion,
            attributes: { exclude: ["UserId", "DebateTopicPostId"] },
            order: ["createdAt", "Desc"],
            include: [
              {
                model: User,
                attributes: ["id", "userId", "nickname", "imgUrl"],
              },
              {
                model: DebateTopicReply,
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
      if (!debateTopicPost)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      // 조회수 증가
      debateTopicPost!.increment("hits");

      return res.status(200).json(debateTopicPost);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// debateTopicOpinion 작성
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
      const post = await DebateTopicPost.findOne({
        where: { id: req.body.postId },
      });

      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      // 의견 조회 및 중복 확인
      const searchedOpinion = await DebateTopicOpinion.findOne({
        where: {
          DebateTopicDebatePostId: req.body.postId,
          UserId: req.user?.id,
        },
      });

      if (searchedOpinion)
        return res.status(400).json({ message: "이미 의견을 작성하셨습니다." });

      // 의견 생성
      const comment = await DebateTopicOpinion.create({
        content: req.body.content,
        DebateTopicPostId: req.body.postId,
        UserId: req.user?.id,
      });

      // 최종 의견 데이터 조회
      const fullOpinion = await DebateTopicOpinion.findOne({
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

// debateTopicReply 작성
router.post(
  "/reply",
  isLoggedIn,
  async (
    req: Request<any, any, CreateReplyRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const opinion = await DebateTopicOpinion.findOne({
        where: { id: req.body.opinionId },
      });
      if (!opinion)
        return res.status(404).json({ message: "존재하지 않는 의견입니다" });

      const post = await DebateTopicPost.findOne({
        where: { id: opinion!.DebateTopicPostId },
      });
      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      console.log(req.params);

      const reply = await DebateTopicReply.create({
        content: req.body.content,
        DebateTopicOpinionId: req.body.opinionId,
        UserId: req.user?.id,
        TargetId: req.body.targetId,
      });

      const fullReply = await DebateTopicReply.findOne({
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
