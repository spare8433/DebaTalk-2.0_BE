import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from '.';
import sequelize from './sequelize'

class DebatePost extends Model {
  declare public readonly id : number;
  declare public method : string;
  declare public category : string;
  declare public title : string;
  declare public content : Element;
  declare public agreementList : string[];
  declare public oppositionList : string[];
  declare public hit : number;
  declare public imgUrl : string;
  
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

DebatePost.init({
  method: {
    type: DataTypes.STRING(10),
    allowNull:false
  },
  category: {
    type: DataTypes.STRING(10),
    allowNull:false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull:false
  },
  content: {
    type: DataTypes.STRING(5000),
    allowNull:false
  },
  imgUrl: {
    type: DataTypes.STRING(50)
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  sequelize,
  modelName: 'DebatePost',
  tableName: 'dbt_post',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.DebatePost.hasMany(db.Opinion, { as: 'Opinions'})
  // db.User.hasMany(db.Comment);
  // db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default DebatePost;