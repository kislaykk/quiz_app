'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quizzes', // Name of the table being referenced
          key: 'id', // Primary key in the Quizzes table
        },
        onUpdate: 'CASCADE', // Optional: Update behavior when the referenced row changes
        onDelete: 'CASCADE', // Optional: Delete behavior when the referenced row is deleted
      },
      user_id: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.DECIMAL
      },
      answers: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  }
};