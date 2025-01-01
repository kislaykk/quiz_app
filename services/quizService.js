const errorCodes = require('../config/errorCodes.json');
const { Quiz, sequelize, Question } = require('../models');
const { CustomError } = require('../utils/customError');

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
    return {id:quiz.id};  // Return the created quiz or any other useful info
  } catch (error) {
    // If any error occurs, roll back the transaction
    await t.rollback();
    throw error;  // Rethrow the error to be handled at a higher level
  }
}

async function getQuiz(quizId) {
  try {
    const quiz = await Quiz.findOne({
      where: { id: quizId },
      attributes: ['title','id'], // Get only the quiz title
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'options'], // Get specific fields from questions
        },
      ],
    });

    if (!quiz) {
      throw new CustomError(errorCodes.notFound.quiz,'Quiz Not Found');
    }

    // Format the response
    return {
      title: quiz.title,
      id: quiz.id,
      questions: quiz.Questions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options,
      })),
    };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = { createQuizWithQuestions, getQuiz };
