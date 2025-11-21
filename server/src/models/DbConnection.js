import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import { User } from './User.js';

export class DbConnection extends Model {}

DbConnection.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    host: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    port: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 3306
    },
    username: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    ssl: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    tableName: 'db_connections',
    sequelize
  }
);

