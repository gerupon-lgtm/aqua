import test from 'node:test';
import assert from 'node:assert/strict';
import { frac, Fraction } from '../src/logic/fraction.js';
import { solveCircuit, bruteForceSolutions } from '../src/logic/flow.js';

const circuit = ({ H, towers, outlets = [], pipes = [] }) => ({
  spring: { id: 'S', height: frac(H) },
  towers: towers.map(id => ({ id })),
  outlets: outlets.map(([id, tower, h, g]) => ({ id, tower, height: frac(h), conductance: frac(g) })),
  pipes: pipes.map(([id, a, b, g]) => ({ id, a, b, conductance: frac(g) }))
});
const level = (r, id) => r.towers[id].level?.toString() ?? null;

test('分数は約分され、比較は完全一致', () => {
  assert.equal(frac('6/4').toString(), '3/2');
  assert.equal(frac('1/3').add('1/6').toString(), '1/2');
  assert.ok(frac('2/4').eq('1/2'));
  assert.equal(frac('-7/2').floor(), -4n);
  assert.throws(() => frac(1).div(0));
});

test('直列：泉6、太い水路2本と出口で、流れる量2・水位4と2', () => {
  const r = solveCircuit(circuit({
    H: 6, towers: ['A', 'B'], outlets: [['O', 'B', 0, 1]],
    pipes: [['SA', 'S', 'A', 1], ['AB', 'A', 'B', 1]]
  }));
  assert.equal(level(r, 'A'), '4');
  assert.equal(level(r, 'B'), '2');
  assert.equal(r.outlets.O.flow.toString(), '2');
  assert.equal(r.pipes.SA.flow.toString(), '2');
});

test('並列：細い水路2本は太い1本と同じ量を運ぶ', () => {
  const thin = solveCircuit(circuit({
    H: 6, towers: ['A'], outlets: [['O', 'A', 0, 1]],
    pipes: [['P2', 'S', 'A', '1/2'], ['P3', 'S', 'A', '1/2']]
  }));
  assert.equal(level(thin, 'A'), '3');
  assert.equal(thin.outlets.O.flow.toString(), '3');
  assert.equal(thin.pipes.P2.flow.toString(), '3/2');
});

test('出口がない回路は泉の高さまで満ち、流れはゼロ', () => {
  const r = solveCircuit(circuit({ H: 5, towers: ['A', 'B'], pipes: [['SA', 'S', 'A', 1], ['AB', 'A', 'B', '1/3']] }));
  assert.equal(level(r, 'A'), '5');
  assert.equal(level(r, 'B'), '5');
  assert.ok(r.pipes.AB.flow.isZero());
});

test('泉につながらない塔は空のまま', () => {
  const r = solveCircuit(circuit({ H: 5, towers: ['A', 'B'], outlets: [['O', 'B', 0, 1]], pipes: [['SA', 'S', 'A', 1]] }));
  assert.equal(r.towers.B.state, 'empty');
  assert.equal(r.towers.B.level, null);
  assert.ok(r.outlets.O.flow.isZero());
});

test('出口の口が水位より高いと、その出口は流れない', () => {
  const r = solveCircuit(circuit({
    H: 4, towers: ['A', 'B'], outlets: [['LOW', 'A', 0, 1], ['HIGH', 'B', 3, 1]],
    pipes: [['SA', 'S', 'A', 1], ['AB', 'A', 'B', 1]]
  }));
  assert.equal(r.outlets.HIGH.active, false);
  assert.ok(r.outlets.HIGH.flow.isZero());
  assert.equal(level(r, 'A'), '2');
  assert.equal(level(r, 'B'), '2');
});

test('各塔で入る量と出る量の合計が等しい（第1法則）', () => {
  const r = solveCircuit(circuit({
    H: 9, towers: ['A', 'B', 'C'], outlets: [['O1', 'B', 1, 1], ['O2', 'C', 2, '1/2']],
    pipes: [['SA', 'S', 'A', 1], ['AB', 'A', 'B', '1/2'], ['AC', 'A', 'C', 2], ['BC', 'B', 'C', 1]]
  }));
  for (const t of Object.values(r.towers)) assert.ok(t.inflow.eq(t.outflow));
  for (const [id, p] of Object.entries(r.pipes)) {
    assert.ok(p.flow.eq(p.diff.div(p.thinness)), `${id}: 流れる量＝差÷細さ`);
  }
});

test('異常系：つないだ水路がない・塔がない回路でも止まらない', () => {
  assert.equal(solveCircuit(circuit({ H: 3, towers: ['A'] })).towers.A.state, 'empty');
  assert.deepEqual(solveCircuit(circuit({ H: 3, towers: [] })).towers, {});
  assert.throws(() => frac('1/0'));
});

// 出口の向きの繰り返し（4.3）を、有効・無効の総当たりと突き合わせる
function seeded(seed) {
  return () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
}
test('出口の向きの繰り返しは、総当たりの答えとただ1つ一致する（ランダム500回路）', () => {
  const rand = seeded(20261101);
  const pick = list => list[Math.floor(rand() * list.length)];
  for (let n = 0; n < 500; n++) {
    const count = 1 + Math.floor(rand() * 4);
    const ids = Array.from({ length: count }, (_, i) => `T${i}`);
    const nodes = ['S', ...ids];
    const pipes = [];
    for (let k = 0; k < 1 + Math.floor(rand() * 6); k++) {
      const a = pick(nodes); const b = pick(nodes);
      if (a !== b) pipes.push([`p${k}`, a, b, pick(['1', '1/2', '1/3', '2'])]);
    }
    const outlets = [];
    for (let k = 0; k < Math.floor(rand() * 4); k++) outlets.push([`o${k}`, pick(ids), Math.floor(rand() * 9), pick(['1', '1/2', '2'])]);
    const c = circuit({ H: 1 + Math.floor(rand() * 8), towers: ids, outlets, pipes });
    const r = solveCircuit(c);
    const answers = bruteForceSolutions(c).map(s => ids.map(id => s.levels.get(id)?.toString() ?? '-').join(' '));
    assert.ok(answers.length >= 1, `回路${n}: 矛盾のない答えがない`);
    assert.equal(new Set(answers).size, 1, `回路${n}: 答えが1つに決まらない`);
    assert.equal(ids.map(id => level(r, id) ?? '-').join(' '), answers[0], `回路${n}: 繰り返しと総当たりが食い違う`);
    assert.ok(r.iterations >= 1 && r.iterations <= 2 * outlets.length + 4, `回路${n}: 繰り返しが上限内で終わる`);
  }
});

test('Fraction は不正な値を受け付けない', () => {
  assert.throws(() => Fraction.of(0.5));
  assert.throws(() => Fraction.of('a/b'));
});
