import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
 } from 'sequelize';
// import Post from './post';
import { dbType } from './';
import sequelize from './sequelize'

class Opinion extends Model {
  declare public readonly id : number;
  declare public content : String;
  declare public position : string;
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

Opinion.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
  position: {
    type: DataTypes.STRING(8),
    allowNull:false
  },
}, {
  sequelize,
  modelName: 'Opinion',
  tableName: 'opinion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.Opinion.belongsTo(db.DebatePost);
  db.Opinion.belongsTo(db.User, { as: 'Writer' });
  db.Opinion.belongsToMany(db.User, { through: 'LikeOpinion', as: 'Likers' });
};

export default Opinion;