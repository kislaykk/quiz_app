const { Quiz, Question, sequelize } = require('../models'); // Adjust the path to where your models are defined

async function createQuizWithQuestions(quizData, questionsData) {
  const t = await sequelize.transaction();  // Start a new transaction
  
  try {
    // 1. Create the quiz
    const quiz = await Quiz.create({
      title: quizData.title
    }, { transaction: t });

    // 2. Create questions associated with the quiz
    const questions = await Promise.all(questionsData.map(question => 
      Question.create({
        text: question.text,
        options: question.options,  // Assume it's an array of 4 options
        correct_option: question.correct_option,
        quiz_id: quiz.id  // Associate the question with the newly created quiz
      }, { transaction: t })
    ));

    // If everything is successful, commit the transaction
    await t.commit();

    return quiz;  // Return the created quiz or any other useful info
  } catch (error) {
    // If any error occurs, roll back the transaction
    await t.rollback();
    throw error;  // Rethrow the error to be handled at a higher level
  }
}

module.exports = { createQuizWithQuestions };
