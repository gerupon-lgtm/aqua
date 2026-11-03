// 実際の出題・分数計算から、描画点検用の空／満点／全接続を準備する。
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { PRACTICE } from '../src/content/tutorial.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { analyzeStage, evaluate, normalizeConfig, thinnessOf } from '../src/logic/play.js';
import { layoutFor } from '../src/ui/board.js';

export const BASES = [PRACTICE, ...STAGES];
function configFromKey(key) {
  const value = { connected: [], primed: [], thickness: {} };
  for (const part of key.split(',').filter(Boolean)) {
    const match = /^([^:+]+)(?::([^+]+))?(\+)?$/.exec(part);
    value.connected.push(match[1]);
    if (match[2]) value.thickness[match[1]] = match[2];
    if (match[3]) value.primed.push(match[1]);
  }
  return normalizeConfig(value);
}
export function getCase(base, index = 0) {
  const question = CHALLENGES[base.id]?.[index];
  const stage = question ? applyValues(base, question.values) : base;
  const analysis = question ? { ...question.expected, perfectConfig: configFromKey(question.expected.perfectKey) } : analyzeStage(stage);
  if (question) stage.draw = { number: question.number, total: CHALLENGES[base.id].length };
  return { stage, analysis, question: question?.number ?? 1 };
}
export function modelFor(item, state = 'empty', viewIndex = 0) {
  const { stage, analysis } = item;
  const config = normalizeConfig(state === 'empty' ? [] : state === 'perfect' ? analysis.perfectConfig : {
    connected: stage.candidates.map(c => c.id),
    primed: stage.candidates.filter(c => c.siphon).map(c => c.id),
    thickness: {}
  });
  const ev = evaluate(stage, config, analysis), view = ev.states[viewIndex];
  return { config, ev, model: {
    stage, layout: layoutFor(stage), connected: config.connected, primed: config.primed,
    thinness: c => thinnessOf(c, config), phase: state === 'empty' ? 'edit' : 'result',
    settled: state !== 'empty', view,
    levels: new Map(stage.towers.map(t => [t.id, state !== 'empty' && view.result.towers[t.id].state === 'water' ? view.result.towers[t.id].level.toNumber() : null])),
    gateClosed: view.name === 'closed', prevLevels: new Map(), time: 10000, reducedMotion: true,
    fountainAt: state !== 'empty' && ev.outcome !== 'ng' ? 0 : null, outcome: ev.outcome,
    onScale: () => false, tickDistance: () => 1
  } };
}
