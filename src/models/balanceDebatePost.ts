import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import BalanceOpinion from "./balanceOpinion";
import sequelize from "./sequelize";
import User from "./user";

class BalanceDebatePost extends Model {
  public declare readonly id: number;
  public declare category: string;
  public declare title: string;
  public declare optionA: string;
  public declare optionB: string;
  public declare description: string;
  public declare article: string;
  public declare issue1: string;
  public declare issue2: string;
  public declare hits: number;
  public declare imgUrl: string;

  //association fields
  public declare UserId: number;
  public declare User: User;
  public declare BalanceOpinions: BalanceOpinion[];
  public declare OptionAList: BalanceOpinion[];
  public declare OptionBList: BalanceOpinion[];

  //association fields
  public declare opinionCount?: number;
  public declare optionAListCount?: number;
  public declare optionBListCount?: number;

  // extension fields Type
  public declare method?: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

BalanceDebatePost.init(
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
    optionA: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    optionB: {
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
    modelName: "BalanceDebatePost",
    tableName: "bal_dbt_post",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.BalanceDebatePost.hasMany(db.BalanceOpinion);
  db.BalanceDebatePost.hasMany(db.BalanceOpinion, {
    as: "OptionAList",
    scope: { selection: "A" },
  });
  db.BalanceDebatePost.hasMany(db.BalanceOpinion, {
    as: "OptionBList",
    scope: { selection: "B" },
  });
  db.BalanceDebatePost.belongsTo(db.User);
};

export default BalanceDebatePost;
