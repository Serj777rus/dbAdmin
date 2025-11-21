import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    fullName: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('master', 'admin'),
      allowNull: false,
      defaultValue: 'admin'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    sequelize
  }
);

