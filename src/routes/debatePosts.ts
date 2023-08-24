import express from "express";
import dayjs from "dayjs";

import { FindOptions, Model, Op, Sequelize, WhereOptions } from "sequelize";
import BalanceDebatePost from "@models/balanceDebatePost";
import IssueDebatePost from "@models/issueDebatePost";
import ProsConsDebatePost from "@models/prosConsDebatePost";
import IssueOpinion from "@models/issueOpinion";
import ProsConsOpinion from "@models/prosConsOpinion";
import BalanceOpinion from "@models/balanceOpinion";
import User from "@models/user";
import ProsConsReply from "@models/prosConsReply";
import BalanceReply from "@models/balanceReply";
import IssueReply from "@models/issueReply";
import sequelize from "@models/sequelize";
import DebateTopicPost from "@models/debateTopicPost";
import DebateTopicOpinion from "@models/debateTopicOpinion";

const router = express.Router();
const date = dayjs();

// 메인 craousel 키워드
router.get("/keywords", async (req, res, next) => {
  try {
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 5;
    const commonOption: FindOptions = {
      limit: limit,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "category"],
    };
    const balanceKeyword = await BalanceDebatePost.findAll({ ...commonOption });
    const issueKeyword = await IssueDebatePost.findAll({ ...commonOption });
    const prosConsKeyword = await ProsConsDebatePost.findAll({
      ...commonOption,
    });

    const allKeywordsData = { balanceKeyword, issueKeyword, prosConsKeyword };

    return res.status(200).json(allKeywordsData);
  } catch (error) {
    console.log(error);
  }
});

