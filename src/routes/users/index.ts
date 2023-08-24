import express from "express";
import User from "@models/user";
import sequelize from "@models/sequelize";

const router = express.Router();

// 전체 유저 정보 가져오기
router.post("/", async (req, res, next) => {
  try {
    const limit = req.body.limit ?? 10;
    const order = req.body.order ?? "DESC";
    const key = req.body.key ?? "level";

    const fullUsersWithoutPassword = await User.findAll({
      limit,
      order: [[key, order]],
      where: { role: 0 },
      attributes: {
        exclude: ["password"],
      },
    });

    if (fullUsersWithoutPassword) {
      res.status(200).json(fullUsersWithoutPassword);
    } else res.status(404).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
export default router;
