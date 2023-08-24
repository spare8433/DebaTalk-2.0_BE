import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import sequelize from "./sequelize";
import User from "./user";

class ProsConsReply extends Model {
  public declare readonly id: number;
  public declare content: string;

  //association fields
  public declare ProsConsOpinionId: number;
  public declare UserId: number;
  public declare User: User;
  public declare TargetId: number;
  public declare Target: User;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

ProsConsReply.init(
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
  },
  {
    sequelize,
    modelName: "ProsConsReply",
    tableName: "proscons_reply",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.ProsConsReply.belongsTo(db.ProsConsOpinion);
  db.ProsConsReply.belongsTo(db.User);
  db.ProsConsReply.belongsTo(db.User, { as: "Target" });
};

export default ProsConsReply;
