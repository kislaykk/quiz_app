'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.Questions=Quiz.hasMany(models.Question,{
        foreignKey: 'quiz_id'
      });
      Quiz.Results=Quiz.hasMany(models.Result,{
        foreignKey: 'quiz_id'
      });
    }
  }
  Quiz.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};