'use strict'
const { Model } = require('sequelize')
const cuid = require('cuid')

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
      })

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions'
      })
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => cuid(),
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      underscored: true,
      timestamps: true
    }
  )

  return Role
}
