import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class BalanceReply extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public hit : number;

  //association fields
  declare public BalanceOpinionId : number;
  declare public UserId : number;
  declare public TargetId : number;
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

BalanceReply.init({
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
  modelName: 'BalanceReply',
  tableName: 'bal_reply',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.BalanceReply.belongsTo(db.BalanceOpinion)
  db.BalanceReply.belongsTo(db.User)
  db.BalanceReply.belongsTo(db.User, { as: 'Target' })
};

export default BalanceReply;
