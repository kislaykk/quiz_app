const resultService = require('../services/resultService');

exports.getResult = async (req) => {
    const {userid:userId} = req.headers;
    const {quizId} = req.params;

    const result = await resultService.getResult(quizId, userId);
    return result;
}