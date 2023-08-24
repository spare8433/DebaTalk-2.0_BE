import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import IssueOpinion from "./issueOpinion";
import sequelize from "./sequelize";
import User from "./user";

class IssueDebatePost extends Model {
  public declare readonly id: number;
  public declare category: string;
  public declare title: string;
  public declare description: string;
  public declare article: string;
  public declare issue1: string;
  public declare hits: number;
  public declare imgUrl: string;

  //association fields
  public declare UserId: number;
  public declare User: User;
  public declare IssueOpinions: IssueOpinion[];

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  // extension fields Type
  public declare method: "issue";
  public declare opinionCount: number;
  public declare opinionAvgScore: number | null;
}

IssueDebatePost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    article: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    issue1: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING(300),
    },
    hits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "IssueDebatePost",
    tableName: "issue_dbt_post",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.IssueDebatePost.hasMany(db.IssueOpinion);
  db.IssueDebatePost.belongsTo(db.User);
};

export default IssueDebatePost;
