import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate, thinnessOf } from '../src/logic/play.js';
import { renderBoard, layoutFor } from '../src/ui/board.js';

// 盤面の描画の点検（DOMを使わず、描いたSVGの文字列を調べる）
function draw(stage, config) {
  const ev = evaluate(stage, config, analyzeStage(stage));
  const svg = { innerHTML: '' };
  renderBoard(svg, {
    stage, layout: layoutFor(stage), connected: config.connected, primed: config.primed,
    thinness: c => thinnessOf(c, config), selected: null, phase: 'result', levels: new Map(),
    settled: true, view: ev.states[0], gateClosed: false, fountainAt: null, outcome: ev.outcome,
    prevLevels: new Map(), time: 0, reducedMotion: true, highlight: null,
    onScale: () => false, tickDistance: () => 1
  });
  return { ev, svg: svg.innerHTML };
}

test('届いた量が0の噴水盤には水を描かない（空のグラスの噴水盤に水が見えた不具合）', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SA']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.every(o => o.flow.isZero()), '前提：噴水盤に何も届かない');
  assert.ok(!svg.includes('clip-path="url(#clip-'), '量0の噴水盤に水の塗りがある');
});

test('届いた噴水盤には水を描く', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.some(o => !o.flow.isZero()), '前提：噴水盤に届く');
  assert.ok(svg.includes('clip-path="url(#clip-'), '届いた噴水盤に水の塗りがない');
});
