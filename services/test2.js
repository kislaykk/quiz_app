const {getQuiz} = require('./quizService');
getQuiz(15).then(data=>console.log(JSON.stringify(data)));