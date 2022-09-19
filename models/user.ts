import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from './';
import sequelize from './sequelize'

class User extends Model {
  declare public readonly id : number;
  declare public nickname : string;
  declare public userId : string;
  declare public password : string;
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
  userId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  // db.User.hasMany(db.Post, { as: 'Posts' });
  // db.User.hasMany(db.Comment);
  // db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default User;