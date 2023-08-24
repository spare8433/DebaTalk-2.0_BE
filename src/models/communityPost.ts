import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
// import Post from './post';
import { dbType } from ".";
import CommunityPostLike from "./communityPostLike";
import sequelize from "./sequelize";

class CommunityPost extends Model {
  public declare readonly id: number;
  public declare category: string;
  public declare title: string;
  public declare content: Element;
  public declare likeList: string[];
  public declare unlikeList: string[];
  public declare hit: number;
  public declare imgUrl: string;

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

CommunityPost.init(
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
    content: {
      type: DataTypes.STRING(5000),
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
    modelName: "CommunityPost",
    tableName: "cmu_post",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.CommunityPost.belongsToMany(db.User, {
    through: CommunityPostLike,
    as: "Liked",
    foreignKey: "UserId",
  });
  // db.User.hasMany(db.Comment);
  // db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default CommunityPost;
