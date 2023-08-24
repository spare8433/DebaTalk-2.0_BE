import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import sequelize from "./sequelize";
import User from "./user";
import DebateTopicReply from "./debateTopicReply";

class DebateTopicOpinion extends Model {
  public declare readonly id: number;
  public declare content: string;
  //association fields
  public declare DebateTopicPostId: number;
  public declare UserId: number;
  public declare User: User;
  public declare Replys: DebateTopicReply[];

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

DebateTopicOpinion.init(
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
    modelName: "DebateTopicOpinion",
    tableName: "dbt_topic_opinion",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.DebateTopicOpinion.hasMany(db.DebateTopicReply, { as: "Replys" });
  db.DebateTopicOpinion.belongsTo(db.User);
  db.DebateTopicOpinion.belongsTo(db.DebateTopicPost);
  db.DebateTopicOpinion.belongsToMany(db.User, {
    through: "like_dbt_topic_opinion",
    as: "Likers",
  });
};

export default DebateTopicOpinion;
