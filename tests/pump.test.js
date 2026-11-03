// 手押しポンプ（F-007、31〜36面）：汲める条件、桶に数えないこと、出題の検査
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { pumpCheck, judge, allConfigs, configKey, analyzeStage } from '../src/logic/play.js';
import { checkChallenge } from '../src/logic/challenge-check.js';

const stageOf = (number, values) => {
  const base = STAGES.find(s => s.number === number);
  return values ? applyValues(base, values) : base;
};

test('31〜36面がそろい、どの面も8つの検査済みの出題を持つ', () => {
  assert.deepEqual(STAGES.filter(s => s.number >= 31).map(s => s.number), [31, 32, 33, 34, 35, 36]);
  for (const s of STAGES.filter(x => x.number >= 31)) {
    assert.equal(CHALLENGES[s.id].length, 8, `${s.number}面`);
    for (const q of CHALLENGES[s.id]) assert.ok(checkChallenge(applyValues(s, q.values)).ok, q.id);
  }
});

test('31〜36面の満点は、どの出題もポンプで呼び水をし、桶を使わない', () => {
  for (const s of STAGES.filter(x => x.number >= 31)) for (const q of CHALLENGES[s.id]) {
    const a = analyzeStage(applyValues(s, q.values));
    assert.ok(a.perfectConfig.pumped.length >= 1, q.id);
    assert.equal(a.perfectBuckets, 0, q.id);
  }
});

test('ポンプは、そのサイフォンを除いて落ち着いたグラスの水位が入口以上のときだけ汲める', () => {
  // 32面：Aにも噴水盤（出口の管は太1）がある。泉の高さ6・細3の道1本ではAの水位が 6×(1/3)÷(1/3＋1)＝3/2 で入口2に届かず、
  // 細3を2本並べると 6×(2/3)÷(2/3＋1)＝12/5 で届く
  const s = stageOf(32, { spring: '6', thinness: { SA: '3', SA2: '3', ABs: '1' }, targets: { O1: '1', O2: '1' } });
  const one = pumpCheck(s, { connected: ['SA', 'ABs'] }, 'ABs');
  assert.equal(one.ok, false);
  assert.equal(one.level.toString(), '3/2');
  const two = pumpCheck(s, { connected: ['SA', 'SA2', 'ABs'] }, 'ABs');
  assert.equal(two.ok, true);
  assert.equal(two.level.toString(), '12/5');
  // Aに水が来ないときは汲めない
  assert.equal(pumpCheck(s, { connected: ['ABs'] }, 'ABs').level, null);
});

test('ポンプの呼び水は桶に数えず、つなぎ方の名前では「*」で区別する', () => {
  const s = stageOf(31, CHALLENGES.T31[0].values);
  const pumped = judge(s, { connected: ['SA', 'ABs'], primed: ['ABs'], pumped: ['ABs'] });
  const bucket = judge(s, { connected: ['SA', 'ABs'], primed: ['ABs'] });
  assert.equal(pumped.buckets, 0);
  assert.equal(bucket.buckets, 1);
  assert.equal(configKey({ connected: ['SA', 'ABs'], primed: ['ABs'], pumped: ['ABs'] }), 'ABs*,SA');
  assert.equal(configKey({ connected: ['SA', 'ABs'], primed: ['ABs'] }), 'ABs+,SA');
  // 同じ流れなら桶よりポンプが満点（観点：桶の数 → 本数）
  assert.equal(analyzeStage(s).perfectKey.includes('ABs*'), true);
});

test('汲めないつなぎ方のポンプは、選べるつなぎ方に含めない', () => {
  const s = stageOf(32, { spring: '6', thinness: { SA: '3', SA2: '3', ABs: '1' }, targets: { O1: '1', O2: '1' } });
  const keys = allConfigs(s).map(configKey);
  assert.ok(!keys.includes('ABs*,SA'));
  assert.ok(keys.includes('ABs*,SA,SA2'));
  assert.ok(keys.includes('ABs+,SA'));
});

test('切れるサイフォンを扱う面でも、満点のつなぎ方は切れない', () => {
  for (const s of STAGES.filter(x => x.mayBreak)) for (const q of CHALLENGES[s.id]) {
    const st = applyValues(s, q.values);
    const j = judge(st, analyzeStage(st).perfectConfig);
    assert.ok(j.states.every(x => !x.broken.size), q.id);
  }
});
