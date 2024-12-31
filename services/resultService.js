const { Quiz, Result, Question, Answer } = require('../models');

async function getResult(quizId, userId){
    try {
      // Search for the result in the Results table
      const result = await Result.findOne({
        where: {
          quiz_id: quizId,
          user_id: userId,
        },
      });
  
      // If the result exists, return it
      if (result) {
        return {
          found: true,
          data: {
            quiz_id: result.quiz_id,
            user_id: result.user_id,
            score: result.score,
            answers: result.answers,
          },
        };
      }
  
      // If no result is found, check if all answers for the quiz are provided
      const quiz = await Quiz.findOne({
        where: { id: quizId },
        include: [
          {
            model: Question,
            attributes: ['id', 'correct_option', 'text', 'options'], // Fetch all relevant fields for questions
          },
        ],
      });
  
      if (!quiz) {
        return { found: false, message: 'Quiz not found.' };
      }
  
      // Get all question IDs for the quiz
      const questions = quiz.Questions;
      const questionIds = questions.map((question) => question.id);
  
      // Fetch the answers given by the user for this quiz
      const userAnswers = await Answer.findAll({
        where: {
          question_id: questionIds, // Filter answers for this quiz's questions
          answered_by: userId, // Filter by the specific user
        },
      });
  
      // Check if all questions have been answered
      if (userAnswers.length !== questionIds.length) {
        return {
          found: false,
          message: `Incomplete answers. Only ${userAnswers.length} out of ${questionIds.length} questions answered.`,
        };
      }
  
      // Calculate the result
      let correctAnswers = 0;
      const detailedAnswers = [];
  
      questions.forEach((question) => {
        const userAnswer = userAnswers.find((answer) => answer.question_id === question.id);
  
        if (userAnswer) {
          const isCorrect = userAnswer.selected_option === question.correct_option;
          if (isCorrect) correctAnswers++;
  
          detailedAnswers.push({
            question_id: question.id,
            question_text: question.text,
            selected_option: `${userAnswer.selected_option}. ${question.options[userAnswer.selected_option-1]}`,
            correct_option: `${question.correct_option}. ${question.options[question.correct_option-1]}`,
            is_correct: isCorrect,
          });
        }
      });
  
      const totalQuestions = questions.length;
      const score = ((correctAnswers / totalQuestions) * 100).toFixed(2); // Calculate percentage score
  
      // Save the result in the Result table
      const newResult = await Result.create({
        quiz_id: quizId,
        user_id: userId,
        score,
        answers: detailedAnswers, // Store detailed answers in JSON format
      });
  
      // Return the result
      return {
        found: true,
        data: {
          quiz_id: quizId,
          user_id: userId,
          score,
          correctAnswers,
          totalQuestions,
          detailedAnswers,
        },
      };
    } catch (error) {
      console.error('Error fetching result or processing answers:', error);
      throw new Error('Failed to process the result.');
    }
  };
  
module.exports = {getResult};