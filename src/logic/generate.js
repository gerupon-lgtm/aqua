// 出題の生成（logic-design 7.1）。面の定義の vary（変えてよい数値の範囲）から、数値のすべての組み合わせを調べ、
// 検査（challenge-check.js）をすべて通ったものだけを候補にする。乱数の種を固定して8つを選ぶので、何度実行しても同じ結果になる。
// 指定量は「あるつなぎ方で計算した流れる量」から決め、そのつなぎ方が満点の1通りになるものだけを残す。
import { frac } from './fraction.js';
import { allConfigs, judge, configKey, rank, lexLess } from './play.js';
import { checkChallenge } from './challenge-check.js';
import { applyValues } from '../content/challenge-draw.js';
import { triadOf } from './pitch.js';

export const GENERATOR_VERSION = 1;
export const PER_STAGE = 8;
export const FAMILIES = 2; // 前作と同じく、満点のつなぎ方が違う2系統×4

// 種つきの乱数（mulberry32）。同じ種なら同じ並びになる
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 数値の組み合わせ：泉の高さ × 各配管の細さ（太さを選べる配管は選ぶ側なので変えない）
function valueGrid(stage) {
  const v = stage.vary;
  let grid = (v.spring ?? [stage.spring.height]).map(spring => ({ spring, thinness: {} }));
  // 泉が2つの面は、二つ目の泉の高さも変える
  if (stage.spring2) grid = grid.flatMap(g => (v.spring2 ?? [stage.spring2.height]).map(spring2 => ({ ...g, spring2 })));
  for (const c of stage.candidates) {
    if (c.adjustable) continue;
    const options = v.thinness?.[c.id] ?? v.thinnessAll ?? [c.thinness];
    grid = grid.flatMap(g => options.map(t => ({ ...g, thinness: { ...g.thinness, [c.id]: t } })));
  }
  return grid;
}

const rankOf = rank;

// 満点のつなぎ方が、指定した給水塔のすべてに配管でつながっているか
function springsTouched(stage, config, ids) {
  const used = stage.candidates.filter(c => config.connected.includes(c.id));
  return ids.every(id => used.some(c => c.a === id || c.b === id));
}
// 満点のつなぎ方で、その給水塔へ水が流れ込む（逆向きの流れ）配管があるか
function flowsInto(stage, config, id) {
  const pipes = judge(stage, config).result.pipes;
  return stage.candidates.some(c => pipes[c.id]?.wet && ((c.b === id && pipes[c.id].flow.sign() > 0) || (c.a === id && pipes[c.id].flow.sign() < 0)));
}

