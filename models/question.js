'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Quiz, {
        foreignKey: 'quiz_id',  // foreign key in the Questions table
        onDelete: 'CASCADE',    // If the referenced Quiz is deleted, delete the Question
        onUpdate: 'CASCADE'     // If the referenced Quiz is updated, update the foreign key
      });
    }
  }
  Question.init({
    text: DataTypes.TEXT,
    options: DataTypes.JSON,
    correct_option: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};