'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      Result.Quiz=Result.belongsTo(models.Quiz, {
        foreignKey: 'quiz_id',  // foreign key in the Questions table
        onDelete: 'CASCADE',    // If the referenced Quiz is deleted, delete the Question
        onUpdate: 'CASCADE'     // If the referenced Quiz is updated, update the foreign key
      });
    }
  }
  Result.init({
    quiz_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    score: DataTypes.DECIMAL,
    answers: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};