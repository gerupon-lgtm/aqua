import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate, thinnessOf } from '../src/logic/play.js';
import { renderBoard, layoutFor } from '../src/ui/board.js';

// 盤面の描画の点検（DOMを使わず、描いたSVGの文字列を調べる）
function draw(stage, config, options = {}) {
  const ev = evaluate(stage, config, analyzeStage(stage));
  const svg = { innerHTML: '' };
  renderBoard(svg, {
    stage, layout: layoutFor(stage), connected: config.connected, primed: config.primed,
    thinness: c => thinnessOf(c, config), selected: null, phase: 'result', levels: new Map(),
    settled: true, view: ev.states[0], gateClosed: false, fountainAt: null, outcome: ev.outcome,
    prevLevels: new Map(), time: 0, reducedMotion: true, highlight: null,
    onScale: () => false, tickDistance: () => 1, ...options
  });
  return { ev, svg: svg.innerHTML };
}

test('届いた量が0の噴水盤には水を描かない（空のグラスの噴水盤に水が見えた不具合）', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SA']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.every(o => o.flow.isZero()), '前提：噴水盤に何も届かない');
  assert.ok(!svg.includes('class="amount-fill"'), '量0の噴水盤に水の塗りがある');
});

test('空の器にも陶器の枠と奥側の目盛りがあり、出口は引き出し線で示す', () => {
  const { svg } = draw(STAGES[0], { connected: new Set(), primed: new Set(), thickness: {} });
  assert.ok(svg.includes('class="porcelain-body"'));
  assert.ok(svg.includes('class="rear-gauge"'));
  assert.ok(svg.includes('class="outlet-leader"'));
  assert.ok(!svg.includes('出口 太') && !svg.includes('細さ 1') && !svg.includes('目標'));
});

test('100点の虹は噴水のあとに出て、NGには噴水も虹も出ない', () => {
  const perfect = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const early = draw(STAGES[0], perfect, { fountainAt: 0, time: 799 });
  assert.equal(early.ev.outcome, 'perfect');
  assert.ok(early.svg.includes('class="fountain-core"'));
  assert.ok(!early.svg.includes('class="rainbow"'));
  const late = draw(STAGES[0], perfect, { fountainAt: 0, time: 1600 });
  assert.ok(late.svg.includes('class="rainbow"'));
  const ng = draw(STAGES[0], { connected: new Set(['SA']), primed: new Set(), thickness: {} }, { fountainAt: 0, time: 1600 });
  assert.equal(ng.ev.outcome, 'ng');
  assert.ok(!ng.svg.includes('class="fountain-core"') && !ng.svg.includes('class="rainbow"'));
});

test('控えめな演出では、噴水と虹の表示が時刻で揺れない', () => {
  const config = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const a = draw(STAGES[0], config, { fountainAt: 0, time: 1600, reducedMotion: true });
  const b = draw(STAGES[0], config, { fountainAt: 0, time: 2600, reducedMotion: true });
  assert.equal(a.svg, b.svg);
});

test('届いた噴水盤には水を描く', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.some(o => !o.flow.isZero()), '前提：噴水盤に届く');
  assert.ok(svg.includes('class="amount-fill"'), '届いた噴水盤に水の塗りがない');
});
