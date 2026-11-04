// 自由作成（T-07、F-016）：自分で置いた回路を、課題と同じ計算で流す（C-02）。
// 回路（circuit）は次の形。保存・回路ファイルにもこの形を使う（D-07・D-10）。
//   spring：{ height }                   給水塔（左端に1つで固定。初期版の自由作成は泉1つ、要件 F-016）
//   towers：[{ id, slot, outlet }]       グラス。slot は決まった置き場所 0〜2（2026-11-04 発案者が選択）。
//                                         outlet は噴水盤 { height } か null（グラスに1つまで）
//   pipes：[{ id, a, b, thinness, crest, gate }]
//         thinness：'1' 太・'2' 中・'3' 細。crest：つまみで持ち上げた山の高さ（目盛り単位）か null。
//         gate：水門（開いた状態のあと自動で閉じる）
//   primed：[配管ID]                     桶で呼び水をした管（桶は使い放題、要件5.2）
// 持ち上げた管の入口は、課題と同じ高さ1に固定（2026-11-04 発案者が選択）。
// サイフォンかどうかは水位から自動で決める（要件5.2）：山が上流の水面より高い管がサイフォン。
// 一度サイフォンと決まった管は、その実行の間サイフォンのまま（判定は増える一方なので必ず終わる）
import { frac } from './fraction.js';
import { judge } from './play.js';

export const FREE_FORMAT = 'aqua-notes-circuit';
export const FREE_VERSION = 1;
export const FREE_SLOTS = Object.freeze([3.6, 5.9, 8.2]); // グラスの置き場所（横位置 0〜10）
export const TOWER_IDS = Object.freeze(['A', 'B', 'C']);   // 置き場所ごとの名前（左から A・B・C）
export const SPRING_HEIGHTS = Object.freeze(['4', '5', '6', '7', '8', '9', '10', '11', '12']);
export const SIPHON_INLET = '1';
export const MAX_DEPTH = 4; // 地面の下の段の数（課題と同じ上限）
const SPRING_X = 1.1;

export const emptyCircuit = () => ({ spring: { height: '8' }, towers: [], pipes: [], primed: [] });

const xOf = (circuit, id) => (id === 'S' ? SPRING_X : FREE_SLOTS[circuit.towers.find(t => t.id === id).slot]);

// 地面の下の段：横に重なる管（端で接するだけは重ならない）は違う段にする。短い管から順に浅い段へ。
// 持ち上げた管は地面の下を通らないので段を使わない
export function assignDepths(circuit) {
  const span = p => { const a = xOf(circuit, p.a), b = xOf(circuit, p.b); return [Math.min(a, b), Math.max(a, b)]; };
  const under = circuit.pipes.filter(p => !p.crest);
  const sorted = [...under].sort((p, q) => (span(p)[1] - span(p)[0]) - (span(q)[1] - span(q)[0]) || p.id.localeCompare(q.id));
  const depth = new Map();
  for (const p of sorted) {
    const [l, r] = span(p);
    let d = 1;
    while (sorted.some(q => depth.get(q.id) === d && Math.max(l, span(q)[0]) < Math.min(r, span(q)[1]) - 1e-9)) d++;
    depth.set(p.id, d);
  }
  return depth;
}

// 自由作成の回路を、課題の面と同じ形（stage）にする。siphons：計算でサイフォンとして扱う管のID
// （省略すると、持ち上げた管をすべてサイフォンとして描く形になる。盤面の描画に使う）
export function freeStage(circuit, siphons = null) {
  const depth = assignDepths(circuit);
  const towers = [...circuit.towers].sort((a, b) => a.slot - b.slot);
  return {
    id: 'FREE', version: 1, number: 0, set: '自由作成', title: '自由作成', free: true,
    hint: 'グラスの置き場所（＋）をタップして置き、グラスや給水塔をタップして配管をつなぎます。',
    spring: { id: 'S', x: SPRING_X, height: circuit.spring.height },
    towers: towers.map(t => ({ id: t.id, x: FREE_SLOTS[t.slot] })),
    freeSlots: FREE_SLOTS.map((x, slot) => ({ slot, x, id: TOWER_IDS[slot] })).filter(s => !circuit.towers.some(t => t.slot === s.slot)),
    outlets: towers.filter(t => t.outlet).map(t => ({ id: `O${t.id}`, tower: t.id, height: t.outlet.height, conductance: '1', target: '0', label: `グラス${t.id}の噴水盤` })),
    candidates: circuit.pipes.map(p => ({
      id: p.id, a: p.a, b: p.b, thinness: p.thinness,
      ...(p.crest && (siphons === null || siphons.has(p.id)) ? { siphon: { crest: p.crest, inlet: SIPHON_INLET } } : {}),
      ...(p.crest ? { lifted: true } : { depth: depth.get(p.id) }),
      ...(p.gate ? { gate: true } : {})
    })),
    buckets: circuit.pipes.length, // 使い放題（呼び水できる管の数まで）
    boardTop: maxCrest(circuit) // つまみで山を動かしても盤面の倍率を変えない
  };
}

