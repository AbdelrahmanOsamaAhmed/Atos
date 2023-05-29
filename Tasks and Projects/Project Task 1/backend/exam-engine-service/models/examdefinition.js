"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamDefinition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExamDefinition.hasMany(models.Question, {
        foreignKey: "exam_id",
        as: "questions",
      });
      ExamDefinition.hasMany(models.ExamInstance, {
        foreignKey: "exam_definition_id",
        as: "exam_instances",
      });
    }
  }
  ExamDefinition.init(
    {
      exam_name: DataTypes.STRING,
      passing_score: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ExamDefinition",
    }
  );
  return ExamDefinition;
};
