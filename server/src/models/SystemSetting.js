import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export class SystemSetting extends Model {}

SystemSetting.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'system_settings',
    sequelize
  }
);

