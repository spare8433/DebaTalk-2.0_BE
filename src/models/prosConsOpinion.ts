import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import ProsConsReply from './prosConsReply';
import sequelize from './sequelize'

class ProsConsOpinion extends Model {
  declare public readonly id : number;
  declare public content : string;
  declare public selection : string;

  //association fields
  declare public ProsConsDebatePostId : number;
  declare public UserId : number;
  declare public Replys : ProsConsReply[];
  
  declare public readonly createdAt : Date;
  declare public readonly updatedAt : Date;
}

ProsConsOpinion.init({
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
  modelName: 'ProsConsOpinion',
  tableName: 'prosCons_opinion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db:dbType) => {
  db.ProsConsOpinion.hasMany(db.ProsConsReply, { as: 'Replys' })
  db.ProsConsOpinion.belongsTo(db.User)
  db.ProsConsOpinion.belongsTo(db.ProsConsDebatePost)
};

export default ProsConsOpinion;
