import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export class MetricSnapshot extends Model {}

MetricSnapshot.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    collectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    totalQueries: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    successfulQueries: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    failedQueries: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    databasesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    tablesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    storageUsedMb: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    activeUsers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'metric_snapshots',
    sequelize
  }
);

