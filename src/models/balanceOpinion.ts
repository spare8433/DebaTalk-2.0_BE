import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import BalanceReply from "./balanceReply";
import sequelize from "./sequelize";
import User from "./user";

class BalanceOpinion extends Model {
  public declare readonly id: number;
  public declare content: string;
  public declare selection: string;

  //association fields
  public declare BalanceDebatePostId: number;
  public declare UserId: number;
  public declare User: User;
  public declare Replys: BalanceReply[];

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

BalanceOpinion.init(
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
    selection: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BalanceOpinion",
    tableName: "bal_opinion",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.BalanceOpinion.hasMany(db.BalanceReply, { as: "Replys" });
  db.BalanceOpinion.belongsTo(db.User);
  db.BalanceOpinion.belongsTo(db.BalanceDebatePost);
  db.BalanceOpinion.belongsToMany(db.User, {
    through: "like_bal_dbt_opinion",
    as: "Likers",
  });
};

export default BalanceOpinion;
