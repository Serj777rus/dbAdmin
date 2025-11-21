import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import { User } from './User.js';

export class ActivityLog extends Model {}

ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'activity_logs',
    sequelize
  }
);

