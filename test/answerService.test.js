const sinon = require('sinon');
const assert = require('assert');
const { submitAnswer } = require('../services/ansService');
const { Answer, Question } = require('../models');
const errorCodes = require('../config/errorCodes.json');

describe('submitAnswer', () => {
  let answerFindOneStub,questionFindOneStub ,createStub;

  beforeEach(() => {
    // Create stubs for the `findOne` and `create` methods
    answerFindOneStub = sinon.stub();
    questionFindOneStub = sinon.stub();
    createStub = sinon.stub();

    // Mock the `Answer` and `Question` models
    Answer.findOne = answerFindOneStub;
    Question.findOne = questionFindOneStub;
    Answer.create = createStub;
  });

  afterEach(() => {
    // Reset stubs after each test
    sinon.restore();
  });

  it('should throw error "Already answered" if the user has already answered the question', async () => {
    // Stub `findOne` to simulate that an answer already exists for the user and question
    answerFindOneStub.resolves({}); // Return a dummy object to simulate an existing answer
    try {
      const result = await submitAnswer(1, 1, 101, 2);
      assert.fail('Expected error to be thrown');
    } catch (error) {
      assert.strictEqual(error.code, errorCodes.duplicateAttemp);
      assert.strictEqual(error.message, 'Already Answered');
      assert.strictEqual(answerFindOneStub.calledOnce, true); // Ensure `findOne` was called once
    }

  });

  it('should throw error "Question not found or does not belong to the quiz" if the question does not exist or does not belong to the quiz', async () => {
    // Stub `findOne` to simulate that the question is not found
    answerFindOneStub.resolves(null); // No question found
    questionFindOneStub.resolves(null);
    try {
      const result = await submitAnswer(1, 1, 101, 2);
      assert.fail('Expected to fail');     
    } catch (error) {
      assert.strictEqual(error.code, errorCodes.notFound.question);
      assert.strictEqual(error.message, 'Question not found or does not belong to the quiz');
      assert.strictEqual(answerFindOneStub.calledOnce, true);
      assert.strictEqual(questionFindOneStub.calledOnce, true);
    }


  });

  it('should return "Correct answer" if the selected option is correct', async () => {
    // Stub `findOne` to simulate a valid question with correct option = 2
    questionFindOneStub.resolves({ correct_option: 2 }); // Question found with correct option 2
    answerFindOneStub.resolves(null); // Simulate no previous answer for the user

    // Stub `create` to simulate saving the answer
    createStub.resolves();

    const result = await submitAnswer(1, 1, 101, 2); // Correct answer

    assert.strictEqual(result.message, 'Correct answer');
    assert.strictEqual(createStub.calledOnce, true); // Ensure `create` was called once
  });

  it('should return "Wrong answer" with the correct option if the selected option is wrong', async () => {
    // Stub `findOne` to simulate a valid question with correct option = 2
    questionFindOneStub.resolves({ correct_option: 2 }); // Question found with correct option 2
    answerFindOneStub.resolves(null); // Simulate no previous answer for the user

    // Stub `create` to simulate saving the answer
    createStub.resolves();

    const result = await submitAnswer(1, 1, 101, 3); // Wrong answer (3 instead of 2)

    assert.strictEqual(result.message, 'Wrong answer');
    assert.strictEqual(result.correctOption, 2); // Return the correct option
    assert.strictEqual(createStub.calledOnce, true); // Ensure `create` was called once
  });

  it('should throw an error if there is an issue during the answer submission', async () => {
    // Stub `findOne` to simulate an error
    questionFindOneStub.rejects(new Error('Database error'));

    try {
      await submitAnswer(1, 1, 101, 2);
      assert.fail('Expected error to be thrown');
    } catch (error) {
      assert.strictEqual(error.message, 'Database error');
    }
  });
});
