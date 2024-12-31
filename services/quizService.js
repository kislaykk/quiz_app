const { Quiz, sequelize } = require('../models');

async function createQuizWithQuestions(quizData, questionsData) {
  const t = await sequelize.transaction();  // Start a new transaction
  
  try {
    const quiz = await Quiz.create({
      title: quizData.title,
      Questions: questionsData.map(question=>({
        text: question.text,
        options: question.options,
        correct_option: question.correct_option
      }))
    },
    {
      include: [Quiz.Questions],
      transaction: t
    });

    await t.commit();
    return quiz;  // Return the created quiz or any other useful info
  } catch (error) {
    // If any error occurs, roll back the transaction
    await t.rollback();
    throw error;  // Rethrow the error to be handled at a higher level
  }
}

module.exports = { createQuizWithQuestions };
