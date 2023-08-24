import express, { NextFunction, Request, Response } from "express";
import ProsConsDebatePost from "@models/prosConsDebatePost";
import { Op } from "sequelize";
import { GetPostsRequestBody } from "./type";
import ProsConsOpinion from "@models/prosConsOpinion";

const router = express.Router();

// ProsConsDebatePosts 가져오기
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

      const prosConsDebatePostsCount = await ProsConsDebatePost.count({
        where,
        attributes: ["id"],
      });

      const prosConsDebatePostsData = await ProsConsDebatePost.findAll({
        limit,
        offset,
        where,
        order: [[key, order]],
        attributes: {
          // include: [
          //   [
          //     sequelize.fn("COUNT", sequelize.col("ProsConsOpinions.id")),
          //     "opinionCount",
          //   ],
          //   [
          //     sequelize.fn("COUNT", sequelize.col("OptionAgreeList.id")),
          //     "agreeListCount",
          //   ],
          //   [
          //     sequelize.fn("COUNT", sequelize.col("OptionOpposeList.id")),
          //     "opposeListCount",
          //   ],
          // ],
          exclude: ["UserId", "issue1", "issue2", "article"],
        },
        include: [
          {
            model: ProsConsOpinion,
            attributes: ["id"],
            duplicating: false,
          },
          {
            model: ProsConsOpinion,
            as: "OptionAgreeList",
            attributes: ["id"],
            duplicating: false,
          },
          {
            model: ProsConsOpinion,
            as: "OptionOpposeList",
            attributes: ["id"],
            duplicating: false,
          },
        ],
        // group: ["ProsConsDebatePost.id"],
      });
      prosConsDebatePostsData.forEach((post) => {
        post.dataValues.opinionCount = post.ProsConsOpinions.length ?? 0;
        post.dataValues.agreeListCount = post.OptionAgreeList.length ?? 0;
        post.dataValues.opposeListCount = post.OptionOpposeList.length ?? 0;
      });

      return res.status(200).json({
        data: prosConsDebatePostsData,
        count: prosConsDebatePostsCount,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
