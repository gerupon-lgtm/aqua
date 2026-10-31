// 面のつなぎ方から計算・判定・採点を行う（logic-design 4〜5章）
import { Fraction, frac } from './fraction.js';
import { solveCircuit } from './flow.js';
import { onScale, DEFAULT_SCALE } from './pitch.js';
import { pipeScore, outletVerdict } from './score.js';

export function buildCircuit(stage, connectedIds) {
  const connected = new Set(connectedIds);
  return {
    spring: { id: stage.spring.id, height: frac(stage.spring.height) },
    towers: stage.towers.map(t => ({ id: t.id })),
    outlets: stage.outlets.map(o => ({
      id: o.id, tower: o.tower, height: frac(o.height), conductance: frac(o.conductance)
    })),
    pipes: stage.candidates
      .filter(c => connected.has(c.id))
      .map(c => ({ id: c.id, a: c.a, b: c.b, conductance: new Fraction(1n).div(frac(c.thinness)) }))
  };
}

// 採点をしない判定（出題の検査にも使う）
export function judge(stage, connectedIds, scale = DEFAULT_SCALE) {
  const result = solveCircuit(buildCircuit(stage, connectedIds));
  const outlets = stage.outlets.map(o => ({
    id: o.id,
    flow: result.outlets[o.id].flow,
    target: frac(o.target),
    verdict: outletVerdict(result.outlets[o.id].flow, frac(o.target))
  }));
  const clear = outlets.every(o => o.verdict === 'exact');
  const watered = Object.values(result.towers).filter(t => t.state === 'water');
  const allOnScale = watered.every(t => onScale(t.level, scale));
  return { result, outlets, clear, allOnScale, used: new Set(connectedIds).size };
}

// すべてのつなぎ方を調べ、満点のつなぎ方を決める（試作では端末で計算する。本番は事前生成、C-04）
export function analyzeStage(stage, scale = DEFAULT_SCALE) {
  const ids = stage.candidates.map(c => c.id);
  const clears = [];
  for (let mask = 1; mask < 1 << ids.length; mask++) {
    const chosen = ids.filter((_, i) => mask & (1 << i));
    const j = judge(stage, chosen, scale);
    if (j.clear) clears.push({ ids: chosen, used: j.used, allOnScale: j.allOnScale });
  }
  if (!clears.length) return { clears, perfect: null, perfectCount: null, unique: false };
  const perfectCount = Math.min(...clears.map(c => c.used));
  const best = clears.filter(c => c.used === perfectCount);
  return { clears, perfect: best[0].ids, perfectCount, unique: best.length === 1 };
}

export function evaluate(stage, connectedIds, analysis, scale = DEFAULT_SCALE) {
  const j = judge(stage, connectedIds, scale);
  const key = ids => [...ids].sort().join(',');
  const isPerfect = j.clear && analysis.perfect !== null && key(connectedIds) === key(analysis.perfect);
  const score = j.clear ? pipeScore({ used: j.used, perfectCount: analysis.perfectCount, isPerfect }) : new Fraction(0n);
  const outcome = !j.clear ? 'ng' : isPerfect ? 'perfect' : 'clear';
  return { ...j, isPerfect, score, outcome };
}
