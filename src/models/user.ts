import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
// import Post from './post';
import { dbType } from "./";
import CommunityPostLike from "./communityPostLike";
import sequelize from "./sequelize";

class User extends Model {
  public declare readonly id: number;
  public declare nickname: string;
  public declare userId: string;
  public declare email: string;
  public declare password: string;
  public declare imgUrl: string;
  public declare level: number;
  public declare point: number;
  public declare role: number;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  // declare public readonly Followers?: User[];
  // declare public readonly Followings?: User[];

  // declare public addFollowing: BelongsToManyAddAssociationMixin<User, number>;
  // declare public getFollowings: BelongsToManyGetAssociationsMixin<User>;
  // declare public removeFollowing: BelongsToManyRemoveAssociationMixin<User, number>;
  // declare public getFollowers: BelongsToManyGetAssociationsMixin<User>;
  // declare public removeFollower: BelongsToManyRemoveAssociationMixin<User, number>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(50),
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.User.hasMany(db.BalanceOpinion, { as: "BalanceOpinions" });
  db.User.hasMany(db.IssueOpinion, { as: "IssueOpinions" });
  db.User.hasMany(db.ProsConsOpinion, { as: "ProsConsOpinions" });

  db.User.hasMany(db.BalanceReply, { as: "BalanceReplys" });
  db.User.hasMany(db.IssueReply, { as: "IssueReplys" });
  db.User.hasMany(db.ProsConsReply, { as: "ProsConsReplys" });

  db.User.hasMany(db.CommunityPost, { as: "CommunityPosts" });

  db.User.belongsToMany(db.BalanceOpinion, {
    through: "like_bal_dbt_opinion",
    as: "LikedBalanceDebateOpinions",
  });
  db.User.belongsToMany(db.IssueOpinion, {
    through: "like_issue_dbt_opinion",
    as: "LikedIssueDebateOpinions",
  });
  db.User.belongsToMany(db.ProsConsOpinion, {
    through: "like_proscons_dbt_opinion",
    as: "LikedProsConsDebateOpinions",
  });
  db.User.belongsToMany(db.DebateTopicOpinion, {
    through: "like_dbt_topic_opinion",
    as: "LikedDebateTopicOpinions",
  });

  db.User.belongsToMany(db.BalanceReply, {
    through: "like_bal_dbt_reply",
    as: "LikedBalanceDebateReplys",
  });
  db.User.belongsToMany(db.IssueReply, {
    through: "like_issue_dbt_reply",
    as: "LikedIssueDebateReplys",
  });
  db.User.belongsToMany(db.ProsConsReply, {
    through: "like_proscons_dbt_reply",
    as: "LikedProsConsDebateReplys",
  });
  db.User.belongsToMany(db.DebateTopicReply, {
    through: "like_dbt_topic_reply",
    as: "LikedDebateTopicReplys",
  });

  db.User.belongsToMany(db.CommunityPost, {
    through: CommunityPostLike,
    as: "LikedCommunityPosts",
    foreignKey: "CommunityPostId",
  });

  db.User.belongsToMany(db.DebateTopicPost, {
    through: "like_dbt_topic_post",
    as: "LikedLikeDebateTopicPosts",
  });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default User;
