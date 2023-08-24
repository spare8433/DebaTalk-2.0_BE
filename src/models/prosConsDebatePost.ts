import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import ProsConsOpinion from "./prosConsOpinion";
import sequelize from "./sequelize";
import User from "./user";

class ProsConsDebatePost extends Model {
  public declare readonly id: number;
  public declare category: string;
  public declare title: string;
  public declare description: string;
  public declare article: string;
  public declare issue1: string;
  public declare issue2: string;
  public declare hits: number;
  public declare imgUrl: string;

  //association fields
  public declare UserId: number;
  public declare User: User;
  public declare ProsConsOpinions: ProsConsOpinion[];
  public declare OptionAgreeList: ProsConsOpinion[];
  public declare OptionOpposeList: ProsConsOpinion[];

  // declare public countBalanceOpinions: HasManyCountAssociationsMixin;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  // extension fields Type
  public declare method?: string;
  public declare opinionCount?: number;
  public declare agreeListCount?: number;
  public declare opposeListCount?: number;
}

ProsConsDebatePost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    article: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    issue1: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    issue2: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING(300),
    },
    hits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "ProsConsDebatePost",
    tableName: "proscons_dbt_post",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.ProsConsDebatePost.hasMany(db.ProsConsOpinion);
  db.ProsConsDebatePost.hasMany(db.ProsConsOpinion, {
    as: "OptionAgreeList",
    scope: { selection: "찬성" },
  });
  db.ProsConsDebatePost.hasMany(db.ProsConsOpinion, {
    as: "OptionOpposeList",
    scope: { selection: "반대" },
  });
  db.ProsConsDebatePost.belongsTo(db.User);
};

export default ProsConsDebatePost;
