// 出題の生成（logic-design 7.1）。面の定義の vary（変えてよい数値の範囲）から、数値のすべての組み合わせを調べ、
// 検査（challenge-check.js）をすべて通ったものだけを候補にする。乱数の種を固定して8つを選ぶので、何度実行しても同じ結果になる。
// 指定量は「あるつなぎ方で計算した流れる量」から決め、そのつなぎ方が満点の1通りになるものだけを残す。
import { frac } from './fraction.js';
import { allConfigs, judge, configKey } from './play.js';
import { checkChallenge } from './challenge-check.js';
import { applyValues } from '../content/challenge-draw.js';

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

// 数値の組み合わせ：泉の高さ × 各水路の細さ（太さを選べる水路は選ぶ側なので変えない）
function valueGrid(stage) {
  const v = stage.vary;
  let grid = (v.spring ?? [stage.spring.height]).map(spring => ({ spring, thinness: {} }));
  for (const c of stage.candidates) {
    if (c.adjustable) continue;
    const options = v.thinness?.[c.id] ?? v.thinnessAll ?? [c.thinness];
    grid = grid.flatMap(g => options.map(t => ({ ...g, thinness: { ...g.thinness, [c.id]: t } })));
  }
  return grid;
}

const rankOf = (stage, row) => (stage.theme === 'buckets' ? [row.buckets, row.used] : [row.used]);
const lexLess = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };

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
        config, key: configKey(config), used: j.used, buckets: j.buckets, allOnScale: j.allOnScale,
        broken: j.states.some(s => s.broken.size),
        flows: j.outlets.map(o => o.flow)
      };
    });
    if (rows.some(r => r.broken)) continue; // サイフォンが切れる数値は使わない
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
      found.push({ values: { ...g, targets: Object.fromEntries(stage.outlets.map((o, i) => [o.id, r.flows[i].toString()])) }, family: perfect.key });
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
  const families = shuffle([...byFamily.keys()].sort().filter(k => byFamily.get(k).length >= each), random).slice(0, FAMILIES);
  if (families.length < FAMILIES) throw new Error(`${stage.number}面：${each}つ以上の出題がある系統が${FAMILIES}つ見つかりません（候補 ${pool.length}件、系統 ${byFamily.size}）。数値の範囲を見直してください。`);
  const picked = [];
  families.forEach((key, fi) => {
    for (const c of shuffle(byFamily.get(key), random)) {
      if (picked.filter(p => p.familyIndex === fi).length >= each) break;
      const s = applyValues(stage, c.values);
      const check = checkChallenge(s);
      if (!check.ok) continue; // 速い下調べと食い違うものは採らない（アプリと同じ検査を正とする）
      picked.push({ ...c, familyIndex: fi, check });
    }
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
