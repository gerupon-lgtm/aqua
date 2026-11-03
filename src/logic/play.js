// 面のつなぎ方から計算・判定・採点を行う（logic-design 4〜5章）
//
// つなぎ方（config）：
//   connected：つないだ配管のID
//   thickness：太さを変えられる配管の細さ（{ID: '1'|'2'|'3'}）。ないときは面の既定
//   primed：呼び水をしたサイフォンのID（桶でも手押しポンプでも）
//   pumped：そのうち手押しポンプで呼び水をしたID。桶の数に入れない（F-007）
//   drains：排水口の段（{ID: 'closed'|'half'|'open'}）。ないときは閉（F-009、37〜42面）
// 面の排水口（stage.drains）：[{ id, tower }]。グラスから地面（高さ0）へ水を捨てる出口。判定には使わない
// 面の配管の候補（candidates）：
//   thinness：細さ。adjustable があれば選べる細さの一覧（太さを変えられる配管、F-008）
//   siphon：{ crest, inlet } があればサイフォン（F-005）。crest は通り道の一番高い所で、
//           課題では泉より高く置くため、呼び水がない限り流れない。inlet はグラスの中の入口の高さ
//   gate：true なら水門（F-010）。開いた状態と閉じた状態の両方を計算する
//   pump：手押しポンプがあればグラスのID（ポンプが水を汲むグラス＝サイフォンの入口側。F-007、31〜36面）
import { Fraction, frac } from './fraction.js';
import { solveCircuit } from './flow.js';
import { onScale, DEFAULT_SCALE } from './pitch.js';
import { pipeScore, outletVerdict } from './score.js';

export function normalizeConfig(config) {
  if (Array.isArray(config) || config instanceof Set) return { connected: new Set(config), thickness: {}, primed: new Set(), pumped: new Set(), drains: {} };
  const primed = new Set(config.primed ?? []);
  const drains = Object.fromEntries(Object.entries(config.drains ?? {}).filter(([, step]) => step && step !== 'closed'));
  return { connected: new Set(config.connected), thickness: { ...(config.thickness ?? {}) }, primed, pumped: new Set([...(config.pumped ?? [])].filter(id => primed.has(id))), drains };
}

export function thinnessOf(candidate, config) {
  return config.thickness[candidate.id] ?? candidate.thinness;
}

// 排水口の段（要件 Q-06：3段で始める）。流れやすさは、全開が太い管（1）、半分が中の管（1/2）と同じ
export const DRAIN_STEPS = Object.freeze({ closed: null, half: '1/2', open: '1' });
export const DRAIN_STEP_NAMES = Object.freeze({ closed: '閉', half: '半分', open: '全開' });

export function configKey(config) {
  const c = normalizeConfig(config);
  const pipes = [...c.connected].sort().map(id => `${id}${c.thickness[id] ? `:${c.thickness[id]}` : ''}${c.pumped.has(id) ? '*' : c.primed.has(id) ? '+' : ''}`);
  // 排水口は開いているものだけ「ID:段」で後ろに足す（排水口のない面の名前は変わらない）
  const drains = Object.keys(c.drains).sort().map(id => `${id}:${c.drains[id]}`);
  return [...pipes, ...drains].join(',');
}

const isSiphon = c => !!c.siphon;

export function buildCircuit(stage, config, { gateClosed = false, broken = new Set() } = {}) {
  const cfg = normalizeConfig(config);
  return {
    spring: { id: stage.spring.id, height: frac(stage.spring.height) },
    towers: stage.towers.map(t => ({ id: t.id })),
    outlets: [
      ...stage.outlets.map(o => ({ id: o.id, tower: o.tower, height: frac(o.height), conductance: frac(o.conductance) })),
      // 開いている排水口は、高さ0の出口として計算する（logic-design 3章）
      ...(stage.drains ?? []).filter(d => DRAIN_STEPS[cfg.drains[d.id]]).map(d => ({ id: d.id, tower: d.tower, height: frac('0'), conductance: frac(DRAIN_STEPS[cfg.drains[d.id]]) }))
    ],
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
    // 排水口から捨てた水（毎秒）。37〜42面の観点に使う
    const drained = (stage.drains ?? []).reduce((sum, d) => sum.add(s.result.outlets[d.id]?.flow ?? new Fraction(0n)), new Fraction(0n));
    return { name, ...s, outlets, drained, clear: outlets.every(o => o.verdict === 'exact'), allOnScale: watered.every(t => onScale(t.level, scale)) };
  });
  const primed = [...cfg.primed].filter(id => cfg.connected.has(id) && !cfg.pumped.has(id));
  return {
    config: cfg,
    states,
    result: states[0].result,
    outlets: states[0].outlets,
    clear: states.every(s => s.clear),
    allOnScale: states.every(s => s.allOnScale),
    used: cfg.connected.size,
    buckets: primed.length,
    drained: states.reduce((sum, s) => sum.add(s.drained), new Fraction(0n))
  };
}

