const assert = require('assert');
const sinon = require('sinon');
const { sequelize, Quiz, Question } = require('../models');
const { createQuizWithQuestions } = require('../services/quizService');

describe('createQuizWithQuestions', () => {
  let transactionStub;
  let quizCreateStub;
  let transactionObj;


  beforeEach(() => {
    transactionObj = {
        commit: sinon.stub(),
        rollback: sinon.stub()    
    }
    // Stub the transaction method
    transactionStub = sinon.stub(sequelize, 'transaction').resolves(transactionObj);

    // Stub Quiz.create method
    quizCreateStub = sinon.stub(Quiz, 'create').resolves({
      id: 1,
      title: 'Sample Quiz',
      Questions: []  // Initially, no questions
    });

  });

  afterEach(() => {
    // Restore all stubs after each test
    sinon.restore();
  });

  it('should create a quiz with associated questions successfully', async () => {
    const quizData = { title: 'Sample Quiz' };
    const questionsData = [
      { text: 'Question 1', options: ['A', 'B', 'C'], correct_option: 1 },
      { text: 'Question 2', options: ['X', 'Y', 'Z'], correct_option: 2 }
    ];

    // Call the method
    const result = await createQuizWithQuestions(quizData, questionsData);

    // Check that Quiz.create was called with correct arguments
    assert.strictEqual(quizCreateStub.calledOnce, true);
    assert.deepStrictEqual(quizCreateStub.firstCall.args[0], { title: 'Sample Quiz', Questions: questionsData });

    // Check that questions were passed correctly in the include
    assert.strictEqual(quizCreateStub.firstCall.args[0].Questions.length, 2);
    assert.strictEqual(quizCreateStub.firstCall.args[0].Questions[0].text, 'Question 1');
    assert.strictEqual(quizCreateStub.firstCall.args[0].Questions[1].text, 'Question 2');


    // Check that the transaction was committed
    assert.strictEqual(transactionObj.commit.calledOnce, true);

    // Ensure the result contains the created quiz
    assert.deepStrictEqual(result, { id: 1, title: 'Sample Quiz', Questions: [] });
  });

  it('should roll back transaction if an error occurs during quiz creation', async () => {
    const quizData = { title: 'Sample Quiz' };
    const questionsData = [
      { text: 'Question 1', options: ['A', 'B', 'C'], correct_option: 1 },
      { text: 'Question 2', options: ['X', 'Y', 'Z'], correct_option: 2 }
    ];

    // Simulate an error during Quiz.create
    quizCreateStub.rejects(new Error('Error creating quiz'));

    try {
      await createQuizWithQuestions(quizData, questionsData);
    } catch (error) {
      // Check that the error was thrown
      assert.strictEqual(error.message, 'Error creating quiz');
      
      // Ensure the transaction was rolled back
      assert.strictEqual(transactionObj.rollback.calledOnce, true);
    }
  });
});
