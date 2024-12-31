const assert = require('assert');
const sinon = require('sinon');
const { sequelize, Quiz, Question } = require('../models');
const { createQuizWithQuestions, getQuiz } = require('../services/quizService');

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
    assert.deepStrictEqual(result, { id: 1});
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

describe('getQuiz', () => {
  let findOneStub;

  beforeEach(() => {
    // Stub the `findOne` method of the Quiz model
    findOneStub = sinon.stub(Quiz, 'findOne');
  });

  afterEach(() => {
    // Restore the stubbed methods
    sinon.restore();
  });

  it('should return quiz details with questions if quiz is found', async () => {
    // Mock data for Quiz and its associated Questions
    const mockQuiz = {
      id: 1,
      title: 'Sample Quiz',
      Questions: [
        { id: 1, text: 'What is 2 + 2?', options: ['1', '2', '3', '4'] },
        { id: 2, text: 'What is the capital of France?', options: ['Berlin', 'Paris', 'Rome', 'Madrid'] },
      ],
    };

    // Stub the `findOne` method to return mock data
    findOneStub.resolves(mockQuiz);

    // Call the function
    const result = await getQuiz(1);

    // Assert the result
    assert.deepStrictEqual(result, {
      title: 'Sample Quiz',
      id: 1,
      questions: [
        { id: 1, text: 'What is 2 + 2?', options: ['1', '2', '3', '4'] },
        { id: 2, text: 'What is the capital of France?', options: ['Berlin', 'Paris', 'Rome', 'Madrid'] },
      ],
    });

    // Verify the stub was called with the correct arguments
    sinon.assert.calledOnceWithExactly(findOneStub, {
      where: { id: 1 },
      attributes: ['title', 'id'],
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'options'],
        },
      ],
    });
  });

  it('should return a "Quiz not found" message if no quiz is found', async () => {
    // Stub the `findOne` method to return null
    findOneStub.resolves(null);

    // Call the function
    const result = await getQuiz(99);

    // Assert the result
    assert.deepStrictEqual(result, { message: 'Quiz not found' });

    // Verify the stub was called with the correct arguments
    sinon.assert.calledOnceWithExactly(findOneStub, {
      where: { id: 99 },
      attributes: ['title', 'id'],
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'options'],
        },
      ],
    });
  });

  it('should throw an error if an exception occurs', async () => {
    // Stub the `findOne` method to throw an error
    findOneStub.rejects(new Error('Database error'));

    // Call the function and assert it throws an error
    try {
      await getQuiz(1);
      // Fail the test if no error is thrown
      assert.fail('Expected error was not thrown');
    } catch (error) {
      assert.strictEqual(error.message, 'Database error');
    }

    // Verify the stub was called
    sinon.assert.calledOnce(findOneStub);
  });
});