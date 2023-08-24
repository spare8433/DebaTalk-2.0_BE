import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import sequelize from "./sequelize";
import User from "./user";

class BalanceReply extends Model {
  public declare readonly id: number;
  public declare content: string;

  //association fields
  public declare BalanceOpinionId: number;
  public declare UserId: number;
  public declare User: User;
  public declare TargetId: number;
  public declare Target: User;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

BalanceReply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BalanceReply",
    tableName: "bal_reply",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.BalanceReply.belongsTo(db.BalanceOpinion);
  db.BalanceReply.belongsTo(db.User);
  db.BalanceReply.belongsTo(db.User, { as: "Target" });
  db.BalanceReply.belongsToMany(db.User, {
    through: "like_bal_dbt_reply",
    as: "LikedBalanceDebateReplys",
  });
};

export default BalanceReply;
