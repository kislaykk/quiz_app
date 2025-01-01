const express = require('express');
const bodyParser = require('body-parser');
const quizRouter = require('./routes/quiz');
const { errors } = require('celebrate');
const app = express();

app.use(bodyParser.json());

app.use('/quiz', quizRouter);

app.use(errors());
app.use((err,req,res,next)=>{
  console.log(err);
  return res.status(500).json({message:'Internal Server Error'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;