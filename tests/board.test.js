import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate, thinnessOf } from '../src/logic/play.js';
import { renderBoard, layoutFor, pipeCrossings, pipePath } from '../src/ui/board.js';
import { resultCardDelay, RAINBOW_AFTER_MS, RAINBOW_FADE_MS } from '../src/ui/visual-timing.js';
import { PRACTICE } from '../src/content/tutorial.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';

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

test('太さを変えた管は、太さと同じ計算値を2段の札と読み上げに出す', () => {
  for (const [value, word] of [['1', '太'], ['2', '中'], ['3', '細']]) {
    const { svg } = draw(STAGES[12], { connected: new Set(['SA']), primed: new Set(), thickness: { SA: value } }, { phase: 'edit' });
    const tag = /<g class="pipe-label" data-pipe-label="SA"[\s\S]*?<\/g>/.exec(svg)?.[0];
    assert.ok(tag?.includes(`aria-label="配管SA ${word} 数字${value}"`));
    assert.ok(tag.includes(`>${word}</text><text`));
    assert.ok(tag.includes(`>${value}</text>`));
    assert.ok(tag.includes('pointer-events="all"'));
  }
});

test('出題で変わる給水塔の高さと、物差し・給水塔・グラスの目盛りが一致する', () => {
  const base = STAGES[6];
  for (const stage of [STAGES[0], ...CHALLENGES[base.id].map(q => applyValues(base, q.values))]) {
    const { svg } = draw(stage, { connected: new Set(), primed: new Set(), thickness: {} }, { phase: 'edit' });
    const H = Number(stage.spring.height), layout = layoutFor(stage);
    assert.ok(svg.includes(`aria-label="給水塔の高さ${stage.spring.height}"`));
    assert.ok(svg.includes(`>高さ${stage.spring.height}</text>`));
    const ruler = [...svg.matchAll(/class="ruler-tick" data-height-level="(\d+)"><line[^>]*y1="([^"]+)"/g)];
    assert.equal(ruler.length, H + 1);
    for (const [, value, y] of ruler) {
      assert.equal(Number(y), layout.yOf(Number(value)));
      if (Number(value) === 0) continue;
      for (const kind of ['spring', 'glass']) assert.ok(svg.includes(`class="${kind}-tick" data-height-level="${value}"`) && new RegExp(`class="${kind}-tick" data-height-level="${value}"[^>]*y1="${y}"`).test(svg));
    }
  }
});

test('器の案内枠に必要量の札と器が入り、高い出口でも札を外へ置き去りにしない', () => {
  for (const stage of [PRACTICE, ...STAGES]) {
    const { svg } = draw(stage, { connected: new Set(), primed: new Set(), thickness: {} }, { guide: 'basin' });
    const match = /<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)" rx="10" class="guide-ring-back"/.exec(svg);
    assert.ok(match, stage.id);
    const [, , y, , h] = match.map(Number);
    const floor = layoutFor(stage).yOf(Number(stage.outlets[0].height));
    assert.ok(y <= floor - 60, `${stage.id}: 札の上が枠から出ている`);
    assert.ok(y + h >= floor + 3, `${stage.id}: 器の底が枠から出ている`);
  }
});

test('案内中の配管は白と青の下敷きで示し、札より後の色の膜で覆わない', () => {
  const { svg } = draw(PRACTICE, { connected: new Set(), primed: new Set(), thickness: {} }, { guide: 'pipe:P1', phase: 'edit' });
  assert.ok(svg.indexOf('class="guide-pipe"') < svg.indexOf('data-pipe="P1"'));
  assert.ok(svg.includes('stroke="#0875cb"'));
  assert.ok(!svg.includes('path.guide-ring'));
});

test('配管の案内は時刻で光量が変わる。控えめ表示でも光と輝きの印が消えない', () => {
  const cfg = { connected: new Set(), primed: new Set(), thickness: {} };
  const sample = (time, reducedMotion) => draw(PRACTICE, cfg, { guide: 'pipe:P1', phase: 'edit', time, reducedMotion }).svg;
  const glow = svg => /class="guide-bloom"[^>]*opacity="([^"]+)"/.exec(svg)?.[1];
  assert.notEqual(glow(sample(0, false)), glow(sample(300, false)));
  assert.equal(glow(sample(0, true)), '1.000');
  assert.equal(glow(sample(0, true)), glow(sample(300, true)));
  assert.ok(sample(0, true).includes('class="guide-spark"'));
});

test('高い器の台座には不透明な陶器の面と地面につく足がある', () => {
  const { svg } = draw(STAGES[3], { connected: new Set(), primed: new Set(), thickness: {} }, { phase: 'edit' });
  assert.match(svg, /class="pedestal-body"[^>]*fill="#fffefa"/);
  assert.match(svg, /class="pedestal-foot"[^>]*fill="#fffefa"/);
});

