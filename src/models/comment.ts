import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from './';
import sequelize from './sequelize'

class Comment extends Model {
  declare public readonly id : number;
  declare public content : String;
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

Comment.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comment',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.Comment.belongsTo(db.CommunityPost);
  db.Comment.belongsTo(db.User, { as: 'Writer' });
  db.Comment.belongsToMany(db.User, { through: 'LikeComment', as: 'Likers' });
  db.Comment.hasMany(db.Reply);
};

export default Comment;