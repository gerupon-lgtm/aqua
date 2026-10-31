// 面のつなぎ方から計算・判定・採点を行う（logic-design 4〜5章）
//
// つなぎ方（config）：
//   connected：つないだ水路のID
//   thickness：太さを変えられる水路の細さ（{ID: '1'|'2'|'3'}）。ないときは面の既定
//   primed：桶で呼び水をしたサイフォンのID
// 面の水路の候補（candidates）：
//   thinness：細さ。adjustable があれば選べる細さの一覧（太さを変えられる水路、F-008）
//   siphon：{ crest, inlet } があればサイフォン（F-005）。crest は通り道の一番高い所で、
//           課題では泉より高く置くため、呼び水がない限り流れない。inlet はグラスの中の入口の高さ
//   gate：true なら水門（F-010）。開いた状態と閉じた状態の両方を計算する
import { Fraction, frac } from './fraction.js';
import { solveCircuit } from './flow.js';
import { onScale, DEFAULT_SCALE } from './pitch.js';
import { pipeScore, outletVerdict } from './score.js';

export function normalizeConfig(config) {
  if (Array.isArray(config) || config instanceof Set) return { connected: new Set(config), thickness: {}, primed: new Set() };
  return { connected: new Set(config.connected), thickness: { ...(config.thickness ?? {}) }, primed: new Set(config.primed ?? []) };
}

export function thinnessOf(candidate, config) {
  return config.thickness[candidate.id] ?? candidate.thinness;
}

export function configKey(config) {
  const c = normalizeConfig(config);
  return [...c.connected].sort().map(id => `${id}${c.thickness[id] ? `:${c.thickness[id]}` : ''}${c.primed.has(id) ? '+' : ''}`).join(',');
}

const isSiphon = c => !!c.siphon;

export function buildCircuit(stage, config, { gateClosed = false, broken = new Set() } = {}) {
  const cfg = normalizeConfig(config);
  return {
    spring: { id: stage.spring.id, height: frac(stage.spring.height) },
    towers: stage.towers.map(t => ({ id: t.id })),
    outlets: stage.outlets.map(o => ({ id: o.id, tower: o.tower, height: frac(o.height), conductance: frac(o.conductance) })),
    pipes: stage.candidates
      .filter(c => cfg.connected.has(c.id))
      .filter(c => !(gateClosed && c.gate))
      .filter(c => !isSiphon(c) || (cfg.primed.has(c.id) && !broken.has(c.id)))
      .map(c => ({ id: c.id, a: c.a, b: c.b, conductance: new Fraction(1n).div(frac(thinnessOf(c, cfg))) }))
  };
}

// 1つの状態（水門が開いている／閉じている）を計算する。サイフォンは切れる管がなくなるまで繰り返す（4.4）
export function solveState(stage, config, { gateClosed = false } = {}) {
  const cfg = normalizeConfig(config);
  const broken = new Set();
  const order = [];
  const siphons = stage.candidates.filter(c => isSiphon(c) && cfg.connected.has(c.id) && cfg.primed.has(c.id) && !(gateClosed && c.gate));
  let result;
  for (let round = 0; round <= siphons.length; round++) {
    result = solveCircuit(buildCircuit(stage, cfg, { gateClosed, broken }));
    const levelOf = id => (id === stage.spring.id ? frac(stage.spring.height) : result.towers[id]?.level ?? null);
    const newly = siphons.filter(c => {
      if (broken.has(c.id)) return false;
      const la = levelOf(c.a);
      const lb = levelOf(c.b);
      if (la === null || lb === null) return false;
      // 上流側：流れが来る側。流れがないときは水位の高い側
      const upstream = la.cmp(lb) >= 0 ? c.a : c.b;
      if (upstream === stage.spring.id) return false;
      return levelOf(upstream).lt(frac(c.siphon.inlet));
    });
    if (!newly.length) break;
    newly.forEach(c => { broken.add(c.id); order.push(c.id); });
  }
  return { result, broken, brokenOrder: order };
}

function targetFor(outlet, state) {
  const t = outlet.target;
  return frac(typeof t === 'object' ? t[state] : t);
}

