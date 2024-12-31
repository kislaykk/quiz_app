const sinon = require('sinon');
const assert = require('assert');
const { getResult } = require('../services/resultService'); // Adjust the path
const { Quiz, Result, Question, Answer } = require('../models'); // Adjust the path

describe('getResult', () => {
  let rfindOneStub, qfindOneStub, findAllStub, createStub;

  beforeEach(() => {
    // Create stubs for the `findOne`, `findAll` and `create` methods
    rfindOneStub = sinon.stub();
    qfindOneStub = sinon.stub();
    findAllStub = sinon.stub();
    createStub = sinon.stub();

    // Mock the `Result`, `Quiz`, `Question`, and `Answer` models
    Result.findOne = rfindOneStub;
    Quiz.findOne = qfindOneStub;
    Answer.findAll = findAllStub;
    Result.create = createStub;
  });

  afterEach(() => {
    // Reset stubs after each test
    sinon.restore();
  });

  it('should return the result if it already exists in the Result table', async () => {
    // Stub `findOne` to simulate an existing result for the user and quiz
    rfindOneStub.resolves({
      quiz_id: 1,
      user_id: 101,
      score: 85,
      answers: [{ question_id: 1, is_correct: true }],
    });

    const result = await getResult(1, 101);

    assert.strictEqual(result.found, true);
    assert.strictEqual(result.data.quiz_id, 1);
    assert.strictEqual(result.data.user_id, 101);
    assert.strictEqual(result.data.score, 85);
    assert.deepStrictEqual(result.data.answers, [{ question_id: 1, is_correct: true }]);
    assert.strictEqual(rfindOneStub.calledOnce, true); // Ensure `findOne` was called once
  });

  it('should return "Quiz not found" if the quiz does not exist', async () => {
    // Stub `findOne` to simulate no quiz found
    rfindOneStub.resolves(null);
    qfindOneStub.resolves(null);

    const result = await getResult(1, 101);

    assert.strictEqual(result.found, false);
    assert.strictEqual(result.message, 'Quiz not found.');
    assert.strictEqual(qfindOneStub.calledOnce, true); // Ensure `findOne` was called once
    assert.strictEqual(rfindOneStub.calledOnce, true); // Ensure `findOne` was called once

  });

  it('should return "Incomplete answers" if not all questions are answered', async () => {
    rfindOneStub.resolves(null);
    // Stub `findOne` to simulate quiz and questions exist
    qfindOneStub.resolves({
      id: 1,
      Questions: [{ id: 1 }, { id: 2 }],
    });
    findAllStub.resolves([
      { question_id: 1, selected_option: 2, answered_by: 101 },
    ]); // Only 1 out of 2 questions answered

    const result = await getResult(1, 101);

    assert.strictEqual(result.found, false);
    assert.strictEqual(result.message, 'Incomplete answers. Only 1 out of 2 questions answered.');
    assert.strictEqual(rfindOneStub.calledOnce, true); // Ensure `findOne` was called twice
    assert.strictEqual(qfindOneStub.calledOnce, true); // Ensure `findOne` was called twice
    assert.strictEqual(findAllStub.calledOnce, true); // Ensure `findAll` was called once
  });

  it('should calculate the score and save the result if all questions are answered', async () => {
    // Stub `findOne` to simulate quiz and questions exist
    rfindOneStub.resolves(null)
    qfindOneStub.resolves({
      id: 1,
      Questions: [
        { id: 1, correct_option: 2, text: 'Question 1', options: ['Option 1', 'Option 2'] },
        { id: 2, correct_option: 3, text: 'Question 2', options: ['Option 1', 'Option 2', 'Option 3'] },
      ],
    });
    findAllStub.resolves([
      { question_id: 1, selected_option: 2, answered_by: 101 }, // Correct answer
      { question_id: 2, selected_option: 2, answered_by: 101 }, // Wrong answer
    ]);

    // Stub `create` to simulate saving the result
    createStub.resolves({
      quiz_id: 1,
      user_id: 101,
      score: '50.00', // 1 out of 2 correct
      answers: [
        {
          question_id: 1,
          question_text: 'Question 1',
          selected_option: '2. Option 2',
          correct_option: '2. Option 2',
          is_correct: true,
        },
        {
          question_id: 2,
          question_text: 'Question 2',
          selected_option: '2. Option 2',
          correct_option: '3. Option 3',
          is_correct: false,
        },
      ],
    });

    const result = await getResult(1, 101);

    assert.strictEqual(result.found, true);
    assert.strictEqual(result.data.quiz_id, 1);
    assert.strictEqual(result.data.user_id, 101);
    assert.strictEqual(result.data.score, '50.00');
    assert.strictEqual(result.data.correctAnswers, 1);
    assert.strictEqual(result.data.totalQuestions, 2);
    assert.deepStrictEqual(result.data.detailedAnswers, [
      {
        question_id: 1,
        question_text: 'Question 1',
        selected_option: '2. Option 2',
        correct_option: '2. Option 2',
        is_correct: true,
      },
      {
        question_id: 2,
        question_text: 'Question 2',
        selected_option: '2. Option 2',
        correct_option: '3. Option 3',
        is_correct: false,
      },
    ]);
    assert.strictEqual(createStub.calledOnce, true); // Ensure `create` was called once
  });

  it('should throw an error if there is an issue during processing', async () => {
    // Stub `findOne` to simulate an error
    rfindOneStub.rejects(new Error('Database error'));

    try {
      await getResult(1, 101);
      assert.fail('Expected error to be thrown');
    } catch (error) {
      assert.strictEqual(error.message, 'Failed to process the result.');
    }
  });
});
