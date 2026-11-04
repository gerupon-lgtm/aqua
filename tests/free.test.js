// 自由作成（T-07、F-016）：置いた回路を課題と同じ計算で流す（C-02）。持ち上げた管は水位から自動でサイフォンになる（要件5.2）
import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../src/logic/free.js';
import { STAGES } from '../src/content/stages.js';
import { judge } from '../src/logic/play.js';
import { FREE_SAMPLES } from '../src/content/free-samples.js';

const build = (...steps) => steps.reduce((c, f) => f(c), F.emptyCircuit());

test('課題と同じ計算：1面と同じ回路を自由作成で作ると、届く量と水位が同じ', () => {
  const t1 = STAGES.find(s => s.number === 1);
  const expected = judge(t1, ['SA', 'AB']);
  // 1面：給水塔6、グラスA・B、Bに噴水盤（口0）、S–A 太、A–B 太
  const c = build(c => ({ ...c, spring: { height: '6' } }), c => F.addTower(c, 0), c => F.addTower(c, 1), c => F.setOutlet(c, 'B', '0'), c => F.addPipe(c, 'S', 'A'), c => F.addPipe(c, 'A', 'B'));
  const r = F.evaluateFree(c);
  assert.equal(r.outlets[0].flow.toString(), expected.outlets[0].flow.toString());
  for (const id of ['A', 'B']) assert.equal(r.result.towers[id].level.toString(), expected.result.towers[id].level.toString());
});

test('持ち上げた管：山が上流の水面より高いとサイフォン（呼び水なしでは流れない）、低いとふつうに流れる', () => {
  let c = build(c => F.addTower(c, 0), c => F.addTower(c, 1), c => F.setOutlet(c, 'B', '0'), c => F.addPipe(c, 'S', 'A'), c => F.addPipe(c, 'A', 'B'));
  const plain = F.evaluateFree(c);
  const levelA = plain.result.towers.A.level; // 16/3
  assert.equal(levelA.toString(), '16/3');
  // 山4：水面（16/3）より低いので、ふつうの管と同じに流れる
  c = F.updatePipe(c, 'AB', { crest: '4' });
  let r = F.evaluateFree(c);
  assert.deepEqual([...r.siphons], []);
  assert.deepEqual([...r.flowingLifted], ['AB']);
  assert.equal(r.outlets[0].flow.toString(), plain.outlets[0].flow.toString());
  // 山6：水面より高いのでサイフォン。呼び水がないと流れない
  c = F.updatePipe(c, 'AB', { crest: '6' });
  r = F.evaluateFree(c);
  assert.deepEqual([...r.siphons], ['AB']);
  assert.ok(r.outlets[0].flow.isZero());
  // 桶で呼び水をすると流れる（桶は使い放題）
  c = F.setPrimed(c, 'AB', true);
  r = F.evaluateFree(c);
  assert.equal(r.outlets[0].flow.toString(), plain.outlets[0].flow.toString());
  // 下ろすと呼び水は外れる
  assert.deepEqual(F.updatePipe(c, 'AB', { crest: null }).primed, []);
});

test('サイフォンは上流の水位が入口（高さ1）より下がると切れる', () => {
  // 給水塔4 → A（口0の噴水盤）へ細い管、A → B へ持ち上げた太い管（呼び水あり）、B に口0の噴水盤。
  // A の水位は 1 より下がり、サイフォンは切れる
  let c = build(c => F.setSpringHeight(c, '4'), c => F.addTower(c, 0), c => F.addTower(c, 1), c => F.setOutlet(c, 'A', '0'), c => F.setOutlet(c, 'B', '0'),
    c => F.addPipe(c, 'S', 'A'), c => F.updatePipe(c, 'SA', { thinness: '3' }), c => F.addPipe(c, 'A', 'B'), c => F.updatePipe(c, 'AB', { crest: '5' }), c => F.setPrimed(c, 'AB', true));
  const r = F.evaluateFree(c);
  assert.ok(r.states[0].broken.has('AB'));
});

test('水門のある管は、開いた状態と閉じた状態の両方を計算する', () => {
  const c = build(c => F.addTower(c, 0), c => F.setOutlet(c, 'A', '0'), c => F.addPipe(c, 'S', 'A'), c => F.addPipe(c, 'S', 'A'), c => F.updatePipe(c, 'SA2', { gate: true }));
  const r = F.evaluateFree(c);
  assert.equal(r.states.length, 2);
  assert.ok(r.states[0].outlets[0].flow.cmp(r.states[1].outlets[0].flow) > 0);
});

test('編集：置き場所は3つまで・同じ場所に2つ置けない。グラスを外すと、つながる管も外れる', () => {
  let c = build(c => F.addTower(c, 0), c => F.addTower(c, 2));
  assert.throws(() => F.addTower(c, 0));
  assert.throws(() => F.addTower(c, 3));
  c = F.addPipe(c, 'S', 'A');
  c = F.addPipe(c, 'C', 'A');
  assert.deepEqual(c.pipes.map(p => p.id), ['SA', 'AC']); // 名前は左から
  c = F.removeTower(c, 'A');
  assert.deepEqual(c.pipes, []);
  assert.deepEqual(c.towers.map(t => t.id), ['C']);
});

test('地面の下は4段まで。5段目が要る管はつながず、理由を出す（持ち上げた管は段を使わない）', () => {
  let c = build(c => F.addTower(c, 0));
  for (let i = 0; i < 4; i++) c = F.addPipe(c, 'S', 'A');
  assert.throws(() => F.addPipe(c, 'S', 'A'), /地面の下がいっぱい/);
  c = F.updatePipe(c, 'SA', { crest: '9' });
  c = F.addPipe(c, 'S', 'A');
  assert.equal(c.pipes.length, 5);
});

test('給水塔を低くすると、噴水盤の口と山はその範囲に収まる', () => {
  let c = build(c => F.addTower(c, 0), c => F.setOutlet(c, 'A', '6'), c => F.addPipe(c, 'S', 'A'), c => F.updatePipe(c, 'SA', { crest: '10' }));
  c = F.setSpringHeight(c, '5');
  assert.equal(c.towers[0].outlet.height, '4');
  assert.equal(c.pipes[0].crest, '7');
  assert.equal(F.validateCircuit(c), c);
});

test('回路の検査：形式・値の違う回路は理由つきで受け付けない', () => {
  const ok = FREE_SAMPLES[0].circuit();
  assert.equal(F.validateCircuit(ok), ok);
  const broken = [
    null,
    { ...ok, spring: { height: '99' } },
    { ...ok, towers: [{ id: 'A', slot: 5, outlet: null }] },
    { ...ok, towers: [{ id: 'B', slot: 0, outlet: null }] },
    { ...ok, pipes: [{ ...ok.pipes[0], thinness: '4' }] },
    { ...ok, pipes: [{ ...ok.pipes[0], b: 'Z' }] },
    { ...ok, pipes: [{ ...ok.pipes[0], crest: '0' }] },
    { ...ok, primed: ['SA'] } // 持ち上げていない管の呼び水
  ];
  for (const c of broken) assert.throws(() => F.validateCircuit(c), /回路が正しくありません/);
});

test('見本はどれも検査を通り、流せる', () => {
  for (const s of FREE_SAMPLES) {
    const c = F.validateCircuit(s.circuit());
    const r = F.evaluateFree(c);
    assert.ok(r.outlets.some(o => o.flow.sign() > 0), s.name);
  }
});