// 1つの面の候補をすべて集める。速くするため、つなぎ方ごとの流れる量を一度だけ計算して、指定量の候補ごとに比べる。
// 最後に、選んだものは checkChallenge（アプリと同じ検査）で必ず確かめる
export function candidatesFor(stage) {
  const v = stage.vary;
  const maxTarget = v.maxTarget ?? 8;
  const found = [];
  for (const g of valueGrid(stage)) {
    const base = applyValues(stage, { ...g, targets: Object.fromEntries(stage.outlets.map(o => [o.id, '0'])), buckets: stage.buckets });
    const rows = allConfigs(base).map(config => {
      const j = judge(base, config);
      return {
        config, key: configKey(config), used: j.used, buckets: j.buckets, drained: j.drained, allOnScale: j.allOnScale,
        broken: j.states.some(s => s.broken.size),
        // 水門の面は、開いた状態と閉じた状態の両方の流れる量（噴水盤の数×2）。水門のない面は1状態だけ
        flows: j.states.flatMap(s => s.outlets.map(o => o.flow)),
        // 水のあるグラスの水位（最後の状態）。chord の面で和音かどうかを見る
        levels: Object.values(j.states.at(-1).result.towers).filter(t => t.state === 'water').map(t => t.level),
        gateMatters: j.states.length > 1 && j.states[0].outlets.some((o, i) => !o.flow.eq(j.states[1].outlets[i].flow))
      };
    });
    if (!stage.mayBreak && rows.some(r => r.broken)) continue; // サイフォンが切れる数値は使わない（切れる面を除く）
    const seen = new Set();
    for (const r of rows) {
      if (!r.flows.every(f => f.isInteger() && f.sign() > 0 && f.cmp(frac(String(maxTarget))) <= 0)) continue;
      const tkey = r.flows.map(String).join(',');
      if (seen.has(tkey)) continue;
      seen.add(tkey);
      const clears = rows.filter(x => x.flows.every((f, i) => f.eq(r.flows[i])));
      let best = [clears[0]];
      for (const c of clears.slice(1)) {
        if (lexLess(rankOf(stage, c), rankOf(stage, best[0]))) best = [c];
        else if (!lexLess(rankOf(stage, best[0]), rankOf(stage, c))) best.push(c);
      }
      if (best.length !== 1) continue;
      const perfect = best[0];
      if (clears.length < 2 || !clears.every(c => c.allOnScale)) continue;
      if (perfect.used < (v.minPerfect ?? 2)) continue;
      if ((v.mustUse ?? []).some(id => !perfect.config.connected.includes(id))) continue;
      if (perfect.buckets < (v.minBuckets ?? 0)) continue;
      if (perfect.broken) continue;
      if (perfect.config.pumped.length < (v.minPumps ?? 0)) continue;
      if (Object.keys(perfect.config.drains).length < (v.minDrains ?? 0)) continue;
      // 給水塔が2つの面（43〜48面）：bothSprings なら満点が両方の給水塔を使い、intoSpring2 なら満点で右の給水塔へ水が流れ込む
      if (v.bothSprings && !springsTouched(base, perfect.config, [stage.spring.id, stage.spring2.id])) continue;
      if (v.intoSpring2 && !flowsInto(base, perfect.config, stage.spring2.id)) continue;
      // 水門の面（49〜54面）：mustGate なら、満点のつなぎ方で水門を閉じると届く量が変わる（水門が答えに効く）
      if (v.mustGate && !perfect.gateMatters) continue;
      // 和音の面（10・23面、要件 v0.12・v0.13）：満点のつなぎ方で3つのグラスが3和音（長・短）を鳴らすかを記録する。
      // chord が true なら和音の出題だけを残す。数なら、各系統のその数だけを和音の出題にする（generateStage）
      const chord = v.chord ? Boolean(triadOf(perfect.levels)) : false;
      if (v.chord === true && !chord) continue;
      const n = stage.outlets.length;
      const targetOf = i => (r.flows.length > n ? { open: r.flows[i].toString(), closed: r.flows[n + i].toString() } : r.flows[i].toString());
      found.push({ values: { ...g, targets: Object.fromEntries(stage.outlets.map((o, i) => [o.id, targetOf(i)])) }, family: perfect.key, chord });
    }
  }
  return found;
}

