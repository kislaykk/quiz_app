const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { getQuiz, createQuiz } = require('../controllers/quiz');
const router = express.Router();

router.get('/:quizId',celebrate({
        [Segments.PARAMS]:Joi.object({
            quizId: Joi.number().positive().required()
        })
    }),
    (req, res, next)=>getQuiz(req).then(data=>res.status(200).json(data)).catch(next)
);

router.post('/',celebrate({
        [Segments.BODY]: Joi.object({
            title: Joi.string().min(3).max(100).required(),
            questions: Joi.array().items(Joi.object({
                text: Joi.string().required(), // Text of the question (string)
                options: Joi.array().items(Joi.string()).length(4).required(),
                correct_option: Joi.number().valid(1,2,3,4).required()
            })).min(1).required()
        })
    }),
    (req, res, next)=>createQuiz(req).then(data=>res.status(201).json(data)).catch(next)
);
module.exports = router;