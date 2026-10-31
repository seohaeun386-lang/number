import test from 'node:test';
import assert from 'node:assert/strict';
import { makeQuestion, advance } from '../game.js';
test('generated questions have correct integer answers across all difficulty tiers', () => {
  const operators = new Set();
  for (const level of [1, 3, 5, 8, 50]) {
    for (let i = 0; i < 500; i++) {
      const q = makeQuestion(level);
      const [a, op, b] = q.text.split(' ');
      operators.add(op);
      const expected = op === '+' ? +a + +b : op === '−' ? a - b : op === '×' ? a * b : a / b;
      assert.equal(q.answer, expected);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0);
      if (level === 1) assert.equal(op, '+');
    }
  }
  assert.equal(operators.size, 4);
});
test('five correct answers advance the level and increase subsequent rewards', () => {
  let state = { level: 1, progress: 0, score: 0, streak: 0 };
  for (let i = 0; i < 5; i++) state = advance(state, true);
  assert.deepEqual(state, { level: 2, progress: 0, score: 50, streak: 5 });
  assert.equal(advance(state, true).score, 70);
  assert.deepEqual(advance(state, false), { ...state, streak: 0 });
});
