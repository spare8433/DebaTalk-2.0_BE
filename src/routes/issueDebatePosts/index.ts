import express, { NextFunction, Request, Response } from "express";
import IssueDebatePost from "@models/issueDebatePost";
import { Op } from "sequelize";
import { GetPostsRequestBody } from "./type";
import IssueOpinion from "@models/issueOpinion";

const router = express.Router();

// IssueDebatePosts 가져오기
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
          { issue1: { [Op.like]: `%${searchText}%` } },
        ],
      };

      const issueDebatePostsCount = await IssueDebatePost.count({
        where,
        attributes: ["id"],
      });

      const issueDebatePostsData = await IssueDebatePost.findAll({
        limit,
        offset,
        where,
        order: [[key, order]],
        attributes: {
          // include: [
          //   [
          //     sequelize.fn("COUNT", sequelize.col("IssueOpinions.id")),
          //     "opinionCount",
          //   ],
          //   [
          //     sequelize.fn("AVG", sequelize.col("IssueOpinions.score")),
          //     "opinionAvgScore",
          //   ],
          // ],
          exclude: ["UserId", "issue1", "article"],
        },
        include: [
          {
            model: IssueOpinion,
            attributes: ["id", "score"],
          },
        ],
        // group: ["IssueDebatePost.id"],
      });

      issueDebatePostsData.forEach((post) => {
        const opinionCount = post.IssueOpinions.length ?? 0;
        const totalOpinionScore = post.IssueOpinions.reduce(
          (count, res) => count + res.score,
          0
        );
        post.dataValues.opinionCount = opinionCount;
        post.dataValues.opinionAvgScore =
          opinionCount > 0
            ? Number((totalOpinionScore / opinionCount).toFixed(2))
            : null;
      });

      return res
        .status(200)
        .json({ data: issueDebatePostsData, count: issueDebatePostsCount });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
