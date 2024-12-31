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
      Quiz.hasMany(models.Question);
    }
  }
  Quiz.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  // Quiz.Answer=Quiz.hasMany(Model.Answer);
  return Quiz;
};