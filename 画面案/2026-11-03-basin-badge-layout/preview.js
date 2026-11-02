// 本番の画面枠・描画・計算を使い、高さと必要量の札だけを差し替える。
import { STAGES } from '../../src/content/stages.js';
import { analyzeStage, evaluate, normalizeConfig, thinnessOf } from '../../src/logic/play.js';
import { renderBoard, layoutFor, boardViewBox, basinPlacement } from '../../src/ui/board.js';
import { badge } from './badge.js';

const params = new URLSearchParams(location.search);
const variant = params.get('variant') === 'b' ? 'b' : 'a';
const state = params.get('state') ?? 'empty';
const stage = STAGES[3], layout = layoutFor(stage);
const config = normalizeConfig({ connected: state === 'empty' ? [] : state === 'perfect' ? ['SA', 'BA', 'SB'] : ['SA'], primed: [], thickness: {} });
const analysis = analyzeStage(stage), evaluation = evaluate(stage, config, analysis), view = evaluation.states[0];
const svg = document.querySelector('#board');
svg.setAttribute('viewBox', boardViewBox(layout, stage, true));
renderBoard(svg, {
  stage, layout, connected: config.connected, primed: config.primed, thinness: c => thinnessOf(c, config),
  phase: state === 'empty' ? 'edit' : 'result', settled: state !== 'empty', view,
  levels: new Map(stage.towers.map(t => [t.id, state !== 'empty' && view.result.towers[t.id].state === 'water' ? view.result.towers[t.id].level.toNumber() : null])),
  prevLevels: new Map(), time: 10000, reducedMotion: true, fountainAt: state === 'perfect' ? 0 : null,
  outcome: evaluation.outcome, onScale: () => false, tickDistance: () => 1
});
for (const g of svg.querySelectorAll('.board-badge')) if (/^出口高さ/.test(g.textContent)) g.remove();
for (const [i, o] of stage.outlets.entries()) {
  const group = svg.querySelectorAll('.basin')[i], { cx } = basinPlacement(layout, o);
  const rate = [...group.querySelectorAll('.board-badge')].find(g => g.textContent.startsWith('必要量'));
  const amount = [], height = [];
  if (variant === 'a') {
    const verdict = state === 'empty' ? null : view.outlets.find(v => v.id === o.id);
    const [tone, mark] = { exact: ['blue', 'check'], short: ['slate', 'minus'], over: ['orange', 'plus'] }[verdict?.verdict] ?? ['light', null];
    badge(amount, { x: cx, y: 336 - 32, text: `必要量${o.target}/秒`, tone, mark, size: 9, h: 16 });
    rate.outerHTML = amount.join('');
    // 給水塔の高さと同じ大きさ・枠。部品上端からの距離も−15で共通。
    badge(height, { x: cx, y: 336 - 15, text: `高さ${o.height}`, size: 9, h: 14 });
  } else {
    // 横長では中央の吹き出し口を覆う。左下の2段札なら口・実管・水の流れを避けられる。
    const x = cx - 30, y = 370 - 26;
    height.push(`<g class="lower-height-badge board-badge" aria-label="出口高さ${o.height}"><rect x="${x}" y="${y}" width="26" height="26" rx="3.5" fill="#fff" stroke="#1d4f88" stroke-width="1.2"/><rect x="${x + 1.6}" y="${y + 1.6}" width="22.8" height="22.8" rx="2.2" fill="none" stroke="rgba(29,79,136,.22)" stroke-width=".8"/><text x="${x + 13}" y="${y + 10}" text-anchor="middle" fill="#17314c" font-size="9" font-weight="700">高さ</text><text x="${x + 13}" y="${y + 22}" text-anchor="middle" fill="#17314c" font-size="11.5" font-weight="700">${o.height}</text></g>`);
  }
  group.insertAdjacentHTML('beforeend', height.join(''));
  if (variant === 'b') {
    // 太さの直線は実管の左の立ち下がりから出し、下部の高さ札を横切らせない。
    const node = layout.nodes.get(o.tower), leader = svg.querySelectorAll('.outlet-leader')[i];
    const mouthY = layout.yOf(Number(o.height));
    leader.setAttribute('d', leader.getAttribute('d').replace(/^M[^L]+/, `M${node.cx - 2} ${mouthY + 4} `));
    const dot = leader.nextElementSibling;
    dot.setAttribute('cx', node.cx - 2); dot.setAttribute('cy', mouthY + 4);
    const lower = group.querySelector('.lower-height-badge');
    lower.setAttribute('transform', `translate(0 ${mouthY - 370})`);
    svg.append(lower);
  }
}
document.querySelector('#version').textContent = `v0.14.10 配置案${variant.toUpperCase()}`;
document.querySelector('.cond-res b').textContent = config.connected.size;
if (state !== 'empty') {
  document.querySelector('#panel').innerHTML = '<p class="hint">グラスをなぞると、そのグラスの音を聞き直せます。</p><div class="actions"><button id="show-result">結果</button><button id="stop">配管を見直す</button></div>';
}
document.querySelector('#app').inert = true;