// 手押しポンプで汲めるか（要件5.2）：そのサイフォンを除いた今のつなぎ方で落ち着いたとき、
// ポンプのグラスの水位がサイフォンの入口以上なら汲める。編集中はグラスが空なので、計算で決める（2026-11-04 発案者が選択）。
// 水門の面は、開いているとき（最初の状態）で判断する。汲めても、流したあとに入口より下がればサイフォンは切れる
export function pumpCheck(stage, config, id) {
  const c = stage.candidates.find(x => x.id === id);
  if (!c?.siphon || !c.pump) return { ok: false, level: null, inlet: null };
  const cfg = normalizeConfig(config);
  cfg.primed.delete(id);
  cfg.pumped.delete(id);
  const inlet = frac(c.siphon.inlet);
  const tower = solveState(stage, cfg).result.towers[c.pump];
  const level = tower?.state === 'water' ? tower.level : null;
  return { ok: level !== null && level.cmp(inlet) >= 0, level, inlet, tower: c.pump };
}

// 面で選べるつなぎ方をすべて作る（配管ごとに：つながない／太さの選択／サイフォンなら呼び水の有無・桶かポンプか）。
// 桶は面の数まで。ポンプの呼び水は、汲める条件を満たすものだけ
export function allConfigs(stage) {
  let configs = [{ connected: [], thickness: {}, primed: [], pumped: [], drains: {} }];
  for (const c of stage.candidates) {
    const next = [];
    for (const base of configs) {
      next.push(base);
      for (const t of c.adjustable ?? [null]) {
        const thickness = t ? { ...base.thickness, [c.id]: t } : base.thickness;
        next.push({ ...base, connected: [...base.connected, c.id], thickness });
        if (c.siphon) next.push({ ...base, connected: [...base.connected, c.id], thickness, primed: [...base.primed, c.id] });
        if (c.siphon && c.pump) next.push({ ...base, connected: [...base.connected, c.id], thickness, primed: [...base.primed, c.id], pumped: [...base.pumped, c.id] });
      }
    }
    configs = next;
  }
  // 排水口：それぞれ閉・半分・全開
  for (const d of stage.drains ?? []) {
    configs = configs.flatMap(base => Object.keys(DRAIN_STEPS).map(step => (step === 'closed' ? base : { ...base, drains: { ...base.drains, [d.id]: step } })));
  }
  return configs.filter(c => c.connected.length && c.primed.length - c.pumped.length <= (stage.buckets ?? 0)
    && c.pumped.every(id => pumpCheck(stage, c, id).ok));
}

// 満点の観点：基本は本数。桶の面（25〜36面）は桶の数を先に比べ、同じなら本数。
// 排水口の面（37〜42面）は捨てる水（毎秒、分数）の少なさを先に比べ、同じなら本数（要件5.7）
export function rank(stage, j) {
  if (stage.theme === 'buckets') return [j.buckets, j.used];
  if (stage.theme === 'drain') return [j.drained, j.used];
  return [j.used];
}
// 観点の比較。分数は大小比較で、数はそのまま比べる
const cmpPart = (a, b) => (typeof a === 'number' ? a - b : a.cmp(b));
export const lexLess = (a, b) => { for (let i = 0; i < a.length; i++) { const c = cmpPart(a[i], b[i]); if (c !== 0) return c < 0; } return false; };

// すべてのつなぎ方を調べ、満点のつなぎ方を決める（試作では端末で計算する。本番は事前生成、C-04）
export function analyzeStage(stage, scale = DEFAULT_SCALE) {
  const clears = [];
  for (const config of allConfigs(stage)) {
    const j = judge(stage, config, scale);
    if (j.clear) clears.push({ config, key: configKey(config), ids: [...config.connected].sort(), used: j.used, buckets: j.buckets, drained: j.drained, rank: rank(stage, j), allOnScale: j.allOnScale, anyBroken: j.states.some(s => s.broken.size) });
  }
  if (!clears.length) return { clears, perfect: null, perfectKey: null, perfectCount: null, perfectBuckets: null, perfectDrained: null, unique: false };
  let best = [clears[0]];
  for (const c of clears.slice(1)) {
    if (lexLess(c.rank, best[0].rank)) best = [c];
    else if (!lexLess(best[0].rank, c.rank)) best.push(c);
  }
  return { clears, perfect: best[0].ids, perfectKey: best[0].key, perfectConfig: best[0].config, perfectCount: best[0].used, perfectBuckets: best[0].buckets, perfectDrained: best[0].drained, unique: best.length === 1 };
}

export function evaluate(stage, config, analysis, scale = DEFAULT_SCALE) {
  const j = judge(stage, config, scale);
  const isPerfect = j.clear && analysis.perfectKey !== null && configKey(config) === analysis.perfectKey;
  const score = j.clear ? pipeScore({ used: j.used, perfectCount: analysis.perfectCount, isPerfect }) : new Fraction(0n);
  const outcome = !j.clear ? 'ng' : isPerfect ? 'perfect' : 'clear';
  return { ...j, isPerfect, score, outcome };
}
