// 実際の出題・分数計算から、描画点検用の空／満点／全接続を準備する。
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { PRACTICE } from '../src/content/tutorial.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { analyzeStage, evaluate, normalizeConfig, thinnessOf } from '../src/logic/play.js';
import { layoutFor } from '../src/ui/board.js';
import { FREE_SAMPLES } from '../src/content/free-samples.js';
import { emptyCircuit, freeStage, freeConfig, evaluateFree } from '../src/logic/free.js';

export const BASES = [PRACTICE, ...STAGES];
function configFromKey(key, stage) {
  const value = { connected: [], primed: [], pumped: [], thickness: {}, drains: {} };
  for (const part of key.split(',').filter(Boolean)) {
    const match = /^([^:+*]+)(?::([^+*]+))?([+*])?$/.exec(part);
    if (stage.drains?.some(d => d.id === match[1])) {
      value.drains[match[1]] = match[2];
      continue;
    }
    value.connected.push(match[1]);
    if (match[2]) value.thickness[match[1]] = match[2];
    if (match[3]) value.primed.push(match[1]);
    if (match[3] === '*') value.pumped.push(match[1]);
  }
  return normalizeConfig(value);
}
export function getCase(base, index = 0) {
  const question = CHALLENGES[base.id]?.[index];
  const stage = question ? applyValues(base, question.values) : base;
  const analysis = question ? { ...question.expected, perfectConfig: configFromKey(question.expected.perfectKey, stage) } : analyzeStage(stage);
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
    pumped: config.pumped, drains: config.drains,
    thinness: c => thinnessOf(c, config), phase: state === 'empty' ? 'edit' : 'result',
    settled: state !== 'empty', view,
    levels: new Map(stage.towers.map(t => [t.id, state !== 'empty' && view.result.towers[t.id].state === 'water' ? view.result.towers[t.id].level.toNumber() : null])),
    gateClosed: view.name === 'closed', prevLevels: new Map(), time: 10000, reducedMotion: true,
    fountainAt: state !== 'empty' && ev.outcome !== 'ng' ? 0 : null, outcome: ev.outcome,
    onScale: () => false, tickDistance: () => 1
  } };
}

export function freeVisualCases() {
  const basic = FREE_SAMPLES[0].circuit();
  const all = FREE_SAMPLES[1].circuit();
  const high = structuredClone(all);
  high.towers.forEach((t, i) => { t.outlet.height = String(i * 2); });
  const lifted = structuredClone(basic);
  lifted.pipes[1].crest = '10'; lifted.pipes[1].gate = true;
  const dense = { spring:{height:'12'}, towers:['A','B','C'].map((id,slot)=>({id,slot,outlet:{height:String(slot*2)}})),
    pipes:[{id:'SA',a:'S',b:'A',thinness:'3',crest:null,gate:false},{id:'SB',a:'S',b:'B',thinness:'2',crest:null,gate:true},
      {id:'AC',a:'A',b:'C',thinness:'2',crest:null,gate:false},{id:'BC',a:'B',b:'C',thinness:'3',crest:null,gate:false}],primed:[] };
  return [{ id: 'empty', circuit: emptyCircuit() }, ...FREE_SAMPLES.map(s => ({ id: s.id, circuit: s.circuit(), goal: s.goal })),
    { id: 'high', circuit: high }, { id: 'siphon', circuit: lifted }, { id:'dense', circuit:dense }];
}

export function freeModelFor(item, phase = 'edit', viewIndex = 0) {
  const ev = evaluateFree(item.circuit), config = normalizeConfig(freeConfig(item.circuit));
  const stage = phase === 'edit' ? freeStage(item.circuit) : ev.stage, view = ev.states[viewIndex];
  return { stage, layout: layoutFor(stage), connected: config.connected, primed: config.primed, pumped: config.pumped,
    drains: {}, thinness: c => thinnessOf(c, config), phase, settled: phase !== 'edit', view,
    levels: new Map(stage.towers.map(t => [t.id, phase === 'edit' ? null : view.result.towers[t.id]?.level?.toNumber() ?? null])),
    gateClosed: view.name === 'closed', prevLevels: new Map(), time: 10000, reducedMotion: true,
    fountainAt: null, outcome: 'free', freeGoal: item.goal?.targets, freeSelected: null,
    onScale: () => false, tickDistance: () => 1 };
}
