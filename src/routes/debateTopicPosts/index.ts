import express, { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { GetPostsRequestBody } from "./type";
import User from "@models/user";
import DebateTopicPost from "@models/debateTopicPost";

const router = express.Router();

// debateTopicPosts 가져오기
router.post(
  "",
  async (
    req: Request<any, any, GetPostsRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.body.limit ?? 12;
      const order = req.body.order ?? "DESC";
      const key = req.body.key ?? "createdAt";
      const offset = req.body.page ? (req.body.page - 1) * limit : 0;
      const searchText =
        typeof req.body.searchText === "string" ? req.body.searchText : "";
      let where: { [index: string]: string } = {};

      if (req.body.category && req.body.category !== "전체")
        where["category"] = req.body.category;

      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${searchText}%` } },
          { description: { [Op.like]: `%${searchText}%` } },
        ],
      };

      const debateTopicPostsCount = await DebateTopicPost.count({
        where,
        attributes: ["id"],
      });

      const debateTopicPostsData = await DebateTopicPost.findAll({
        limit,
        offset,
        where,
        order: [[key, order]],
        attributes: { exclude: ["UserId"] },
        include: [
          {
            model: User,
            attributes: ["id", "userId", "nickname", "level"],
          },
          {
            model: User,
            as: "Likers",
            attributes: ["id", "userId"],
          },
        ],
      });

      return res
        .status(200)
        .json({ data: debateTopicPostsData, count: debateTopicPostsCount });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
