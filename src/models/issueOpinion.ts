import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import IssueReply from "./issueReply";
import sequelize from "./sequelize";
import User from "./user";

class IssueOpinion extends Model {
  public declare readonly id: number;
  public declare content: string;
  public declare score: number;

  //association fields
  public declare IssueDebatePostId: number;
  public declare UserId: number;
  public declare User: User;
  public declare Replys: IssueReply[];

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

IssueOpinion.init(
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
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "IssueOpinion",
    tableName: "issue_opinion",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.IssueOpinion.hasMany(db.IssueReply, { as: "Replys" });
  db.IssueOpinion.belongsTo(db.User);
  db.IssueOpinion.belongsTo(db.IssueDebatePost);

  db.IssueOpinion.belongsToMany(db.User, {
    through: "like_issue_dbt_opinion",
    as: "Likers",
  });
};

export default IssueOpinion;
