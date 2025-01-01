const { Answer, Question } = require('../models'); // Adjust the path as needed
const { CustomError } = require('../utils/customError');
const errorCodes = require('../config/errorCodes.json');

async function submitAnswer(quizId, questionId, userId, selectedOption) {
  try {
    // Check if the user has already answered this question
    const existingAnswer = await Answer.findOne({
      where: {
        question_id: questionId,
        answered_by: userId,
      },
    });

    if (existingAnswer) {
      throw new CustomError(errorCodes.duplicateAttemp, 'Already Answered');
    }

    // Retrieve the question to get the correct option
    const question = await Question.findOne({
      where: {
        id: questionId,
        quiz_id: quizId, // Ensure the question belongs to the given quiz
      },
      attributes: ['correct_option'],
    });

    if (!question) {
      throw new CustomError(errorCodes.notFound.question, 'Question not found or does not belong to the quiz');
    }

    // Check if the selected option is correct
    const isCorrect = selectedOption === question.correct_option;

    // Save the answer in the database
    await Answer.create({
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      answered_by: userId,
    });

    // Return the appropriate message
    if (isCorrect) {
      return { message: 'Correct answer' };
    } else {
      return { 
        message: 'Wrong answer', 
        correctOption: question.correct_option 
      };
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = { submitAnswer };
