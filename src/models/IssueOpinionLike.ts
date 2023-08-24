import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import sequelize from "./sequelize";

class IssueOpinionLike extends Model {
  public declare readonly id: number;
  public declare isLike: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

IssueOpinionLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isLike: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "IssueOpinionLike",
    tableName: "issue_opinion_like",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  // db.User.hasMany(db.Comment);
  // db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default IssueOpinionLike;
