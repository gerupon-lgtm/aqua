// 断面の盤面（SVG）。真横から見た図で、画面の上下がそのまま高さ（screens.md 2章）。
// 計算は分数で済ませてあり、ここでは描画の直前に小数へ直すだけ。

export const VIEW_W = 360;
export const VIEW_H = 470;
const GROUND = 370;
const TOWER_W = 34;
const SPRING_W = 46;

export function layoutFor(stage) {
  const H = Number(stage.spring.height);
  const unit = Math.min(40, 300 / (H + 1));
  const xOf = x => 18 + x * 32.4;
  const nodes = new Map();
  nodes.set(stage.spring.id, { id: stage.spring.id, kind: 'spring', cx: xOf(stage.spring.x), w: SPRING_W });
  for (const t of stage.towers) nodes.set(t.id, { id: t.id, kind: 'tower', cx: xOf(t.x), w: TOWER_W });
  const towerTop = GROUND - (H + 1) * unit;
  return { H, unit, nodes, towerTop, yOf: level => GROUND - level * unit };
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WIDTH = { 1: 10, 2: 6.5, 3: 4 };

// 管の通り道：塔の底から地面の下へ下り、横へ進んで、相手の底へ上がる
function pipePath(layout, c) {
  const a = layout.nodes.get(c.a);
  const b = layout.nodes.get(c.b);
  const [left, right] = a.cx <= b.cx ? [a, b] : [b, a];
  const shift = (c.depth - 2) * 7;
  const x1 = left.cx + shift + (left.kind === 'spring' ? 6 : 0);
  const x2 = right.cx - shift;
  const y = GROUND + 12 + c.depth * 22;
  const r = 9;
  const d = `M${x1} ${GROUND - 2} L${x1} ${y - r} Q${x1} ${y} ${x1 + r} ${y} L${x2 - r} ${y} Q${x2} ${y} ${x2} ${y - r} L${x2} ${GROUND - 2}`;
  return { d, reversed: left.id !== c.a };
}

// 水の色：少ない塔は明るく、多い塔は暗く（要件5.5）
function waterColor(level, H) {
  const t = Math.max(0, Math.min(1, level / Math.max(H, 1)));
  const light = [140, 205, 243];
  const deep = [34, 96, 166];
  const mix = light.map((v, i) => Math.round(v + (deep[i] - v) * t));
  return `rgb(${mix.join(',')})`;
}

function surfacePath(x0, x1, y, amp, phase) {
  if (amp < 0.05) return `M${x0} ${y} L${x1} ${y}`;
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const x = x0 + ((x1 - x0) * i) / 12;
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + Math.sin(phase + i * 0.9) * amp).toFixed(2)}`);
  }
  return pts.join(' ');
}

function basinShape(cx) {
  const top = GROUND - 26;
  return {
    top, left: cx - 22, right: cx + 22,
    bowl: `M${cx - 24} ${top} L${cx + 24} ${top} L${cx + 17} ${GROUND - 4} Q${cx} ${GROUND + 2} ${cx - 17} ${GROUND - 4} Z`
  };
}

// model: { stage, layout, connected:Set, phase, levels:Map(id→number|null), settled, evaluation,
//          prevLevels:Map, time, reducedMotion, highlight:{id, until} }
export function renderBoard(svg, model) {
  const { stage, layout, connected, phase, levels, settled, evaluation, prevLevels, time, reducedMotion } = model;
  const { H, unit, towerTop } = layout;
  const out = [];
  out.push(`<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky-top)"/><stop offset="1" stop-color="var(--sky-bottom)"/></linearGradient>
    <linearGradient id="glassfill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity=".7"/></linearGradient>
    <linearGradient id="bow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e98a8a"/><stop offset=".22" stop-color="#efc173"/><stop offset=".42" stop-color="#e6e07d"/>
      <stop offset=".6" stop-color="#8fd3a3"/><stop offset=".8" stop-color="#83b6ea"/><stop offset="1" stop-color="#ad94e3"/></linearGradient>
  </defs>`);
  out.push(`<rect x="0" y="0" width="${VIEW_W}" height="${GROUND}" fill="url(#sky)"/>`);
  out.push(`<rect x="0" y="${GROUND}" width="${VIEW_W}" height="${VIEW_H - GROUND}" fill="var(--soil)"/>`);
  out.push(`<line x1="0" y1="${GROUND}" x2="${VIEW_W}" y2="${GROUND}" stroke="var(--soil-line)" stroke-width="2"/>`);

  // 水路の候補とつないだ水路
  for (const c of stage.candidates) {
    const { d, reversed } = pipePath(layout, c);
    const on = connected.has(c.id);
    const w = WIDTH[Number(c.thinness)] ?? 5;
    const flowInfo = settled || phase !== 'edit' ? evaluation?.result.pipes[c.id] : null;
    const wet = on && phase !== 'edit' && flowInfo?.wet;
    out.push(`<g class="pipe${on ? ' on' : ''}" data-pipe="${c.id}">`);
    if (on) {
      out.push(`<path d="${d}" fill="none" stroke="var(--pipe-edge)" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>`);
      out.push(`<path d="${d}" fill="none" stroke="${wet ? 'var(--water-mid)' : 'var(--pipe-empty)'}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
      if (wet && flowInfo && !flowInfo.flow.isZero()) {
        const speed = Math.max(0.6, 3.2 / Math.min(6, Math.abs(flowInfo.flow.toNumber())));
        const forward = (flowInfo.flow.sign() > 0) !== reversed;
        out.push(`<path d="${d}" fill="none" class="current${forward ? '' : ' back'}" stroke-width="${Math.max(2, w - 4)}" style="animation-duration:${speed.toFixed(2)}s"/>`);
      }
    } else {
      out.push(`<path d="${d}" fill="none" stroke="var(--pipe-off)" stroke-width="${Math.max(2, w - 3)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 6" opacity=".8"/>`);
    }
    if (phase === 'edit') out.push(`<path d="${d}" fill="none" stroke="transparent" stroke-width="26" class="hit" data-pipe="${c.id}"/>`);
    out.push(`</g>`);
  }

  // 泉
  const spring = layout.nodes.get(stage.spring.id);
  const sx0 = spring.cx - spring.w / 2;
  const sy = layout.yOf(H);
  out.push(`<rect x="${sx0 - 4}" y="${sy - 10}" width="${spring.w + 8}" height="${GROUND - sy + 10}" rx="5" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
  out.push(`<rect x="${sx0}" y="${sy}" width="${spring.w}" height="${GROUND - sy}" fill="${waterColor(H, H)}"/>`);
  out.push(`<path d="${surfacePath(sx0, sx0 + spring.w, sy, reducedMotion ? 0 : 0.8, time / 420)}" stroke="var(--surface)" stroke-width="2" fill="none"/>`);
  out.push(`<text x="${spring.cx}" y="${sy - 16}" class="label" text-anchor="middle">泉</text>`);

  // 塔
  for (const t of stage.towers) {
    const node = layout.nodes.get(t.id);
    const x0 = node.cx - TOWER_W / 2;
    const x1 = node.cx + TOWER_W / 2;
    const level = levels.get(t.id);
    const finalT = evaluation?.result.towers[t.id];
    const onTick = settled && finalT?.state === 'water' && model.onScale(finalT.level);
    // 塔の光（ぼかしのフィルターは処理が重いので、太い半透明の線を重ねて表す）
    if (onTick) {
      out.push(`<rect x="${x0 - 5}" y="${towerTop - 5}" width="${TOWER_W + 10}" height="${GROUND - towerTop + 5}" rx="10" fill="none" stroke="var(--gold)" stroke-width="8" opacity=".22"/>`);
      out.push(`<rect x="${x0 - 2}" y="${towerTop - 2}" width="${TOWER_W + 4}" height="${GROUND - towerTop + 2}" rx="7" fill="none" stroke="var(--gold)" stroke-width="3" opacity=".75"/>`);
    }
    out.push(`<rect x="${x0}" y="${towerTop}" width="${TOWER_W}" height="${GROUND - towerTop}" rx="6" fill="url(#glassfill)"/>`);
    if (level !== null && level !== undefined && level * unit > 1.5) {
      const y = layout.yOf(level);
      out.push(`<rect x="${x0 + 2}" y="${y}" width="${TOWER_W - 4}" height="${(GROUND - y - 1).toFixed(2)}" rx="3" fill="${waterColor(level, H)}" opacity=".92"/>`);
      const dist = settled && finalT?.state === 'water' ? model.tickDistance(finalT.level) : 0;
      const amp = reducedMotion ? 0 : dist * 6;
      out.push(`<path d="${surfacePath(x0 + 2, x1 - 2, y, amp, time / 260 + node.cx)}" stroke="var(--surface)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    }
    // 目盛り（音名は出さない）
    for (let k = 1; k <= H; k++) {
      const y = layout.yOf(k);
      out.push(`<line x1="${x0 - 5}" y1="${y}" x2="${x0 + 5}" y2="${y}" stroke="var(--tick)" stroke-width="1.4"/>`);
    }
    // 前回の水面の線（編集中だけ）
    const prev = prevLevels?.get(t.id);
    if (phase === 'edit' && prev !== null && prev !== undefined) {
      const y = layout.yOf(prev);
      out.push(`<line x1="${x0 + 3}" y1="${y}" x2="${x1 - 3}" y2="${y}" stroke="var(--prev)" stroke-width="1.6" stroke-dasharray="3 3"/>`);
    }
    const lit = model.highlight && model.highlight.id === t.id && model.highlight.until > time;
    out.push(`<rect x="${x0}" y="${towerTop}" width="${TOWER_W}" height="${GROUND - towerTop}" rx="6" fill="none" stroke="${lit ? 'var(--gold)' : 'var(--glass-edge)'}" stroke-width="${lit ? 3 : 1.8}"/>`);
    out.push(`<rect x="${x0 + 5}" y="${towerTop + 6}" width="3" height="${GROUND - towerTop - 14}" rx="1.5" fill="#ffffff" opacity=".7"/>`);
    if (settled && finalT?.state === 'empty') {
      out.push(`<text x="${node.cx}" y="${GROUND - 10}" class="tiny" text-anchor="middle">空</text>`);
    }
  }

  // 出口の噴水盤
  for (const o of stage.outlets) {
    const node = layout.nodes.get(o.tower);
    const cx = node.cx + TOWER_W / 2 + 28;
    const b = basinShape(cx);
    const verdict = settled ? evaluation?.outlets.find(v => v.id === o.id) : null;
    const flowing = phase !== 'edit' && evaluation?.result.outlets[o.id]?.active && !evaluation.result.outlets[o.id].flow.isZero();
    // 塔から噴水盤への口
    out.push(`<path d="M${node.cx + TOWER_W / 2 - 2} ${GROUND - 9} L${cx - 10} ${GROUND - 9} L${cx - 10} ${b.top + 6}" fill="none" stroke="var(--stone-edge)" stroke-width="7" stroke-linejoin="round"/>`);
    if (flowing && (settled || model.flowStarted?.has(o.id))) {
      out.push(`<path d="M${cx - 10} ${b.top + 6} Q${cx - 6} ${b.top - 8} ${cx - 2} ${b.top + 4}" fill="none" stroke="var(--water-mid)" stroke-width="3" stroke-linecap="round"/>`);
    }
    out.push(`<path d="${b.bowl}" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
    // 指定量の印と、届いた量
    const markY = b.top + 9;
    if (verdict) {
      const ratio = Math.min(1.25, verdict.flow.toNumber() / Math.max(verdict.target.toNumber(), 1e-9));
      const fillTop = GROUND - 4 - (GROUND - 4 - markY) * ratio;
      out.push(`<clipPath id="clip-${o.id}"><path d="${b.bowl}"/></clipPath>`);
      out.push(`<rect x="${b.left - 4}" y="${Math.max(b.top - 2, fillTop)}" width="52" height="${GROUND}" fill="var(--water-mid)" opacity=".85" clip-path="url(#clip-${o.id})"/>`);
      if (verdict.verdict === 'over') {
        out.push(`<path d="M${b.right + 1} ${b.top} q4 8 1 18 M${b.left - 1} ${b.top} q-4 8 -1 18" fill="none" stroke="var(--water-mid)" stroke-width="2.4" stroke-linecap="round"/>`);
      }
      if (verdict.verdict === 'exact') {
        out.push(`<path d="M${cx - 30} ${b.top - 4} A30 34 0 0 1 ${cx + 30} ${b.top - 4}" fill="none" stroke="url(#bow)" stroke-width="7" opacity=".9" class="rainbow"/>`);
      }
    }
    out.push(`<line x1="${b.left + 3}" y1="${markY}" x2="${b.right - 3}" y2="${markY}" stroke="var(--gold)" stroke-width="2"/>`);
    out.push(`<text x="${cx}" y="${GROUND + 16}" class="tiny" text-anchor="middle">指定 ${esc(o.target)}</text>`);
  }
  svg.innerHTML = out.join('');
}

// 盤面上の点から塔を探す（結果表示中のなぞりに使う）
export function towerAt(layout, stage, x, y) {
  if (y < layout.towerTop - 12 || y > GROUND + 4) return null;
  for (const t of stage.towers) {
    const node = layout.nodes.get(t.id);
    if (Math.abs(x - node.cx) <= TOWER_W / 2 + 6) return t.id;
  }
  return null;
}
