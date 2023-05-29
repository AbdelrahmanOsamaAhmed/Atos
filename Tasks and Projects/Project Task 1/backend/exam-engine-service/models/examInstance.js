"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamInstance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExamInstance.belongsTo(models.ExamDefinition, {
        foreignKey: {
          name: "exam_definition_id",
          allowNull: false,
        },
        as: "exam_definition",
      });
    }
  }
  ExamInstance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_definition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
      },
      completionTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      schduledtimeFrom: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      schduledtimeTo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      takenBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("absent", "taken"),
        defaultValue: "absent",
      },
      score: {
        type: DataTypes.FLOAT(5, 2),
        defaultValue: 0,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ExamInstance",
    }
  );
  return ExamInstance;
};
