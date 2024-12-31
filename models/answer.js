'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association 
      // define association here
      Answer.belongsTo(models.Question, {
        foreignKey: 'question_id',  // foreign key in the Answer table
        onDelete: 'CASCADE',    // If the referenced Question is deleted, delete the Answer
        onUpdate: 'CASCADE'     // If the referenced Question is updated, update the foreign key
      });
    }
  }
  Answer.init({
    question_id: DataTypes.INTEGER,
    selected_option: DataTypes.INTEGER,
    is_correct: DataTypes.BOOLEAN,
    answered_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};