test('8面の交差は接続点や段を動かさず、管をまたぐ図形で示す', () => {
  const stage = STAGES[7], layout = layoutFor(stage);
  const before = stage.candidates.map(c => pipePath(layout, c));
  const crossings = pipeCrossings(layout, stage);
  assert.ok(crossings.some(c => c.id === 'SB'));
  const { svg } = draw(stage, { connected: new Set(), primed: new Set(), thickness: {} }, { phase: 'edit' });
  assert.ok(svg.includes('data-pipe-bridge="SB"'));
  assert.deepEqual(stage.candidates.map(c => pipePath(layout, c)), before);
});

test('交差の曲線より下で見えるはずの縦管を、背景の四角で消さない', () => {
  for (const stage of STAGES) {
    const layout = layoutFor(stage), crossings = pipeCrossings(layout, stage);
    if (!crossings.length) continue;
    const { svg } = draw(stage, { connected: new Set(), primed: new Set(), thickness: {} }, { phase: 'edit' });
    const groups = [...svg.matchAll(/<g class="pipe-bridge"[^>]*>([\s\S]*?)<\/g>/g)];
    for (const [i, cross] of crossings.entries()) {
      // 水平の管は上へ曲がるので、その下（元の交点+2）の縦管は見えている必要がある。
      const x = cross.left, y = cross.y + 2;
      for (const rect of groups[i][1].matchAll(/<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"[^>]*fill="([^"]+)"/g)) {
        const [, rx, ry, width, height, fill] = rect;
        const covered = fill !== 'none' && x >= Number(rx) && x <= Number(rx) + Number(width) && y >= Number(ry) && y <= Number(ry) + Number(height);
        assert.ok(!covered, `${stage.id}: 交差の下の縦管が消える`);
      }
    }
  }
});

test('届いた量が0の噴水盤には水を描かない（空のグラスの噴水盤に水が見えた不具合）', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SA']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.every(o => o.flow.isZero()), '前提：噴水盤に何も届かない');
  assert.ok(!svg.includes('class="through-flow"'), '量0の噴水盤に流れる水がある');
  assert.ok(!svg.includes('class="amount-fill"'), '量を水位に置き換えない');
});

test('空の器にも陶器の枠と窓があり、流量用の水位目盛りは付けない', () => {
  const { svg } = draw(STAGES[0], { connected: new Set(), primed: new Set(), thickness: {} });
  assert.ok(svg.includes('class="porcelain-body"'));
  assert.ok(svg.includes('class="ceramic-windows"'));
  assert.ok(!svg.includes('class="rear-gauge"') && !svg.includes('class="amount-mark"'));
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

test('通常の動きでも、虹が薄い途中から出そろうまでを結果カードより先に描く', () => {
  const config = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const middle = draw(STAGES[0], config, { fountainAt: 0, time: RAINBOW_AFTER_MS + RAINBOW_FADE_MS / 2, reducedMotion: false });
  const opacity = Number(middle.svg.match(/class="rainbow" opacity="([\d.]+)"/)?.[1]);
  assert.ok(opacity > 0 && opacity < 1, '虹が薄い途中の状態がある');
  const fullAt = RAINBOW_AFTER_MS + RAINBOW_FADE_MS;
  const full = draw(STAGES[0], config, { fountainAt: 0, time: fullAt, reducedMotion: false });
  assert.ok(full.svg.includes('class="rainbow" opacity="1.000"'));
  const timing = { jingleMs: 1400, cardClearMs: 2300, cardNgMs: 2300 };
  assert.ok(resultCardDelay('perfect', timing) - timing.jingleMs >= fullAt + 500);
});

test('届いた水は流れとして描き、量をたまった水位で示さない', () => {
  const stage = STAGES[0];
  const config = { connected: new Set(['SB']), primed: new Set(), thickness: {} };
  const { ev, svg } = draw(stage, config);
  assert.ok(ev.outlets.some(o => !o.flow.isZero()), '前提：噴水盤に届く');
  assert.ok(svg.includes('class="through-flow"'), '届いた水の流れがない');
  assert.ok(!svg.includes('class="amount-fill"'), '流量を水位へ置き換えない');
});

test('全30面で実際に描く吹き出し口と管の終点が、計算の出口高さに一致する', () => {
  for (const stage of [PRACTICE, ...STAGES]) {
    const { svg } = draw(stage, { connected: new Set(), primed: new Set(), thickness: {} });
    const mouths = [...svg.matchAll(/<g class="basin" transform="translate\(0 ([^)]+)\)">([\s\S]*?)<g class="outlet-mouth" data-outlet="([^"]+)"[^>]*><ellipse cx="([^"]+)" cy="([^"]+)"/g)];
    assert.equal(mouths.length, stage.outlets.length);
    for (const [, offset, body, id, , localY] of mouths) {
      const o = stage.outlets.find(o => o.id === id), expected = layoutFor(stage).yOf(Number(o.height));
      assert.ok(Math.abs(Number(offset) + Number(localY) - expected) < 1e-8);
      const d = /class="outlet-pipe"[^>]*d="([^"]+)"/.exec(body)?.[1];
      const tipY = /V([\d.-]+)$/.exec(d)?.[1];
      assert.ok(Math.abs(Number(offset) + Number(tipY) - expected) < 1e-8);
      assert.ok(svg.includes(`>出口高さ${o.height}</text>`));
      assert.ok(svg.includes('/秒</text>'));
    }
  }
});
