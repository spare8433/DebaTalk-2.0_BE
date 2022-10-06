import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from './';
import CommunityPostLike from './communityPostLike';
import sequelize from './sequelize'

class User extends Model {
  declare public readonly id : number;
  declare public nickname : string;
  declare public userId : string;
  declare public email : string;
  declare public password : string;
  declare public imgUrl : string;
  declare public level : number;
  declare public point : number;
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;

  // declare public readonly Followers?: User[];
  // declare public readonly Followings?: User[];

  // declare public addFollowing: BelongsToManyAddAssociationMixin<User, number>;
  // declare public getFollowings: BelongsToManyGetAssociationsMixin<User>;
  // declare public removeFollowing: BelongsToManyRemoveAssociationMixin<User, number>;
  // declare public getFollowers: BelongsToManyGetAssociationsMixin<User>;
  // declare public removeFollower: BelongsToManyRemoveAssociationMixin<User, number>;
}

User.init({
  nickname: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(50)
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
    type: DataTypes.STRING(50),
    allowNull:true
  },
  point: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue:0
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.User.hasMany(db.Opinion, { as: 'Opnions' });
  db.User.hasMany(db.CommunityPost, { as: 'CommunityPosts'} )
  db.User.hasMany(db.Comment, { as: 'Comments' });
  db.User.hasMany(db.Reply, { as: 'Replys' });

  db.User.belongsToMany(db.CommunityPost, { through: CommunityPostLike, as: 'LikedCommunityPosts', foreignKey:'CommunityPostId'});
  db.User.belongsToMany(db.Opinion, { through: 'LikeOpinion', as: 'LikedOpinions'})
  db.User.belongsToMany(db.Comment, { through: 'LikeComment', as: 'LikedComments'})
  db.User.belongsToMany(db.Reply, { through: 'LikeReply', as: 'LikedReplys'})

  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default User;