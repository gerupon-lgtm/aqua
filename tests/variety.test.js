// 出題の重なり（要件 v0.14、2026-11-05 発案者）：同じ系統の中に、給水塔の高さと届ける量が同じ出題を重ねない。
// 管の並びの都合で中身の違う出題が4つ作れない面だけ、作れる数まで重ならないようにして、残りを重ねる（下の表）
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';

// 面の番号 → [系統Aの中身の数, 系統Bの中身の数]。ここにない面は 4・4
const LIMITED = { 13: [4, 3], 14: [4, 3], 18: [4, 3], 19: [2, 2], 20: [2, 2], 38: [2, 2], 40: [2, 2], 49: [2, 1], 50: [4, 3], 51: [3, 3], 52: [4, 2] };

test('同じ系統の中で、中身（給水塔の高さと届ける量）の違う出題の数', () => {
  for (const st of STAGES.filter(s => s.vary)) {
    const bank = CHALLENGES[st.id];
    const count = f => new Set(bank.filter(q => q.family === f).map(q => JSON.stringify([q.values.spring, q.values.spring2 ?? null, q.values.targets]))).size;
    assert.deepEqual([count('A'), count('B')], LIMITED[st.number] ?? [4, 4], `${st.number}面`);
  }
});