// 메인페이지 카테고리별 노출되는 게시물
router.get("/hot-debate-posts", async (req, res, next) => {
  try {
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 4;
    const commonOption: FindOptions = {
      where: { createdAt: { [Op.lte]: date.add(3, "month").format() } },
      limit: limit,
      order: [["hits", "DESC"]],
    };

    const issue = await IssueDebatePost.findAll({
      ...commonOption,
      attributes: [
        "id",
        "category",
        "title",
        "imgUrl",
        "hits",
        [
          sequelize.fn("COUNT", Sequelize.col("IssueOpinions.id")),
          "opinionCount",
        ],
        [
          sequelize.fn("AVG", Sequelize.col("IssueOpinions.score")),
          "opinionAvgScore",
        ],
      ],

      include: [
        {
          model: IssueOpinion,
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["IssueDebatePost.id"],
    });

    const prosCons = await ProsConsDebatePost.findAll({
      ...commonOption,
      attributes: [
        "id",
        "category",
        "title",
        "imgUrl",
        "hits",
        [
          sequelize.fn("COUNT", Sequelize.col("ProsConsOpinions.id")),
          "opinionCount",
        ],
        [
          sequelize.fn("COUNT", Sequelize.col("OptionAgreeList.id")),
          "agreeListCount",
        ],
        [
          sequelize.fn("COUNT", Sequelize.col("OptionOpposeList.id")),
          "opposeListCount",
        ],
      ],
      include: [
        {
          model: ProsConsOpinion,
          attributes: [],
          duplicating: false,
        },
        {
          model: ProsConsOpinion,
          as: "OptionAgreeList",
          attributes: [],
          duplicating: false,
        },
        {
          model: ProsConsOpinion,
          as: "OptionOpposeList",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["ProsConsDebatePost.id"],
    });

    const balance = await BalanceDebatePost.findAll({
      ...commonOption,
      attributes: [
        "id",
        "category",
        "title",
        "imgUrl",
        "hits",
        "optionA",
        "optionB",
        [
          sequelize.fn("COUNT", Sequelize.col("BalanceOpinions.id")),
          "opinionCount",
        ],
        [
          sequelize.fn("COUNT", Sequelize.col("OptionAList.id")),
          "optionAListCount",
        ],
        [
          sequelize.fn("COUNT", Sequelize.col("OptionBList.id")),
          "optionBListCount",
        ],
      ],
      include: [
        {
          model: BalanceOpinion,
          attributes: [],
          duplicating: false,
        },
        {
          model: BalanceOpinion,
          as: "OptionAList",
          attributes: [],
          duplicating: false,
        },
        {
          model: BalanceOpinion,
          as: "OptionBList",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["BalanceDebatePost.id"],
    });

    const hotDebatePostsData = { issue, prosCons, balance };

    return res.status(200).json(hotDebatePostsData);
  } catch (error) {
    console.log(error);
  }
});

// 토론 게시물 통합 검색
router.post("/integrate-search", async (req, res, next) => {
  try {
    const searchText =
      typeof req.body.searchText === "string" ? req.body.searchText : "";
    const limit =
      typeof req.body.limit === "string" ? parseInt(req.body.limit, 10) : 8;
    const page =
      typeof req.body.page === "string" ? parseInt(req.body.page, 10) : 1;

    const commonWhere: WhereOptions = [
      { title: { [Op.like]: `%${searchText}%` } },
      { description: { [Op.like]: `%${searchText}%` } },
      { category: { [Op.like]: `%${searchText}%` } },
    ];

    const issue = await IssueDebatePost.findAll({
      where: {
        [Op.or]: commonWhere.concat({
          issue1: { [Op.like]: `%${searchText}%` },
        }),
      },
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", Sequelize.col("IssueOpinions.id")),
            "opinionCount",
          ],
          [
            sequelize.fn("AVG", Sequelize.col("IssueOpinions.score")),
            "opinionAvgScore",
          ],
        ],
        exclude: ["UserId", "issue1", "article"],
      },
      include: [
        {
          model: IssueOpinion,
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["IssueDebatePost.id"],
    });

    const prosCons = await ProsConsDebatePost.findAll({
      where: {
        [Op.or]: commonWhere.concat([
          { issue1: { [Op.like]: `%${searchText}%` } },
          { issue2: { [Op.like]: `%${searchText}%` } },
        ]),
      },
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", Sequelize.col("ProsConsOpinions.id")),
            "opinionCount",
          ],
          [
            sequelize.fn("COUNT", Sequelize.col("OptionAgreeList.id")),
            "agreeListCount",
          ],
          [
            sequelize.fn("COUNT", Sequelize.col("OptionOpposeList.id")),
            "opposeListCount",
          ],
        ],
        exclude: ["UserId", "issue1", "issue2", "article"],
      },
      include: [
        {
          model: ProsConsOpinion,
          attributes: [],
          duplicating: false,
        },
        {
          model: ProsConsOpinion,
          as: "OptionAgreeList",
          attributes: [],
          duplicating: false,
        },
        {
          model: ProsConsOpinion,
          as: "OptionOpposeList",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["ProsConsDebatePost.id"],
    });

    const balance = await BalanceDebatePost.findAll({
      where: {
        [Op.or]: commonWhere.concat([
          { issue1: { [Op.like]: `%${searchText}%` } },
          { issue2: { [Op.like]: `%${searchText}%` } },
        ]),
      },
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", Sequelize.col("BalanceOpinions.id")),
            "opinionCount",
          ],
          [
            sequelize.fn("COUNT", Sequelize.col("OptionAList.id")),
            "optionAListCount",
          ],
          [
            sequelize.fn("COUNT", Sequelize.col("OptionBList.id")),
            "optionBListCount",
          ],
        ],
        exclude: ["UserId", "issue1", "issue2", "article"],
      },
      include: [
        {
          model: BalanceOpinion,
          attributes: [],
          duplicating: false,
        },
        {
          model: BalanceOpinion,
          as: "OptionAList",
          attributes: [],
          duplicating: false,
        },
        {
          model: BalanceOpinion,
          as: "OptionBList",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["BalanceDebatePost.id"],
    });

    const topic = await DebateTopicPost.findAll({
      where: {
        [Op.or]: commonWhere,
      },
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", Sequelize.col("DebateTopicOpinions.id")),
            "opinionCount",
          ],
        ],
        exclude: ["UserId"],
      },
      include: [
        {
          model: DebateTopicOpinion,
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["DebateTopicPost.id"],
    });

    const extendedIssue = issue.map((res, index) => {
      res.dataValues.method = "issue";
      return res;
    });

    const extendedProsCons = prosCons.map((res, index) => {
      res.dataValues.method = "proscons";
      return res;
    });

    const extendedBalance = balance.map((res, index) => {
      res.dataValues.method = "balance";
      return res;
    });

    const extendedTopic = topic.map((res, index) => {
      res.dataValues.method = "topic";
      return res;
    });

    const integratedArray = [
      ...extendedIssue,
      ...extendedProsCons,
      ...extendedBalance,
      ...extendedTopic,
    ];

    integratedArray.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    const finalIntegratedData = integratedArray.slice(
      (page - 1) * limit,
      page * limit
    );

    return res
      .status(200)
      .json({ data: finalIntegratedData, count: integratedArray.length });
  } catch (error) {
    console.log(error);
  }
});

export default router;
