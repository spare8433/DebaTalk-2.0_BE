import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class CommunityPostLike extends Model {
  declare public readonly id : number;
  declare public isLike : string;
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

CommunityPostLike.init({
  isLike: {
    type: DataTypes.STRING(8),
    allowNull:false
  },
}, {
  sequelize,
  modelName: 'CommunityPostLike',
  tableName: 'CommunityPostLiked',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  // db.User.hasMany(db.Comment);
  // db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};

export default CommunityPostLike;