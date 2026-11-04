// 49〜54面「総まとめ」（T-14）：水門をひとひねりとして使う（1面に2個まで）。出題は開・閉の両方の指定量を持ち、
// 満点のつなぎ方で水門を閉じると届く量が変わる（水門が答えに効く）
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { judge } from '../src/logic/play.js';
import { checkChallenge } from '../src/logic/challenge-check.js';

const FINAL = STAGES.filter(s => s.number >= 49 && s.number <= 54);

test('49〜54面は「総まとめ」の6面で、水門は1面に1〜2個', () => {
  assert.deepEqual(FINAL.map(s => s.number), [49, 50, 51, 52, 53, 54]);
  for (const s of FINAL) {
    assert.equal(s.set, '総まとめ');
    const gates = s.candidates.filter(c => c.gate).length;
    assert.ok(gates >= 1 && gates <= 2, `${s.number}面の水門 ${gates}個`);
  }
});

test('49〜54面の出題は8つずつ検査を通り、開・閉の指定量を持ち、満点で水門が効く', () => {
  for (const base of FINAL) {
    const bank = CHALLENGES[base.id];
    assert.equal(bank.length, 8, `${base.number}面`);
    assert.equal(new Set(bank.map(b => b.family)).size, 2);
    for (const item of bank) {
      const st = applyValues(base, item.values);
      for (const o of st.outlets) assert.ok(typeof o.target === 'object' && 'open' in o.target && 'closed' in o.target);
      const check = checkChallenge(st);
      assert.ok(check.ok, `${item.id}：${check.problems.join('、')}`);
      const j = judge(st, check.analysis.perfectConfig);
      assert.equal(j.states.length, 2);
      assert.ok(j.states[0].outlets.some((o, i) => !o.flow.eq(j.states[1].outlets[i].flow)), `${item.id}：水門を閉じても届く量が変わらない`);
    }
  }
});

test('53面は排水口の面（捨てる水の少なさ→本数）、54面は給水塔が2つ', () => {
  assert.equal(FINAL.find(s => s.number === 53).theme, 'drain');
  assert.ok(FINAL.find(s => s.number === 54).spring2);
});
