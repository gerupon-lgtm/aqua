// 和音（要件 v0.12、2026-11-04 発案者）：噴水盤が3つの10面・23面は、満点の答えで3つのグラスが3和音を鳴らす。
// 自由作成の見本「和音のお題」は、印に合わせると C メジャーの和音になり、達成できる
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { judge } from '../src/logic/play.js';
import { triadOf } from '../src/logic/pitch.js';
import { frac } from '../src/logic/fraction.js';
import { FREE_SAMPLES } from '../src/content/free-samples.js';
import * as F from '../src/logic/free.js';

test('3和音の判定：C・E・G はCメジャー、A・C・E はAマイナー。重なる音・目盛りの間・2音は和音にしない', () => {
  assert.equal(triadOf(['5', '3', '2'].map(frac)).name, 'Cメジャー'); // C6・E6・G6
  assert.equal(triadOf(['6', '5', '3'].map(frac)).name, 'Aマイナー'); // A5・C6・E6
  assert.equal(triadOf(['3', '3', '2'].map(frac)), null);
  assert.equal(triadOf(['5', '0', '2'].map(frac)), null); // C6・C7・G6 は音名が C と G の2つだけ
  assert.equal(triadOf(['5', '3', '5/2'].map(frac)), null); // 目盛りの間
});

// 要件 v0.13（2026-11-05）：和音の出題は一部だけ。10面は各系統1問（2問）、23面は A マイナーの1問。
// 残りは普段の出題で、同じ系統の中に給水塔の高さと届ける量が同じ出題を重ねない（8問とも中身が違う）
test('10面・23面：和音の出題は一部だけ（10面は各系統1問、23面は1問）。8問とも中身が違い、つなぎ方の形が違う2系統', () => {
  for (const [n, chordsPerFamily] of [[10, [1, 1]], [23, [1, 0]]]) {
    const base = STAGES.find(s => s.number === n);
    assert.equal(base.version, 3);
    const bank = CHALLENGES[base.id];
    assert.equal(bank.length, 8);
    const shapes = new Set(bank.map(q => q.expected.perfectKey.split(',').map(id => id.replace(/\d+$/, '')).sort().join(',')));
    assert.equal(shapes.size, 2, `${n}面の系統の形`);
    const chords = { A: 0, B: 0 };
    for (const fam of ['A', 'B']) {
      const mine = bank.filter(q => q.family === fam);
      const contents = new Set(mine.map(q => JSON.stringify([q.values.spring, q.values.targets])));
      assert.equal(contents.size, 4, `${n}面の系統${fam}に中身の同じ出題がある`);
      for (const q of mine) {
        const st = applyValues(base, q.values);
        const j = judge(st, q.expected.perfectKey.split(','));
        if (triadOf(st.towers.map(t => j.result.towers[t.id].level))) chords[fam] += 1;
      }
    }
    assert.deepEqual([chords.A, chords.B], chordsPerFamily, `${n}面の和音の出題の数`);
  }
});

test('自由作成の見本「和音のお題」：始めは未達成、答えの一例で達成（Cメジャー）', () => {
  const sample = FREE_SAMPLES.find(s => s.id === 'chord');
  let c = F.validateCircuit(sample.circuit());
  assert.equal(F.goalResult(sample.goal, F.evaluateFree(c)).done, false);
  c = F.updatePipe(c, 'SB', { thinness: '2' });
  c = F.removePipeFrom(c, 'SC');
  c = F.addPipe(c, 'B', 'C');
  c = F.addPipe(c, 'A', 'C');
  c = F.updatePipe(c, 'AC', { thinness: '3' });
  const r = F.evaluateFree(c);
  const g = F.goalResult(sample.goal, r);
  assert.ok(g.done);
  assert.equal(triadOf(g.rows.map(x => x.level)).name, 'Cメジャー');
});
