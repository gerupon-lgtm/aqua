// 流れの計算（logic-design 4章）。落ち着いた後の状態だけを求める。
// 試作の範囲：泉1つ・グラス・出口・配管。サイフォンと水門はまだ扱わない。
//
// 回路の形：
//   spring:  { id, height }                       泉。水位が height に固定
//   springs: [{ id, height }]                     （任意）泉が2つの面（43〜48面）。あれば spring の代わりにすべてを使う
//   towers:  [{ id }]                             グラス。水位が未知
//   outlets: [{ id, tower, height, conductance }] 出口。口の高さと流れやすさ。水を出すだけ
//   pipes:   [{ id, a, b, conductance }]          つないだ配管。流れやすさ＝1÷細さ
import { Fraction, ZERO } from './fraction.js';

// 水位の決まった点（泉）。泉が2つの面では両方
export const springsOf = circuit => circuit.springs ?? [circuit.spring];
const springHeights = circuit => new Map(springsOf(circuit).map(s => [s.id, s.height]));

// 泉から配管をたどって行けるグラス（出口からはたどらない、4.1）。泉が2つなら、どちらかから行けるもの
function reachableTowers(circuit) {
  const towerIds = new Set(circuit.towers.map(t => t.id));
  const sources = springHeights(circuit);
  const seen = new Set(sources.keys());
  const queue = [...sources.keys()];
  while (queue.length) {
    const here = queue.shift();
    for (const p of circuit.pipes) {
      const next = p.a === here ? p.b : p.b === here ? p.a : null;
      if (next !== null && !seen.has(next) && towerIds.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return circuit.towers.map(t => t.id).filter(id => seen.has(id));
}

// 分数のガウスの消去法。係数行列は泉につながるグラスだけなので、解はただ1つに決まる
function solveLinear(matrix, rhs) {
  const n = rhs.length;
  const a = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col++) {
    const pivot = a.findIndex((row, r) => r >= col && !row[col].isZero());
    if (pivot < 0) throw new Error('水位が1つに決まらない回路です。');
    [a[col], a[pivot]] = [a[pivot], a[col]];
    for (let r = 0; r < n; r++) {
      if (r === col || a[r][col].isZero()) continue;
      const k = a[r][col].div(a[col][col]);
      for (let c = col; c <= n; c++) a[r][c] = a[r][c].sub(k.mul(a[col][c]));
    }
  }
  return a.map((row, i) => row[n].div(row[i]));
}

// 有効な出口の組を決めたときの水位（4.2）
export function levelsWithOutlets(circuit, towers, activeOutletIds) {
  const index = new Map(towers.map((id, i) => [id, i]));
  const n = towers.length;
  const m = Array.from({ length: n }, () => Array.from({ length: n }, () => ZERO));
  const b = Array.from({ length: n }, () => ZERO);
  const sources = springHeights(circuit);
  for (const p of circuit.pipes) {
    for (const [here, there] of [[p.a, p.b], [p.b, p.a]]) {
      if (!index.has(here) || here === there) continue;
      const i = index.get(here);
      m[i][i] = m[i][i].add(p.conductance);
      if (sources.has(there)) b[i] = b[i].add(p.conductance.mul(sources.get(there)));
      else if (index.has(there)) m[i][index.get(there)] = m[i][index.get(there)].sub(p.conductance);
    }
  }
  for (const o of circuit.outlets) {
    if (!activeOutletIds.has(o.id) || !index.has(o.tower)) continue;
    const i = index.get(o.tower);
    m[i][i] = m[i][i].add(o.conductance);
    b[i] = b[i].add(o.conductance.mul(o.height));
  }
  const solved = n ? solveLinear(m, b) : [];
  return new Map(towers.map((id, i) => [id, solved[i]]));
}

// 出口が「水を出すだけ」になっているか。等しいときはどちらでも同じ結果
function consistent(circuit, levels, active) {
  return circuit.outlets.every(o => {
    if (!levels.has(o.tower)) return true;
    const c = levels.get(o.tower).cmp(o.height);
    return active.has(o.id) ? c >= 0 : c <= 0;
  });
}

// 出口の有効・無効を繰り返して決める（4.3）。収まらなければ総当たりで探す
export function solveCircuit(circuit) {
  const towers = reachableTowers(circuit);
  const reachable = new Set(towers);
  const candidates = circuit.outlets.filter(o => reachable.has(o.tower));
  let active = new Set(candidates.map(o => o.id));
  let levels = null;
  let iterations = 0;
  const limit = 2 * candidates.length + 4;
  for (;;) {
    iterations++;
    levels = levelsWithOutlets(circuit, towers, active);
    const next = new Set();
    for (const o of candidates) {
      const c = levels.get(o.tower).cmp(o.height);
      if (c > 0 || (c === 0 && active.has(o.id))) next.add(o.id);
    }
    const same = next.size === active.size && [...next].every(id => active.has(id));
    if (same) break;
    active = next;
    if (iterations >= limit) {
      const found = bruteForceSolutions(circuit)[0];
      if (!found) throw new Error('出口の向きが決まらない回路です。');
      active = found.active;
      levels = found.levels;
      iterations = -1;
      break;
    }
  }
  return describe(circuit, levels, active, iterations);
}

// 出口の有効・無効のすべての組み合わせから、矛盾のない答えを集める（テスト用、4.3）
export function bruteForceSolutions(circuit) {
  const towers = reachableTowers(circuit);
  const reachable = new Set(towers);
  const candidates = circuit.outlets.filter(o => reachable.has(o.tower));
  const found = [];
  for (let mask = 0; mask < 1 << candidates.length; mask++) {
    const active = new Set(candidates.filter((_, i) => mask & (1 << i)).map(o => o.id));
    const levels = levelsWithOutlets(circuit, towers, active);
    if (consistent(circuit, levels, active)) found.push({ active, levels });
  }
  return found;
}

function describe(circuit, levels, active, iterations) {
  const result = { towers: {}, pipes: {}, outlets: {}, iterations };
  const sources = springHeights(circuit);
  const levelOf = id => (sources.has(id) ? sources.get(id) : levels.get(id) ?? null);
  for (const t of circuit.towers) {
    const level = levels.get(t.id) ?? null;
    result.towers[t.id] = { state: level === null ? 'empty' : 'water', level, inflow: ZERO, outflow: ZERO };
  }
  const addFlow = (id, amount) => {
    const t = result.towers[id];
    if (!t || t.state === 'empty') return;
    if (amount.sign() > 0) t.inflow = t.inflow.add(amount);
    else t.outflow = t.outflow.sub(amount);
  };
  for (const p of circuit.pipes) {
    const va = levelOf(p.a);
    const vb = levelOf(p.b);
    if (va === null || vb === null) {
      result.pipes[p.id] = { flow: ZERO, diff: ZERO, thinness: new Fraction(1n).div(p.conductance), wet: false };
      continue;
    }
    const diff = va.sub(vb);
    const flow = p.conductance.mul(diff); // a から b へ向かう量
    result.pipes[p.id] = { flow, diff, thinness: new Fraction(1n).div(p.conductance), wet: true };
    addFlow(p.b, flow);
    addFlow(p.a, flow.neg());
  }
  for (const o of circuit.outlets) {
    const v = levels.get(o.tower);
    const on = v !== undefined && active.has(o.id);
    const flow = on ? o.conductance.mul(v.sub(o.height)) : ZERO;
    result.outlets[o.id] = { flow, active: on };
    if (on) addFlow(o.tower, flow.neg());
  }
  return result;
}
