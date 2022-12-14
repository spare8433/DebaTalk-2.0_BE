import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import BalanceOpinion from './balanceOpinion';
import sequelize from './sequelize'

class BalanceDebatePost extends Model {
  declare public readonly id : number;
  declare public category : string;
  declare public title : string;
  declare public optionA : string;
  declare public optionB : string;
  declare public description : string;
  declare public article : string;
  declare public issue1 : string;
  declare public issue2 : string;
  declare public hit : number;
  declare public imgUrl : string;
  
  //association fields
  declare public UserId: number;
  declare public BalanceOpinions: BalanceOpinion[];
  declare public OptionAList: BalanceOpinion[];
  declare public OptionBList: BalanceOpinion[];

  // declare public countBalanceOpinions: HasManyCountAssociationsMixin;

  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

BalanceDebatePost.init({
  category: {
    type: DataTypes.STRING(10),
    allowNull:false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull:false
  },
  optionA: {
    type: DataTypes.STRING(50),
    allowNull:false
  },
  optionB: {
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
  issue2: {
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
  modelName: 'BalanceDebatePost',
  tableName: 'bal_dbt_post',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.BalanceDebatePost.hasMany(db.BalanceOpinion)
  db.BalanceDebatePost.hasMany(db.BalanceOpinion, { as: 'OptionAList', scope: { selection: 'A' } })
  db.BalanceDebatePost.hasMany(db.BalanceOpinion, { as: 'OptionBList', scope: { selection: 'B' } })
  db.BalanceDebatePost.belongsTo(db.User)
};

export default BalanceDebatePost;
