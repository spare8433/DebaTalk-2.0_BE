import express, { NextFunction, Request, Response } from "express";
import BalanceDebatePost from "@models/balanceDebatePost";
import { Op } from "sequelize";
import { GetPostsRequestBody } from "./type";
import BalanceOpinion from "@models/balanceOpinion";

const router = express.Router();

// balanceDebatePosts 가져오기
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
          { issue2: { [Op.like]: `%${searchText}%` } },
        ],
      };

      const balanceDebatePostsCount = await BalanceDebatePost.count({
        where,
        attributes: ["id"],
      });

      const balanceDebatePostsData = await BalanceDebatePost.findAll({
        limit,
        offset,
        where,
        order: [[key, order]],
        attributes: {
          // include: [
          //   [
          //     sequelize.fn("COUNT", sequelize.col("BalanceOpinions.id")),
          //     "opinionCount",
          //   ],
          //   [
          //     sequelize.fn("COUNT", sequelize.col("OptionAList.id")),
          //     "optionAListCount",
          //   ],
          //   [
          //     sequelize.fn("COUNT", sequelize.col("OptionBList.id")),
          //     "optionBListCount",
          //   ],
          // ],
          exclude: ["UserId", "issue1", "issue2", "article"],
        },
        include: [
          {
            model: BalanceOpinion,
            attributes: ["id"],
            duplicating: false,
          },
          {
            model: BalanceOpinion,
            as: "OptionAList",
            attributes: ["id"],
            duplicating: false,
          },
          {
            model: BalanceOpinion,
            as: "OptionBList",
            attributes: ["id"],
            duplicating: false,
          },
        ],
        // group: ["BalanceDebatePost.id"],
      });

      balanceDebatePostsData.forEach((post) => {
        post.dataValues.opinionCount = post.BalanceOpinions.length ?? 0;
        post.dataValues.optionAListCount = post.OptionAList.length ?? 0;
        post.dataValues.optionBListCount = post.OptionBList.length ?? 0;
      });

      return res
        .status(200)
        .json({ data: balanceDebatePostsData, count: balanceDebatePostsCount });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
