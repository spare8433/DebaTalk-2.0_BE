import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class ProsConsReply extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public hit : number;

  //association fields
  declare public ProsConsOpinionId : number;
  declare public UserId : number;
  declare public TargetId : number;
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

ProsConsReply.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  sequelize,
  modelName: 'ProsConsReply',
  tableName: 'prosCons_reply',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.ProsConsReply.belongsTo(db.ProsConsOpinion)
  db.ProsConsReply.belongsTo(db.User)
  db.ProsConsReply.belongsTo(db.User, { as: 'Target' })
};

export default ProsConsReply;
