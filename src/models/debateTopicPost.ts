import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import ProsConsOpinion from "./prosConsOpinion";
import sequelize from "./sequelize";
import User from "./user";
import DebateTopicOpinion from "./debateTopicOpinion";

class DebateTopicPost extends Model {
  public declare readonly id: number;
  public declare category: string;
  public declare title: string;
  public declare description: string;
  public declare hits: number;
  public declare imgUrl: string;

  //association fields
  public declare UserId: number;
  public declare User: User;
  public declare Likers: User[];
  public declare opinionCount?: number;
  public declare DebateTopicOpinions?: DebateTopicOpinion[];

  // extension fields Type
  public declare method?: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

DebateTopicPost.init(
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
    description: {
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
    modelName: "DebateTopicPost",
    tableName: "dbt_topic_post",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.DebateTopicPost.belongsToMany(db.User, {
    through: "like_dbt_topic_post",
    as: "Likers",
  });
  db.DebateTopicPost.belongsTo(db.User);
  db.DebateTopicPost.hasMany(db.DebateTopicOpinion);
};

export default DebateTopicPost;
