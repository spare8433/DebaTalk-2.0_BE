import { Model, DataTypes } from "sequelize";
import { dbType } from ".";
import sequelize from "./sequelize";

class AuthCode extends Model {
  public declare readonly id: number;
  public declare code: string;
  public declare expiration_date: Date;

  //association fields
  public declare UserId: number;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

AuthCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AuthCode",
    tableName: "auth_code",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.AuthCode.belongsTo(db.User);
};

export default AuthCode;
