import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import ProsConsReply from "./prosConsReply";
import sequelize from "./sequelize";
import User from "./user";

class ProsConsOpinion extends Model {
  public declare readonly id: number;
  public declare content: string;
  public declare selection: string;

  //association fields
  public declare ProsConsDebatePostId: number;
  public declare UserId: number;
  public declare User: User;
  public declare Replys: ProsConsReply[];

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

ProsConsOpinion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    selection: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProsConsOpinion",
    tableName: "proscons_opinion",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.ProsConsOpinion.hasMany(db.ProsConsReply, { as: "Replys" });
  db.ProsConsOpinion.belongsTo(db.User);
  db.ProsConsOpinion.belongsTo(db.ProsConsDebatePost);
  db.ProsConsOpinion.belongsToMany(db.User, {
    through: "like_proscons_dbt_opinion",
    as: "Likers",
  });
};

export default ProsConsOpinion;