export const freeConfig = circuit => ({
  connected: circuit.pipes.map(p => p.id),
  thickness: {},
  primed: circuit.primed.filter(id => circuit.pipes.some(p => p.id === id && p.crest)),
  pumped: [],
  drains: {}
});

// 流す：サイフォンを水位から決めて、課題と同じ judge で計算する。
// 戻り値：judge の結果に { stage（計算に使った形）, siphons（サイフォンと決まった管）, flowingLifted（持ち上げても水面より低く、ふつうに流れた管） }
export function evaluateFree(circuit) {
  const lifted = circuit.pipes.filter(p => p.crest);
  const siphons = new Set();
  const config = freeConfig(circuit);
  for (let round = 0; round <= lifted.length; round++) {
    const st = freeStage(circuit, siphons);
    const j = judge(st, config);
    // 開いた状態（最初の状態）の水位で決める。給水塔は高さ、水が来ないグラスは0
    const towers = j.states[0].result.towers;
    const levelOf = id => (id === 'S' ? frac(circuit.spring.height) : towers[id]?.state === 'water' ? towers[id].level : frac('0'));
    const newly = lifted.filter(p => !siphons.has(p.id) && frac(p.crest).cmp(maxFrac(levelOf(p.a), levelOf(p.b))) > 0);
    if (!newly.length) return { ...j, stage: st, siphons, flowingLifted: new Set(lifted.filter(p => !siphons.has(p.id)).map(p => p.id)), outcome: 'free' };
    for (const p of newly) siphons.add(p.id);
  }
  throw new Error('サイフォンの判定が終わりませんでした。');
}
const maxFrac = (a, b) => (a.cmp(b) >= 0 ? a : b);

// ---- 編集（新しい回路を返す。元の回路は変えない） ----
const clone = c => structuredClone(c);

export function addTower(circuit, slot) {
  if (!FREE_SLOTS[slot] || circuit.towers.some(t => t.slot === slot)) throw new Error('そこにはグラスを置けません。');
  const next = clone(circuit);
  next.towers.push({ id: TOWER_IDS[slot], slot, outlet: null });
  return next;
}

// グラスを外すと、そのグラスにつながる管も外す（前作と同じく、確認してから。SD-034）
export function pipesOf(circuit, id) {
  return circuit.pipes.filter(p => p.a === id || p.b === id);
}
export function removeTower(circuit, id) {
  const next = clone(circuit);
  const gone = new Set(pipesOf(circuit, id).map(p => p.id));
  next.towers = next.towers.filter(t => t.id !== id);
  next.pipes = next.pipes.filter(p => !gone.has(p.id));
  next.primed = next.primed.filter(x => !gone.has(x));
  return next;
}

export function setOutlet(circuit, id, height) {
  const next = clone(circuit);
  next.towers.find(t => t.id === id).outlet = height === null ? null : { height: String(height) };
  return next;
}

export function setSpringHeight(circuit, height) {
  const next = clone(circuit);
  next.spring.height = String(height);
  // 給水塔を低くすると、噴水盤の口や管の山が上に余ることがある。口はグラスの中（給水塔の高さ未満）に収める
  for (const t of next.towers) if (t.outlet && Number(t.outlet.height) >= Number(height)) t.outlet.height = String(Number(height) - 1);
  for (const p of next.pipes) if (p.crest && Number(p.crest) > maxCrest(next)) p.crest = String(maxCrest(next));
  return next;
}

// 山の高さ：入口（高さ1）より上から、給水塔の高さ＋2まで
export const minCrest = () => Number(SIPHON_INLET) + 1;
export const maxCrest = circuit => Number(circuit.spring.height) + 2;

