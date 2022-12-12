import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class IssueReply extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public hit : number;
  
  //association fields
  declare public IssueOpinionId : number;
  declare public UserId : number;
  declare public TargetId : number;

  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

IssueReply.init({
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
  modelName: 'IssueReply',
  tableName: 'issue_reply',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.IssueReply.belongsTo(db.IssueOpinion)
  db.IssueReply.belongsTo(db.User)
  db.IssueReply.belongsTo(db.User, { as: 'Target' })
};

export default IssueReply;
