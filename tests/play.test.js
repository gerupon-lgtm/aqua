import test from 'node:test';
import assert from 'node:assert/strict';
import { frac } from '../src/logic/fraction.js';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate, judge } from '../src/logic/play.js';
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

// 出題のある面（vary）は、出題ごとに tests/challenges.test.js で確かめる
for (const stage of STAGES.filter(s => !s.vary)) {
  test(`${stage.set}${stage.number}：満点は1通り、部分点のクリアがあり、クリアでは水のあるグラスがすべて音階に乗る`, () => {
    const a = analyzeStage(stage);
    assert.ok(a.perfect, '満点のつなぎ方がある');
    assert.ok(a.unique, '満点は1通り');
    assert.ok(a.clears.some(c => c.used > a.perfectCount), '部分点でクリアできるつなぎ方がある');
    for (const c of a.clears) assert.ok(c.allOnScale, `${c.ids.join('+')} で音階に乗らないグラスがある`);
    const best = evaluate(stage, a.perfectConfig, a);
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

test('水門：開いた状態と閉じた状態の両方で指定どおりならクリア', () => {
  const stage = STAGES.find(s => s.id === 'T6');
  const a = analyzeStage(stage);
  assert.deepEqual(a.perfect, ['SB', 'SB2']);
  const ev = evaluate(stage, ['SB', 'SB2'], a);
  assert.deepEqual(ev.states.map(s => s.outlets[0].flow.toString()), ['3', '2']);
  assert.equal(evaluate(stage, ['SB'], a).outcome, 'ng', '水門の水路だけだと、閉じたときに届かない');
});

test('太さを変えられる水路：選んだ太さで計算し、満点は太さまで決まる', () => {
  const stage = STAGES.find(s => s.id === 'T13');
  const a = analyzeStage(stage);
  assert.equal(a.perfectKey, 'SA:3,SB');
  assert.equal(evaluate(stage, { connected: ['SA', 'SB'], thickness: { SA: '3' } }, a).outcome, 'perfect');
  assert.equal(evaluate(stage, { connected: ['SA', 'SB'], thickness: { SA: '1' } }, a).outcome, 'ng');
});

test('サイフォン：呼び水をしないと流れず、桶の数で満点が決まる', () => {
  const stage = STAGES.find(s => s.id === 'T25');
  const a = analyzeStage(stage);
  assert.equal(a.perfectKey, 'AB+,SA');
  assert.equal(evaluate(stage, { connected: ['SA', 'AB'] }, a).outcome, 'ng', '呼び水なし');
  const two = evaluate(stage, { connected: ['SA2', 'AB'], primed: ['SA2', 'AB'] }, a);
  assert.equal(two.outcome, 'clear');
  assert.equal(two.buckets, 2);
});

test('サイフォンは上流の水面が入口より下がると切れ、切れた後の状態で判定する', () => {
  const stage = {
    spring: { id: 'S', height: '6' },
    towers: [{ id: 'A' }, { id: 'B' }],
    outlets: [{ id: 'O', tower: 'B', height: '0', conductance: '1', target: '0' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '3' },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', siphon: { crest: '8', inlet: '3' } }
    ]
  };
  const j = judge(stage, { connected: ['SA', 'AB'], primed: ['AB'] });
  // 開通したままならグラスAの水位は 2 で入口 3 より低いので切れる。切れた後はグラスAは泉と同じ 6、噴水盤には届かない
  assert.deepEqual([...j.states[0].broken], ['AB']);
  assert.equal(j.result.towers.A.level.toString(), '6');
  assert.ok(j.outlets[0].flow.isZero());
});
