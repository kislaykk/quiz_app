const  {createQuizWithQuestions} = require('./quizService');
const questionsData = [{text:"q1",options:["1","2","3","4"],correct_option:1},{text:"q2",options:["1","2","3","4"],correct_option:1}]
const quizData = {title:"quizz title"}
createQuizWithQuestions(quizData,questionsData).then(console.log)