import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues, drawChallenge, isTrial } from '../src/content/challenge-draw.js';
import { checkChallenge } from '../src/logic/challenge-check.js';
import { judge } from '../src/logic/play.js';
import { generateStage, PER_STAGE } from '../src/logic/generate.js';

const varied = STAGES.filter(s => s.vary);

test('出題のある面は、すべて検査済みの出題が8つまで（中身の違う数だけ、要件 v0.15）あり、2つ以上の系統に分かれる（logic-design 7.1）', () => {
  assert.ok(varied.length >= 4);
  for (const s of varied) {
    const bank = CHALLENGES[s.id];
    assert.ok(bank?.length >= 2 && bank.length <= PER_STAGE, `${s.number}面`);
    assert.deepEqual(bank.map(q => q.number), bank.map((_, i) => i + 1), `${s.number}面の出題番号`);
    const families = new Map();
    for (const item of bank) {
      assert.equal(item.baseVersion, s.version, `${item.id} の内容版`);
      if (!families.has(item.family)) families.set(item.family, new Set());
      families.get(item.family).add(item.expected.perfectKey);
    }
    assert.ok(families.size >= 2, `${s.number}面の系統`);
    // 同じ系統は満点のつなぎ方が同じ、違う系統では違う
    const keys = [...families.values()].map(set => { assert.equal(set.size, 1); return [...set][0]; });
    assert.equal(new Set(keys).size, keys.length);
  }
});

for (const s of varied) {
  test(`${s.number}面：8つの出題がすべて検査を通り、期待水位が計算と一致する（C-04）`, () => {
    for (const item of CHALLENGES[s.id]) {
      const stage = applyValues(s, item.values);
      const check = checkChallenge(stage);
      assert.deepEqual(check.problems, [], item.id);
      assert.equal(check.analysis.perfectKey, item.expected.perfectKey, item.id);
      assert.equal(check.analysis.perfectCount, item.expected.perfectCount, item.id);
      const levels = judge(stage, check.analysis.perfectConfig).result.towers;
      for (const [id, level] of Object.entries(item.expected.levels)) assert.equal(levels[id].level?.toString() ?? null, level, `${item.id} グラス${id}`);
    }
  });
}

test('検査は、わざと条件を崩した出題で失敗する（logic-design 7.2）', () => {
  const s = varied.find(x => x.id === 'T7');
  const item = CHALLENGES.T7[0];
  // 指定量を変える：満点のつなぎ方がなくなる
  const noPerfect = applyValues(s, { ...item.values, targets: Object.fromEntries(Object.keys(item.values.targets).map(k => [k, '99'])) });
  assert.ok(checkChallenge(noPerfect).problems.some(p => p.includes('満点のつなぎ方がない')));
  // 部分点の道を外す：部分点がなくなるか、満点が変わる
  const fewer = { ...s, candidates: s.candidates.filter(c => item.expected.perfectKey.split(',').includes(c.id)) };
  const r = checkChallenge(applyValues(fewer, item.values));
  assert.ok(r.problems.some(p => p.includes('部分点')), r.problems.join(' / '));
  // 泉を高くしすぎる：音域を外れる
  const high = applyValues(s, { ...item.values, spring: '40', targets: item.values.targets });
  assert.equal(checkChallenge(high).ok, false);
  // サイフォンが切れる配置（入口を高くする）は通らない
  const s25 = varied.find(x => x.id === 'T25');
  const it25 = CHALLENGES.T25[0];
  const leaky = applyValues({ ...s25, candidates: s25.candidates.map(c => (c.siphon ? { ...c, siphon: { ...c.siphon, inlet: '5' } } : c)) }, it25.values);
  assert.equal(checkChallenge(leaky).ok, false);
});

test('生成は同じ種で2回実行すると同じ結果になり、保存した出題と一致する（T-04）', () => {
  const s = varied.find(x => x.id === 'T7');
  const a = generateStage(s);
  const b = generateStage(s);
  assert.deepEqual(a, b);
  assert.deepEqual(JSON.parse(JSON.stringify(a)), CHALLENGES.T7);
});

test('抽選：お試しは固定、面を選び直すと直前と違う系統、出題がない・版違いは出題しない（logic-design 7.4）', () => {
  const trial = STAGES.find(x => x.number === 1);
  assert.equal(isTrial(trial), true);
  assert.equal(drawChallenge(trial, undefined).draw, null);
  const s = varied.find(x => x.id === 'T13');
  const bank = CHALLENGES.T13;
  const first = drawChallenge(s, bank, { random: () => 0 });
  for (const r of [0, 0.3, 0.6, 0.99]) {
    const next = drawChallenge(s, bank, { previousId: first.draw.id, random: () => r });
    assert.notEqual(next.draw.family, first.draw.family);
  }
  assert.throws(() => drawChallenge(s, []), /検査済みの出題がありません/);
  assert.throws(() => drawChallenge({ ...s, version: s.version + 1 }, bank), /内容版が一致しません/);
  assert.throws(() => drawChallenge(s, bank, { random: () => 1 }), /抽選に失敗/);
  // 当てはめた面は、出題の数値どおり
  const picked = bank[0];
  const applied = applyValues(s, picked.values);
  assert.equal(applied.spring.height, picked.values.spring);
  for (const o of applied.outlets) assert.equal(o.target, picked.values.targets[o.id]);
});
