const express = require('express');
const bodyParser = require('body-parser');
const quizRouter = require('./routes/quiz');
const { errors } = require('celebrate');
const errorCodes = require('./config/errorCodes.json')
const app = express();

app.use(bodyParser.json());

app.use('/quiz', quizRouter);

app.use(errors());
app.use((err,req,res,next)=>{
  console.log(err);
  if(err?.code){
    switch(err.code){
      case errorCodes.notFound.question:
      case errorCodes.notFound.quiz:
        return res.status(404).json({message:err.message});
      case errorCodes.duplicateAttemp:
        return res.status(200).json({message:err.message});
      default:
        break;
    }
  }
  return res.status(500).json({message:'Internal Server Error'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;