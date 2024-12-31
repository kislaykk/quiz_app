const answerService = require('../services/ansService');

exports.submitAnswer = async (req) =>{
    const {userid:userId} = req.headers;
    const {quizId, questionId} = req.params;
    const {selectedOption} = req.body;

    const result = await answerService.submitAnswer(quizId, questionId, userId, selectedOption);
    return result;
}