// 1つの面の8つを選ぶ。満点のつなぎ方（系統）を2つ選び、それぞれから4つ
export function generateStage(stage, seed = stage.vary.seed) {
  const random = seededRandom(seed);
  const pool = candidatesFor(stage);
  const byFamily = new Map();
  for (const c of pool) {
    if (!byFamily.has(c.family)) byFamily.set(c.family, []);
    byFamily.get(c.family).push(c);
  }
  const each = PER_STAGE / FAMILIES;
  const v = stage.vary;
  // chord が数（10・23面、要件 v0.13）：各系統のその数だけを、満点で和音が鳴る出題にする。残りは和音でない出題
  const chordEach = typeof v.chord === 'number' ? v.chord : 0;
  // distinctTargets：同じ系統の中で、給水塔の高さと届ける量の組が同じ出題を選ばない（答えに使わない管の太さだけが違う出題を重ねない）
  // 要件 v0.14（2026-11-05）からすべての面で既定にした。false を書いた面だけ重なりを許す
  const distinct = v.distinctTargets ?? true;
  const contentKey = c => JSON.stringify([c.values.spring, c.values.spring2 ?? null, c.values.targets]);
  const distinctCount = list => (distinct ? new Set(list.map(contentKey)).size : list.length);
  const plainOk = list => distinctCount(list) >= each;
  const chordOk = list => list.filter(c => c.chord).length >= chordEach && distinctCount(list.filter(c => !c.chord)) >= each - chordEach;
  // chordFamilies：和音の出題を置く系統の数（既定は2系統とも）。23面は C メジャーの系統で普段の出題が足りないため1
  const chordFamilies = chordEach ? (v.chordFamilies ?? FAMILIES) : 0;
  // 中身の違う出題が4つそろう系統を先に（乱数で並べる）。そろわない系統は、中身の違う数が多い順に後ろへ（予備）
  const order = [
    ...shuffle([...byFamily.keys()].sort().filter(k => plainOk(byFamily.get(k))), random),
    ...[...byFamily.keys()].sort().filter(k => !plainOk(byFamily.get(k)) && byFamily.get(k).length >= each)
      .sort((a, b) => distinctCount(byFamily.get(b)) - distinctCount(byFamily.get(a)))
  ];
  // distinctShapes（23面）：同じ両端の管の違い（SA と SA2）だけの系統は選ばず、つなぎ方の形が違う2系統にする
  const shape = key => key.split(',').map(id => id.replace(/\d+(?=$|[:*+])/, '')).sort().join(',');
  const families = [];
  const fits = k => !families.some(f => f.key === k || (v.distinctShapes && shape(f.key) === shape(k)));
  for (const k of order) if (families.length < chordFamilies && fits(k) && chordOk(byFamily.get(k))) families.push({ key: k, chord: true });
  for (const k of order) if (families.length < FAMILIES && fits(k)) families.push({ key: k, chord: false });
  if (families.length < FAMILIES || families.filter(f => f.chord).length < chordFamilies) throw new Error(`${stage.number}面：${each}つ以上の出題がある系統が${FAMILIES}つ見つかりません（候補 ${pool.length}件、系統 ${byFamily.size}）。数値の範囲を見直してください。`);
  const picked = [];
  families.forEach(({ key, chord: chordFamily }, fi) => {
    let list = shuffle(byFamily.get(key), random);
    // 和音の系統は、和音の出題を先に決めた数だけ選び、そのあと和音でない出題を選ぶ。ほかの系統は和音でない出題だけ
    const want = chordFamily ? chordEach : 0;
    if (want) list = [...list.filter(c => c.chord), ...list.filter(c => !c.chord)];
    const mine = [];
    // 1回目は中身の違う出題だけ。それでも4つそろわない系統だけ、2回目で中身の同じ出題を足す（予備）
    for (const allowSame of distinct ? [false, true] : [true]) {
      for (const c of list) {
        if (mine.length >= each) break;
        if (mine.some(p => p.values === c.values)) continue;
        const chords = mine.filter(p => p.chord).length;
        if (chordEach && (c.chord ? chords >= want : chords < want)) continue;
        if (!allowSame && mine.some(p => contentKey(p) === contentKey(c))) continue;
        const s = applyValues(stage, c.values);
        const check = checkChallenge(s);
        if (!check.ok) continue; // 速い下調べと食い違うものは採らない（アプリと同じ検査を正とする）
        mine.push({ ...c, familyIndex: fi, check });
      }
    }
    picked.push(...mine);
  });
  if (picked.length < PER_STAGE) throw new Error(`${stage.number}面：検査を通る出題が${PER_STAGE}つそろいません。`);
  return shuffle(picked, random).map((p, i) => {
    const s = applyValues(stage, p.values);
    const best = judge(s, p.check.analysis.perfectConfig);
    return {
      id: `${stage.id}-${i + 1}`,
      number: i + 1,
      baseVersion: stage.version,
      family: String.fromCharCode(65 + p.familyIndex),
      values: p.values,
      expected: {
        perfectKey: p.check.analysis.perfectKey,
        perfectCount: p.check.analysis.perfectCount,
        partialKeys: p.check.analysis.clears.map(c => c.key).filter(k => k !== p.check.analysis.perfectKey).sort(),
        levels: Object.fromEntries(Object.entries(best.result.towers).map(([id, t]) => [id, t.level ? t.level.toString() : null]))
      },
      seed,
      generator: GENERATOR_VERSION
    };
  });
}

// 生成の対象：vary を持つ面
export function generateAll(stages) {
  return Object.fromEntries(stages.filter(s => s.vary).map(s => [s.id, generateStage(s)]));
}
