const quizService = require('../services/quizService');

exports.getQuiz = async (req) =>{
    const {quizId} = req.params;
    const result = await quizService.getQuiz(quizId);
    return result;
}

exports.createQuiz = async (req) =>{
    const {title, questions} = req.body;
    const result = await quizService.createQuizWithQuestions({title},questions);
    return result;
}