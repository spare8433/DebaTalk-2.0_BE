import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import sequelize from './sequelize'

class IssueDebatePost extends Model {
  declare public readonly id : number;
  declare public category : string;
  declare public title : string;
  declare public description : string;
  declare public article : string;
  declare public issue1 : string;
  declare public hit : number;
  declare public imgUrl : string;
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

IssueDebatePost.init({
  category: {
    type: DataTypes.STRING(10),
    allowNull:false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull:false
  },
  article: {
    type: DataTypes.STRING(1000),
    allowNull:false
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull:false
  },
  issue1: {
    type: DataTypes.STRING(1000),
    allowNull:false
  },
  imgUrl: {
    type: DataTypes.STRING(100),
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  sequelize,
  modelName: 'IssueDebatePost',
  tableName: 'issue_dbt_post',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.IssueDebatePost.hasMany(db.Opinion) // 변경예정
};

export default IssueDebatePost;