// 採点をしない判定（出題の検査にも使う）。水門の面は、開いた状態と閉じた状態の両方を判定する
export function judge(stage, config, scale = DEFAULT_SCALE) {
  const cfg = normalizeConfig(config);
  const gated = stage.candidates.some(c => c.gate) && [...cfg.connected].some(id => stage.candidates.find(c => c.id === id)?.gate);
  const names = stage.candidates.some(c => c.gate) ? ['open', 'closed'] : ['only'];
  const states = names.map(name => {
    const s = solveState(stage, cfg, { gateClosed: name === 'closed' && gated });
    const outlets = stage.outlets.map(o => {
      const target = targetFor(o, name === 'only' ? 'open' : name);
      const flow = s.result.outlets[o.id].flow;
      return { id: o.id, flow, target, verdict: outletVerdict(flow, target) };
    });
    const watered = Object.values(s.result.towers).filter(t => t.state === 'water');
    return { name, ...s, outlets, clear: outlets.every(o => o.verdict === 'exact'), allOnScale: watered.every(t => onScale(t.level, scale)) };
  });
  const primed = [...cfg.primed].filter(id => cfg.connected.has(id));
  return {
    config: cfg,
    states,
    result: states[0].result,
    outlets: states[0].outlets,
    clear: states.every(s => s.clear),
    allOnScale: states.every(s => s.allOnScale),
    used: cfg.connected.size,
    buckets: primed.length
  };
}

// 面で選べるつなぎ方をすべて作る（水路ごとに：つながない／太さの選択／サイフォンなら呼び水の有無）
export function allConfigs(stage) {
  let configs = [{ connected: [], thickness: {}, primed: [] }];
  for (const c of stage.candidates) {
    const next = [];
    for (const base of configs) {
      next.push(base);
      for (const t of c.adjustable ?? [null]) {
        const thickness = t ? { ...base.thickness, [c.id]: t } : base.thickness;
        next.push({ connected: [...base.connected, c.id], thickness, primed: base.primed });
        if (c.siphon) next.push({ connected: [...base.connected, c.id], thickness, primed: [...base.primed, c.id] });
      }
    }
    configs = next;
  }
  return configs.filter(c => c.connected.length && c.primed.length <= (stage.buckets ?? 0));
}

// 満点の観点：基本は本数。桶の面（25〜30面）は桶の数を先に比べ、同じなら本数（要件5.7）
function rank(stage, j) {
  return stage.theme === 'buckets' ? [j.buckets, j.used] : [j.used];
}
const lexLess = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };

// すべてのつなぎ方を調べ、満点のつなぎ方を決める（試作では端末で計算する。本番は事前生成、C-04）
export function analyzeStage(stage, scale = DEFAULT_SCALE) {
  const clears = [];
  for (const config of allConfigs(stage)) {
    const j = judge(stage, config, scale);
    if (j.clear) clears.push({ config, key: configKey(config), ids: [...config.connected].sort(), used: j.used, buckets: j.buckets, rank: rank(stage, j), allOnScale: j.allOnScale, anyBroken: j.states.some(s => s.broken.size) });
  }
  if (!clears.length) return { clears, perfect: null, perfectKey: null, perfectCount: null, unique: false };
  let best = [clears[0]];
  for (const c of clears.slice(1)) {
    if (lexLess(c.rank, best[0].rank)) best = [c];
    else if (!lexLess(best[0].rank, c.rank)) best.push(c);
  }
  return { clears, perfect: best[0].ids, perfectKey: best[0].key, perfectConfig: best[0].config, perfectCount: best[0].used, unique: best.length === 1 };
}

export function evaluate(stage, config, analysis, scale = DEFAULT_SCALE) {
  const j = judge(stage, config, scale);
  const isPerfect = j.clear && analysis.perfectKey !== null && configKey(config) === analysis.perfectKey;
  const score = j.clear ? pipeScore({ used: j.used, perfectCount: analysis.perfectCount, isPerfect }) : new Fraction(0n);
  const outcome = !j.clear ? 'ng' : isPerfect ? 'perfect' : 'clear';
  return { ...j, isPerfect, score, outcome };
}
