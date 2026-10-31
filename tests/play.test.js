import test from 'node:test';
import assert from 'node:assert/strict';
import { frac } from '../src/logic/fraction.js';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate } from '../src/logic/play.js';
import { pipeScore, displayScore } from '../src/logic/score.js';
import { onScale, tickSide, frequencyForMidi, midiForLevel } from '../src/logic/pitch.js';

test('部分点の式：50＋50×満点の本数÷使った本数、満点以外は99.99まで', () => {
  assert.equal(displayScore(pipeScore({ used: 3, perfectCount: 3, isPerfect: true })), '100.00');
  assert.equal(displayScore(pipeScore({ used: 4, perfectCount: 3, isPerfect: false })), '87.50');
  assert.equal(displayScore(pipeScore({ used: 2, perfectCount: 1, isPerfect: false })), '75.00');
  assert.equal(displayScore(pipeScore({ used: 3, perfectCount: 2, isPerfect: false })), '83.33');
  assert.equal(displayScore(pipeScore({ used: 2, perfectCount: 3, isPerfect: false })), '99.99');
});

test('音：目盛りに完全一致で「乗っている」、水位が高いほど低い音', () => {
  assert.ok(onScale(frac(4)));
  assert.ok(!onScale(frac('9/2')));
  assert.equal(tickSide(frac('9/2')), 'above');
  assert.equal(tickSide(frac('19/4')), 'below');
  assert.equal(frequencyForMidi(69), 440);
  assert.ok(midiForLevel(frac(5)) < midiForLevel(frac(2)));
});

for (const stage of STAGES) {
  test(`お試し${stage.number}：満点は1通り、部分点のクリアがあり、クリアでは水のある塔がすべて音階に乗る`, () => {
    const a = analyzeStage(stage);
    assert.ok(a.perfect, '満点のつなぎ方がある');
    assert.ok(a.unique, '満点は1通り');
    assert.ok(a.clears.some(c => c.used > a.perfectCount), '部分点でクリアできるつなぎ方がある');
    for (const c of a.clears) assert.ok(c.allOnScale, `${c.ids.join('+')} で音階に乗らない塔がある`);
    const best = evaluate(stage, a.perfect, a);
    assert.equal(best.outcome, 'perfect');
    assert.equal(displayScore(best.score), '100.00');
  });
}

test('お試し1：直接の細い水路が満点、太い2本は部分点、3本はNG', () => {
  const stage = STAGES[0];
  const a = analyzeStage(stage);
  assert.deepEqual(a.perfect, ['SB']);
  assert.equal(evaluate(stage, ['SA', 'AB'], a).outcome, 'clear');
  assert.equal(displayScore(evaluate(stage, ['SA', 'AB'], a).score), '75.00');
  const all = evaluate(stage, ['SA', 'AB', 'SB'], a);
  assert.equal(all.outcome, 'ng');
  assert.equal(all.outlets[0].verdict, 'over');
});
