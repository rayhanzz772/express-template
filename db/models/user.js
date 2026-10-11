'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      })
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      role_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      timestamps: true,
      underscored: true
    }
  )
  return User
}
