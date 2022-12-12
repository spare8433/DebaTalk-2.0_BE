import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from '.';
import sequelize from './sequelize'

class Reply extends Model {
  declare public readonly id : number;
  declare public content : String;
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

Reply.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
}, {
  sequelize,
  modelName: 'Reply',
  tableName: 'reply',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.Reply.belongsTo(db.Comment);
  db.Reply.belongsTo(db.User, { as: 'Writer' });
  db.Reply.belongsTo(db.User, { as: 'Target' });
  db.Reply.belongsToMany(db.User, { through: 'LikeReply', as: 'Likers' });
};

export default Reply;