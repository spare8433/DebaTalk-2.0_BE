import express, { NextFunction, Request, Response } from "express";
import { S3upload } from "../../util/multer";
import { isLoggedIn } from "../middlewares";
import {
  CreateOpinionRequestBody,
  CreatePostRequestData,
  CreateReplyRequestBody,
  GetPostRequestQuerry,
} from "./type";
import ProsConsDebatePost from "@models/prosConsDebatePost";
import ProsConsReply from "@models/prosConsReply";
import ProsConsOpinion from "@models/prosConsOpinion";
import User from "@models/user";

const router = express.Router();

// prosConsDebatePost 생성
router.post(
  "",
  isLoggedIn,
  S3upload.single("image"),
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    try {
      const data: CreatePostRequestData = JSON.parse(req.body.data);
      const prosConsDebatePost = await ProsConsDebatePost.create({
        category: data.category,
        title: data.title,
        description: data.description,
        issue1: data.issue1,
        issue2: data.issue2,
        article: data.article?.toString(),
        imgUrl: req.file && req.file.location,
        UserId: req.user?.id,
      });

      return res.status(200).send({ id: prosConsDebatePost.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// prosConsDebatePost 가져오기
router.get(
  "",
  async (
    req: Request<any, any, any, GetPostRequestQuerry>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const prosConsDebatePostData = await ProsConsDebatePost.findOne({
        where: {
          id: parseInt(req.query.postId),
        },
        attributes: {
          exclude: ["UserId"],
        },
        include: [
          {
            model: ProsConsOpinion,
            attributes: { exclude: ["UserId", "ProsConsDebatePostId"] },
            order: ["createdAt", "Desc"],
            include: [
              {
                model: User,
                attributes: ["id", "userId", "nickname", "imgUrl"],
              },
              {
                model: ProsConsReply,
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
            model: ProsConsOpinion,
            as: "OptionAgreeList",
            attributes: ["id"],
          },
          {
            model: ProsConsOpinion,
            as: "OptionOpposeList",
            attributes: ["id"],
          },
        ],
      });

      if (!prosConsDebatePostData)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      prosConsDebatePostData!.dataValues.opinionCount =
        prosConsDebatePostData?.ProsConsOpinions.length ?? 0;

      prosConsDebatePostData!.dataValues.agreeListCount =
        prosConsDebatePostData?.OptionAgreeList.length ?? 0;

      prosConsDebatePostData!.dataValues.opposeListCount =
        prosConsDebatePostData?.OptionOpposeList.length ?? 0;

      // 조회수 증가
      prosConsDebatePostData!.increment("hits");

      return res.status(200).json(prosConsDebatePostData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// prosConsOpinion 작성
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
      const post = await ProsConsDebatePost.findOne({
        where: { id: req.body.postId },
      });

      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시물입니다" });

      // 의견 조회 및 중복 확인
      const searchedOpinion = await ProsConsOpinion.findOne({
        where: {
          ProsConsDebatePostId: req.body.postId,
          UserId: req.user?.id,
        },
      });

      if (searchedOpinion)
        return res.status(400).json({ message: "이미 의견을 작성하셨습니다." });

      // 의견 생성
      const comment = await ProsConsOpinion.create({
        content: req.body.content,
        selection: req.body.selection,
        ProsConsDebatePostId: req.body.postId,
        UserId: req.user?.id,
      });

      // 최종 의견 데이터 조회
      const fullOpinion = await ProsConsOpinion.findOne({
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

// ProsConsReply 작성
router.post(
  "/reply",
  isLoggedIn,
  async (
    req: Request<any, any, CreateReplyRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const opinion = await ProsConsOpinion.findOne({
        where: { id: req.body.opinionId },
      });
      if (!opinion)
        return res.status(404).json({ message: "존재하지 않는 의견입니다" });

      const post = await ProsConsDebatePost.findOne({
        where: { id: opinion!.ProsConsDebatePostId },
      });
      if (!post)
        return res.status(404).json({ message: "존재하지 않는 게시글입니다" });

      console.log(req.params);

      const reply = await ProsConsReply.create({
        content: req.body.content,
        ProsConsOpinionId: req.body.opinionId,
        UserId: req.user?.id,
        TargetId: req.body.targetId,
      });

      const fullReply = await ProsConsReply.findOne({
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
