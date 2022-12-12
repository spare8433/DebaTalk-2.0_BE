import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import IssueReply from './issueReply';
import sequelize from './sequelize'

class IssueOpinion extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public selection : string;

  //association fields
  declare public IssueDebatePostId : number;
  declare public UserId : number;
  declare public Replys : IssueReply[];
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

IssueOpinion.init({
  content: {
    type: DataTypes.STRING(500),
    allowNull:false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  sequelize,
  modelName: 'IssueOpinion',
  tableName: 'issue_opinion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.IssueOpinion.hasMany(db.IssueReply, { as: 'Replys' })
  db.IssueOpinion.belongsTo(db.User)
  db.IssueOpinion.belongsTo(db.IssueDebatePost)
};

export default IssueOpinion;
