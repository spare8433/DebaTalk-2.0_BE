import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class BalanceOpinion extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public selection : string;

  declare public BalanceDebatePostId : number;
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

BalanceOpinion.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
  selection: {
    type: DataTypes.STRING(8),
    allowNull:false
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  sequelize,
  modelName: 'BalanceOpinion',
  tableName: 'bal_opinion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.BalanceOpinion.hasMany(db.BalanceReply, { as: 'BalanceReplys' })
  db.BalanceOpinion.belongsTo(db.User)
  db.BalanceOpinion.belongsTo(db.BalanceDebatePost)
};

export default BalanceOpinion;
