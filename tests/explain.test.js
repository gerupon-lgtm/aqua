import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate } from '../src/logic/play.js';
import { explain, soundKind } from '../src/logic/explain.js';

const run = (index, ids) => {
  const stage = STAGES[index];
  const analysis = analyzeStage(stage);
  const ev = evaluate(stage, ids, analysis);
  return { e: explain(stage, ids, ev, analysis), ev };
};

test('NG（多すぎ）：理由と、流れにくさを増やす見直しを短く示す', () => {
  const { e } = run(0, ['SA', 'AB', 'SB']);
  assert.equal(e.summary, '噴水盤：3（指定 2）。多すぎます。');
  assert.ok(e.advice.includes('流れにくさを増やすと減ります（細く・遠く・本数を減らす）。'));
  assert.ok(e.steps.includes('グラスB 3 → 噴水盤 0：差 3 ÷ 細さ 1 ＝ 3'));
});

test('NG（届かない）：空のグラスと、つながりの見直しを示す', () => {
  const { e } = run(2, ['SA']);
  assert.match(e.summary, /右の噴水盤に水が届いていません/);
  assert.ok(e.advice.includes('グラスBが空です。泉からつながっているか見直しましょう。'));
});

test('NG（足りない）：高さの違う2つのグラスがずれると「和音が濁った」と言う', () => {
  const { e } = run(2, ['SA', 'AB']);
  assert.ok(e.advice.includes('流れにくさを減らすと増えます（太く・近く・並べる）。'));
  assert.ok(e.advice.includes('目盛りからずれたグラスがあり、和音が濁りました。'));
  assert.ok(e.balances.some(b => b.startsWith('グラスA：入る 24/5')));
});

test('クリア：100点へのヒントは、途中のグラス・流れていない水路・並べた水路を見る', () => {
  assert.ok(run(0, ['SA', 'AB']).e.advice.some(a => a.includes('（1＋1＝2）')));
  assert.ok(run(2, ['SA', 'AB', 'SB']).e.advice.includes('グラスA–グラスBは流れていないので、外せます。'));
  assert.ok(run(1, ['P2', 'P3']).e.advice.some(a => a.includes('細さ 1 の1本と同じ働き')));
});

test('同じ高さの重なりや単音は「和音」と言わない', () => {
  const same = run(2, ['SA', 'SB']);
  assert.equal(soundKind(same.ev.result), 'single');
  assert.ok(!same.e.advice.some(a => a.includes('和音')));
  assert.equal(soundKind(run(0, ['SA', 'AB']).ev.result), 'chord');
  assert.equal(soundKind(run(0, ['SB']).ev.result), 'single');
});

test('100点：理由を短く示す', () => {
  const { e } = run(0, ['SB']);
  assert.equal(e.summary, '100点。いちばん少ない本数で届けました。');
  assert.ok(e.steps.includes('泉 6 → グラスB 2：差 4 ÷ 細さ 2 ＝ 2'));
  assert.ok(e.advice.includes('グラスAはつながっていないので空です。'));
});