// 新しい管の名前：両端の名前（左から）。同じ両端の2本目からは番号を付ける（課題の SA・SA2 と同じ）
function pipeId(circuit, a, b) {
  const [l, r] = xOf(circuit, a) <= xOf(circuit, b) ? [a, b] : [b, a];
  const base = `${l}${r}`;
  let id = base;
  for (let n = 2; circuit.pipes.some(p => p.id === id); n++) id = `${base}${n}`;
  return { id, a: l, b: r };
}

export function addPipe(circuit, a, b) {
  if (a === b) throw new Error('同じ部品どうしはつなげません。');
  const ids = new Set(['S', ...circuit.towers.map(t => t.id)]);
  if (!ids.has(a) || !ids.has(b)) throw new Error('つなぐ部品が見つかりません。');
  const next = clone(circuit);
  next.pipes.push({ ...pipeId(circuit, a, b), thinness: '1', crest: null, gate: false });
  if (Math.max(0, ...assignDepths(next).values()) > MAX_DEPTH) throw new Error('地面の下がいっぱいです。ほかの管を外すか、持ち上げてください。');
  return next;
}

export function updatePipe(circuit, id, change) {
  const next = clone(circuit);
  const p = next.pipes.find(x => x.id === id);
  Object.assign(p, change);
  if (!p.crest) next.primed = next.primed.filter(x => x !== id); // 下ろした管は呼び水がいらない
  if (Math.max(0, ...assignDepths(next).values()) > MAX_DEPTH) throw new Error('地面の下がいっぱいです。ほかの管を外すか、持ち上げてください。');
  return next;
}

export function removePipeFrom(circuit, id) {
  const next = clone(circuit);
  next.pipes = next.pipes.filter(p => p.id !== id);
  next.primed = next.primed.filter(x => x !== id);
  return next;
}

export function setPrimed(circuit, id, on) {
  const next = clone(circuit);
  next.primed = next.primed.filter(x => x !== id);
  if (on) next.primed.push(id);
  return next;
}

// 回路の検査（保存・回路ファイルの読み込みで使う。D-07・D-10）。不正なら理由を投げる
export function validateCircuit(c) {
  const bad = why => { throw new Error(`回路が正しくありません（${why}）。`); };
  if (!c || typeof c !== 'object') bad('形式');
  if (!SPRING_HEIGHTS.includes(c.spring?.height)) bad('給水塔の高さ');
  if (!Array.isArray(c.towers) || c.towers.length > FREE_SLOTS.length) bad('グラス');
  const slots = new Set();
  for (const t of c.towers) {
    if (!Number.isInteger(t?.slot) || !FREE_SLOTS[t.slot] || slots.has(t.slot) || t.id !== TOWER_IDS[t.slot]) bad('グラスの置き場所');
    slots.add(t.slot);
    if (t.outlet !== null && !(t.outlet && /^\d+$/.test(t.outlet.height) && Number(t.outlet.height) < Number(c.spring.height))) bad('噴水盤の高さ');
  }
  const nodes = new Set(['S', ...c.towers.map(t => t.id)]);
  if (!Array.isArray(c.pipes) || c.pipes.length > 30) bad('配管');
  const ids = new Set();
  for (const p of c.pipes) {
    if (typeof p?.id !== 'string' || !/^[A-Z]{2}\d*$/.test(p.id) || ids.has(p.id)) bad('配管の名前');
    ids.add(p.id);
    if (!nodes.has(p.a) || !nodes.has(p.b) || p.a === p.b) bad('配管のつなぎ先');
    if (!['1', '2', '3'].includes(p.thinness)) bad('配管の太さ');
    if (p.crest !== null && !(typeof p.crest === 'string' && /^\d+$/.test(p.crest) && Number(p.crest) >= minCrest() && Number(p.crest) <= maxCrest(c))) bad('持ち上げた高さ');
    if (typeof p.gate !== 'boolean') bad('水門');
  }
  if (!Array.isArray(c.primed) || c.primed.some(id => !c.pipes.some(p => p.id === id && p.crest))) bad('呼び水');
  if (Math.max(0, ...assignDepths(c).values()) > MAX_DEPTH) bad('地面の下の管が多すぎます');
  return c;
}
