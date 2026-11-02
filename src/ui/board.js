// 断面の盤面（SVG）。真横から見た図で、画面の上下がそのまま高さ（screens.md 2章）。
// 計算は分数で済ませてあり、ここでは描画の直前に小数へ直すだけ。
import { RAINBOW_AFTER_MS, RAINBOW_FADE_MS, guideGlowOpacity } from './visual-timing.js';

export const VIEW_W = 360;
export const VIEW_H = 470;
const GROUND = 370;
const TOWER_W = 34;
const SPRING_W = 46;

export function layoutFor(stage) {
  const H = Number(stage.spring.height);
  // 壁とサイフォンの山も入る高さにする
  const top = Math.max(H, ...(stage.walls ?? []).map(w => Number(w.height)), ...stage.candidates.filter(c => c.siphon).map(c => Number(c.siphon.crest)));
  const unit = Math.min(40, 300 / (top + 1));
  const xOf = x => 18 + x * 32.4;
  const nodes = new Map();
  nodes.set(stage.spring.id, { id: stage.spring.id, kind: 'spring', cx: xOf(stage.spring.x), w: SPRING_W });
  for (const t of stage.towers) nodes.set(t.id, { id: t.id, kind: 'tower', cx: xOf(t.x), w: TOWER_W });
  const towerTop = GROUND - (H + 1) * unit;
  // 地面の下の段の間隔。4段ある面は少し詰めて、盤面の下に収める
  const maxDepth = Math.max(0, ...stage.candidates.map(c => c.depth ?? 0));
  const depthGap = Math.min(22, (VIEW_H - GROUND - 22) / Math.max(maxDepth, 1));
  // 同じグラスの左右・深さの違う管にも専用の取り付け位置を割り当てる。
  // 旧式の (depth−2)*7 は、8面などで別の管の縦部分を同じ位置にしていた。
  const ports = new Map();
  for (const n of nodes.values()) {
    const attached = stage.candidates.filter(c => !c.siphon && (c.a === n.id || c.b === n.id));
    attached.sort((a, b) => {
      const ax = nodes.get(a.a === n.id ? a.b : a.a).cx;
      const bx = nodes.get(b.a === n.id ? b.b : b.a).cx;
      return (ax < n.cx ? 0 : 1) - (bx < n.cx ? 0 : 1)
        || (ax < n.cx ? a.depth - b.depth : b.depth - a.depth) || a.id.localeCompare(b.id);
    });
    attached.forEach((c, i) => {
      if (!ports.has(c.id)) ports.set(c.id, {});
      ports.get(c.id)[n.id] = n.cx + (i - (attached.length - 1) / 2) * 14;
    });
  }
  return { H, unit, nodes, ports, towerTop, depthGap, yOf: level => GROUND - level * unit };
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 画面の線幅はそろえる。計算上の3段階は丸い太・中・細で伝える（発案者）。
const WIDTH = { 1: 5.5, 2: 5.5, 3: 5.5 };

// 管の通り道：グラスの底から地面の下へ下り、横へ進んで、相手の底へ上がる。
// サイフォンはグラスの中の入口から上がり、壁の上の山を越えて、相手の入口へ下りる（logic-design 3章）
export function pipePath(layout, c) {
  const a = layout.nodes.get(c.a);
  const b = layout.nodes.get(c.b);
  const [left, right] = a.cx <= b.cx ? [a, b] : [b, a];
  const reversed = left.id !== c.a;
  const r = 9;
  if (c.siphon) {
    const x1 = left.cx + 7;
    const x2 = right.cx - 7;
    const yIn = layout.yOf(Number(c.siphon.inlet));
    const yTop = layout.yOf(Number(c.siphon.crest));
    const d = `M${x1} ${yIn} L${x1} ${yTop + r} Q${x1} ${yTop} ${x1 + r} ${yTop} L${x2 - r} ${yTop} Q${x2} ${yTop} ${x2} ${yTop + r} L${x2} ${yIn}`;
    return { d, reversed, mx: (x1 + x2) / 2, my: yTop, pts: [[x1, yIn], [x1, yTop], [x2, yTop], [x2, yIn]] };
  }
  const x1 = layout.ports.get(c.id)[left.id];
  const x2 = layout.ports.get(c.id)[right.id];
  const y = GROUND + 12 + c.depth * layout.depthGap;
  const d = `M${x1} ${GROUND - 2} L${x1} ${y - r} Q${x1} ${y} ${x1 + r} ${y} L${x2 - r} ${y} Q${x2} ${y} ${x2} ${y - r} L${x2} ${GROUND - 2}`;
  return { d, reversed, mx: (x1 + x2) / 2, my: y, gx: x1 + (x2 - x1) * 0.72, pts: [[x1, GROUND - 2], [x1, y], [x2, y], [x2, GROUND - 2]] };
}

// 札は管の水平部分に置く。ほかの管の縦部分や水門を覆わない場所を優先する。
const pipeLabelCache = new WeakMap();
export function pipeLabelPositions(layout, stage) {
  if (pipeLabelCache.has(layout)) return pipeLabelCache.get(layout);
  const routes = stage.candidates.map(c => ({ c, p: pipePath(layout, c) }));
  const positions = new Map();
  for (const { c, p } of routes) {
    // 最下段の管は動かさず、札だけを5pxまで上げて盤内へ収める。
    const labelY = Math.min(p.my, VIEW_H - 15);
    const lo = p.pts[1][0] + 16, hi = p.pts[2][0] - 16;
    const choices = [p.mx];
    for (let x = lo; x <= hi; x += 2) choices.push(x);
    const cost = x => {
      let score = Math.abs(x - p.mx) * .01;
      for (const { c: other, p: q } of routes) {
        if (other.id === c.id) continue;
        for (const [a, b] of [[q.pts[0], q.pts[1]], [q.pts[2], q.pts[3]]]) {
          if (labelY < Math.min(a[1], b[1]) - 14 || labelY > Math.max(a[1], b[1]) + 14) continue;
          score += Math.max(0, 19 - Math.abs(x - a[0])) * 10;
        }
      }
      if (c.gate) score += Math.max(0, 28 - Math.abs(x - (p.gx ?? p.mx))) * 10;
      for (const v of positions.values()) if (Math.abs(v.y - labelY) < 30) score += Math.max(0, 30 - Math.hypot(v.x - x, v.y - labelY)) * 40;
      return score;
    };
    choices.sort((a, b) => cost(a) - cost(b));
    positions.set(c.id, { x: choices[0], y: labelY });
  }
  pipeLabelCache.set(layout, positions);
  return positions;
}

// 盤面の点から、いちばん近い管を探す（編集中のタップ）。管の通り道を折れ線として距離を計算する。
// 管は端で7ほどの間隔で並ぶので、重なったタップ領域の上下関係で選ぶと隣の管を拾ってしまう。
// 画面の要素を調べずに計算だけで決めるので、スマホでも軽い
export function pipeAt(layout, stage, x, y, reach = 14) {
  let best = null;
  let bestDist = reach;
  for (const c of stage.candidates) {
    const { pts } = pipePath(layout, c);
    for (let i = 0; i < pts.length - 1; i++) {
      const d = segmentDistance(x, y, pts[i], pts[i + 1]);
      if (d < bestDist) { bestDist = d; best = c.id; }
    }
  }
  return best;
}

function segmentDistance(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// 地中の交差は合流ではない。水平の管に小さなまたぎを置き、奥の縦管を一部隠す。
// 段や接続点は動かさず、近い交差は1つのまたぎにまとめる。
const crossingCache = new WeakMap();
export function pipeCrossings(layout, stage) {
  if (crossingCache.has(layout)) return crossingCache.get(layout);
  const routes = stage.candidates.filter(c => !c.siphon).map(c => ({ c, p: pipePath(layout, c) }));
  const crossings = [];
  for (const { c, p } of routes) {
    const xs = new Set();
    for (const { c: other, p: q } of routes) {
      if (c.id === other.id) continue;
      for (const [a, b] of [[q.pts[0], q.pts[1]], [q.pts[3], q.pts[2]]]) {
        if (a[0] > p.pts[1][0] + 12 && a[0] < p.pts[2][0] - 12 && p.my > a[1] + 13 && p.my < b[1] - 13) xs.add(a[0]);
      }
    }
    let group;
    for (const x of [...xs].sort((a, b) => a - b)) {
      if (group && x - group.right < 22) group.right = x;
      else { group = { id: c.id, left: x, right: x, y: p.my }; crossings.push(group); }
    }
  }
  crossingCache.set(layout, crossings);
  return crossings;
}

function drawCrossings(out, layout, stage, model) {
  for (const cross of pipeCrossings(layout, stage)) {
    const { id, left, right, y } = cross;
    const c = stage.candidates.find(c => c.id === id), on = model.connected.has(id);
    const w = WIDTH[Number(model.thinness(c))] ?? 6.5;
    const color = [215,183,131].map((v, i) => Math.round(v + ([172,128,88][i] - v) * Math.min(1, (y - GROUND) / (VIEW_H - GROUND))));
    const d = `M${left - 10} ${y} Q${left - 6} ${y} ${left - 5} ${y - 5} Q${(left + right) / 2} ${y - 12} ${right + 5} ${y - 5} Q${right + 6} ${y} ${right + 10} ${y}`;
    const wet = on && model.phase !== 'edit' && model.view?.result.pipes[id]?.wet && !model.view?.broken?.has(id);
    out.push(`<g class="pipe-bridge" data-pipe-bridge="${id}"><rect x="${left - 10}" y="${y - 14}" width="${right - left + 20}" height="${w / 2 + 17}" fill="rgb(${color})" pointer-events="none"/><rect x="${left - 10}" y="${y - 14}" width="${right - left + 20}" height="${w / 2 + 17}" fill="url(#pebbles)" pointer-events="none"/><path d="${d}" fill="none" stroke="${on ? 'var(--blue)' : 'var(--pipe-off)'}" stroke-width="${w + 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${wet ? 'var(--water-mid)' : on && model.phase === 'edit' ? 'var(--pipe-on)' : '#fff'}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="transparent" stroke-width="20"/></g>`);
  }
}

const THICK_LABEL = { 1: '太', 2: '中', 3: '細' };

const outletLabelCache = new WeakMap();
export function outletLabelPositions(layout, stage) {
  if (outletLabelCache.has(layout)) return outletLabelCache.get(layout);
  const routes = stage.candidates.map(c => pipePath(layout, c));
  const placed = new Map();
  for (const o of stage.outlets) {
    const node = layout.nodes.get(o.tower);
    // 発案者の図：器の左上の空きへ丸いサイズ表示を逃がす。
    const preferred = node.cx - 34;
    const y = layout.yOf(Number(o.height)) - 82;
    // 大きくした2段の札も、隣の器の名札を覆わない近い空きへ置く。
    // 左端の共通の物差し（0〜22）を丸い札で隠さない。
    const choices = [preferred, ...Array.from({ length: 154 }, (_, i) => 40 + i * 2)].filter(x => x >= 40 && x <= VIEW_W - 14);
    const score = x => {
      let n = Math.abs(x - preferred) * .03;
      for (const tower of layout.nodes.values()) {
        if (y >= layout.towerTop - 14 && y <= GROUND + 14) n += Math.max(0, tower.w / 2 + 15 - Math.abs(x - tower.cx)) * 10;
      }
      for (const wall of stage.walls ?? []) {
        if (y >= layout.yOf(Number(wall.height)) - 9 && y <= GROUND + 9) n += Math.max(0, 18 - Math.abs(x - (18 + wall.x * 32.4))) * 10;
      }
      // 高さの違う隣の器の名札も避ける。
      for (const other of stage.outlets) {
        const otherX = basinPlacement(layout, other).cx;
        const dy = layout.yOf(Number(other.height)) - GROUND;
        if (Math.abs(y - (GROUND - 52 + dy)) < 17) n += Math.max(0, 40 - Math.abs(x - otherX)) * 30;
        if (Number(other.height) > 0 && Math.abs(y - (GROUND - 72 + dy)) < 16) n += Math.max(0, 29 - Math.abs(x - otherX)) * 30;
      }
      for (const p of routes) for (const [a, b] of [[p.pts[0], p.pts[1]], [p.pts[2], p.pts[3]]]) {
        if (y < Math.min(a[1], b[1]) - 9 || y > Math.max(a[1], b[1]) + 9) continue;
        n += Math.max(0, 18 - Math.abs(x - a[0])) * 10;
      }
      for (const p of placed.values()) if (Math.abs(p.y - y) < 30) n += Math.max(0, 30 - Math.hypot(x - p.x, y - p.y)) * 40;
      return n;
    };
    choices.sort((a, b) => score(a) - score(b));
    placed.set(o.id, { x: choices[0], y });
  }
  outletLabelCache.set(layout, placed);
  return placed;
}

function thicknessBadge(out, x, y, thin, { on = false, round = true, adjustable = false, id = '' } = {}) {
  out.push(`<g class="pipe-label" data-pipe-label="${esc(id)}" pointer-events="${id.startsWith('outlet-') ? 'none' : 'all'}" aria-label="配管${esc(id)} ${THICK_LABEL[thin]} 数字${thin}">`);
  out.push(`<rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="${round ? 14 : 5}" fill="${on ? '#1d56a0' : '#fffefa'}" stroke="#1d4f88" stroke-width="1.3" ${adjustable ? 'stroke-dasharray="2 1.5"' : ''}/>`);
  out.push(`<text x="${x}" y="${y - 2.5}" text-anchor="middle" font-size="11" font-weight="700" fill="${on ? '#ffffff' : '#173f70'}">${THICK_LABEL[thin] ?? thin}</text><text x="${x}" y="${y + 10}" text-anchor="middle" font-size="13" font-weight="700" fill="${on ? '#ffffff' : '#173f70'}">${thin}</text></g>`);
}

// ---- 盤面のバッジ（デザイン表 ui-badges A を図形で再現。2026-11-01 発案者が雰囲気 A を選択） ----
// 角の丸い四角に二重の縁、左に小さな印、右に文字。指定量は状態で色と右端の印が変わる
// （ふつう：白／ちょうど：青と✓／多い：朱と＋／足りない：灰と−）。図形なので、どの画面の大きさでもくっきり出る
const BADGE_TONE = {
  light: { fill: '#ffffff', edge: '#1d4f88', inner: 'rgba(29, 79, 136, .22)', ink: '#17314c', icon: '#1d4f88' },
  blue: { fill: '#1d56a0', edge: '#163f78', inner: 'rgba(255, 255, 255, .45)', ink: '#ffffff', icon: '#ffffff' },
  orange: { fill: '#dc5a2c', edge: '#b4421c', inner: 'rgba(255, 255, 255, .45)', ink: '#ffffff', icon: '#ffffff' },
  slate: { fill: '#4b5e77', edge: '#36475d', inner: 'rgba(255, 255, 255, .4)', ink: '#ffffff', icon: '#ffffff' },
  gold: { fill: '#ffe19c', edge: '#956e21', inner: '#fff6dc', ink: '#17314c', icon: '#1d4f88' }
};
// 印（中心 0,0、おおよそ 9×9）
const BADGE_ICON = {
  drop: c => `<path d="M0 -4.6 C2.4 -1.6 3.4 0.3 3.4 1.6 A3.4 3.4 0 0 1 -3.4 1.6 C-3.4 0.3 -2.4 -1.6 0 -4.6 Z" fill="${c}"/>`,
  target: c => `<circle r="3.6" fill="none" stroke="${c}" stroke-width="1.4"/><circle r="1.4" fill="${c}"/>`,
  gate: c => `<rect x="-4" y="-4" width="1.6" height="8" fill="${c}"/><rect x="2.4" y="-4" width="1.6" height="8" fill="${c}"/><path d="M-2.4 -1.6 H2.4 M-2.4 1.6 H2.4" stroke="${c}" stroke-width="1.1"/>`,
  mouth: c => `<rect x="-3.8" y="-3.8" width="7.6" height="7.6" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><rect x="-2.2" y="-2.2" width="4.4" height="2.6" fill="${c}"/>`,
  pipe: (c, t = 1) => { const h = { 1: 3.4, 2: 2.2, 3: 1.2 }[t] ?? 2.2; return `<rect x="-3.4" y="${-h / 2}" width="6.8" height="${h}" fill="${c}"/><rect x="-4.6" y="-2.6" width="1.6" height="5.2" rx=".4" fill="${c}"/><rect x="3" y="-2.6" width="1.6" height="5.2" rx=".4" fill="${c}"/>`; },
  cup: c => `<path d="M-3.4 -3.8 H3.4 L2.5 3.8 H-2.5 Z" fill="none" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>`
};
const BADGE_MARK = {
  check: '<path d="M-2.6 0.2 L-0.7 2.1 L2.8 -2.2" fill="none" stroke="#f2c14e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  plus: '<path d="M-2.4 0 H2.4 M0 -2.4 V2.4" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>',
  minus: '<path d="M-2.4 0 H2.4" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>'
};
const textWidth = (text, size) => [...String(text)].reduce((n, ch) => n + (/[\x20-\x7e]/.test(ch) ? size * 0.6 : size * 1.02), 0);
// x：align が 'middle' なら中心、'start' なら左端。戻り値は幅
function badge(out, { x, y, text, icon, iconArg, tone = 'light', mark = null, align = 'middle', size = 9.5, dashed = false, h = 15 }) {
  const t = BADGE_TONE[tone];
  const iconW = icon ? 12 : 0;
  const markW = mark ? 13 : 0;
  const w = Math.round(6 + iconW + textWidth(text, size) + 6 + markW);
  // 盤面の端で切れないよう、内側に収める
  const x0 = Math.min(VIEW_W - w - 2, Math.max(2, align === 'start' ? x : x - w / 2));
  const y0 = y - h / 2;
  out.push(`<g class="board-badge" pointer-events="none">`);
  out.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="3.5" fill="${t.fill}" stroke="${t.edge}" stroke-width="1.2" ${dashed ? 'stroke-dasharray="2.5 1.8"' : ''}/>`);
  out.push(`<rect x="${x0 + 1.6}" y="${y0 + 1.6}" width="${w - 3.2}" height="${h - 3.2}" rx="2.2" fill="none" stroke="${t.inner}" stroke-width=".8"/>`);
  if (icon) out.push(`<g transform="translate(${x0 + 9} ${y})">${BADGE_ICON[icon](t.icon, iconArg)}</g>`);
  out.push(`<text x="${x0 + 6 + iconW + textWidth(text, size) / 2}" y="${y + size * 0.36}" font-size="${size}" font-weight="700" fill="${t.ink}" text-anchor="middle" class="board-badge-text">${text}</text>`);
  if (mark) {
    const mx = x0 + w - markW;
    out.push(`<line x1="${mx}" y1="${y0 + 3}" x2="${mx}" y2="${y0 + h - 3}" stroke="${t.inner}" stroke-width=".9"/><g transform="translate(${mx + markW / 2} ${y})">${BADGE_MARK[mark]}</g>`);
  }
  out.push('</g>');
  return w;
}
const VERDICT_BADGE = { exact: ['blue', 'check'], over: ['orange', 'plus'], short: ['slate', 'minus'] };

// 採用した絵（docs/assets.md。2026-11-01 発案者が全体の雰囲気 A「白い陶器」を選択）。
// 候補から scripts/prepare-art.py で配信用の大きさに変換したもの。model.art === false のときは図形の仮の絵（テスト用）
const ART_BASE = new URL('../../public/graphics/', import.meta.url).href;
const art = file => `${ART_BASE}${file}`;
const ADOPTED = Object.freeze({ bg: true, spring: true, glass: true, basin: true, fountain: true });
// 縦に伸ばす3分割の部品：上と下は幅に合わせて縮め、中は高さいっぱいに伸ばす（中は縦にむらのない絵）
function sliced(out, dir, x, y, w, h, srcW, topH, bottomH) {
  const k = w / srcW;
  const t = topH * k, b = bottomH * k;
  out.push(`<image href="${art(`${dir}-middle.png`)}" x="${x}" y="${y + t - 0.5}" width="${w}" height="${Math.max(0, h - t - b + 1)}" preserveAspectRatio="none"/>`);
  out.push(`<image href="${art(`${dir}-top.png`)}" x="${x}" y="${y}" width="${w}" height="${t}" preserveAspectRatio="none"/>`);
  out.push(`<image href="${art(`${dir}-bottom.png`)}" x="${x}" y="${y + h - b}" width="${w}" height="${b}" preserveAspectRatio="none"/>`);
}

// 1本の配管を描く。サイフォンの未開通は山に空気（泡）がたまった様子で示す（要件5.2、screens.md 2章）
function drawPipe(out, layout, c, model) {
  const { connected, phase, view, primed, selected } = model;
  const { d, reversed, mx, my, gx = mx } = pipePath(layout, c);
  const on = connected.has(c.id);
  const thin = Number(model.thinness(c));
  const w = WIDTH[thin] ?? 5;
  const flowInfo = phase !== 'edit' ? view?.result.pipes[c.id] : null;
  const broken = phase !== 'edit' && view?.broken?.has(c.id);
  const isPrimed = c.siphon && primed.has(c.id);
  const filled = on && ((phase !== 'edit' && flowInfo?.wet) || (phase === 'edit' && isPrimed));
  // 土にも空にも埋もれない青と白の二重の光。管そのものと札は上に描く。
  if (model.guide === `pipe:${c.id}`) {
    const glow = guideGlowOpacity(model.time, model.reducedMotion).toFixed(3);
    out.push(`<g class="guide-pipe" pointer-events="none"><path class="guide-bloom" d="${d}" fill="none" stroke="#2bbaff" stroke-width="${w + 24}" opacity="${glow}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#0875cb" stroke-width="${w + 12}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  }
  out.push(`<g class="pipe${on ? ' on' : ''}" data-pipe="${c.id}">`);
  if (on) {
    if (selected === c.id) out.push(`<path d="${d}" fill="none" stroke="var(--gold)" stroke-width="${w + 10}" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>`);
    // つないだ管は、編集中は青いふちと淡い青の中身で、候補（灰色の点線）とはっきり分ける
    const edge = phase === 'edit' ? 'var(--blue)' : 'var(--pipe-edge)';
    const core = filled && !broken ? 'var(--water-mid)' : phase === 'edit' ? 'var(--pipe-on)' : 'var(--pipe-empty)';
    out.push(`<path d="${d}" fill="none" stroke="${edge}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${core}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
    // 白い陶器の管のつや（見本 A）。中身の上に細い白い線を重ねる。水が流れているときは流れの点を見せるため重ねない
    if (!(filled && !broken)) out.push(`<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${Math.max(1, w * 0.28)}" stroke-linecap="round" stroke-linejoin="round" opacity=".85" transform="translate(0 ${-w * 0.18})"/>`);
    if (filled && !broken && flowInfo && !flowInfo.flow.isZero()) {
      const speed = Math.max(0.6, 3.2 / Math.min(6, Math.abs(flowInfo.flow.toNumber())));
      const forward = (flowInfo.flow.sign() > 0) !== reversed;
      // 流れの白い点。盤面は毎フレーム描き直すので、CSSのアニメーションだと毎回最初に戻って動かない（スマホで起きる）。
      // 時刻から位置を計算する。点の間隔13を speed 秒で進む
      const shift = model.reducedMotion ? 0 : ((model.time / 1000 / speed) * 26) % 26;
      out.push(`<path d="${d}" fill="none" class="current" stroke-width="${Math.max(2, w - 4)}" stroke-dashoffset="${(forward ? -shift : shift).toFixed(2)}"/>`);
    }
    if (c.siphon && (!isPrimed || broken)) {
      for (const dx of [-8, 0, 8]) out.push(`<circle cx="${mx + dx}" cy="${my}" r="${Math.max(2, w / 2 - 1)}" fill="#ffffff" stroke="var(--pipe-edge)" stroke-width="1"/>`);
    }
  } else {
    // 候補も本当の太さで描く（点線のふち＋淡い中身）。つなぐ前から太さの違いが見える
    out.push(`<path d="${d}" fill="none" stroke="var(--pipe-off)" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 5" opacity=".7"/>`);
    out.push(`<path d="${d}" fill="none" stroke="var(--card)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`);
    out.push(`<path d="${d}" fill="none" stroke="#e3ebf3" stroke-width="${Math.max(1, w * 0.3)}" stroke-linecap="round" stroke-linejoin="round" opacity=".9" transform="translate(0 ${w * 0.2})"/>`);
  }
  if (phase === 'edit') out.push(`<path d="${d}" fill="none" stroke="transparent" stroke-width="20" class="hit" data-pipe="${c.id}"/>`);
  out.push(`</g>`);
}

// 管を全部描いたあとで札を描く。後から描いた管で札が隠れることを防ぐ。
function drawPipeLabel(out, layout, c, model, position) {
  const on = model.connected.has(c.id), thin = Number(model.thinness(c));
  const { my, gx = pipePath(layout, c).mx } = pipePath(layout, c);
  const { phase } = model;
  if (on || phase === 'edit') {
    const { x, y } = position;
    if (model.guide === `pipe:${c.id}`) {
      const glow = guideGlowOpacity(model.time, model.reducedMotion).toFixed(3);
      out.push(`<g class="guide-spark" opacity="${glow}" fill="#ffffff" stroke="#1a9ddd" stroke-width=".7" pointer-events="none">`);
      for (const [dx, dy] of [[-20,-18],[20,-18],[-20,18],[20,18]]) out.push(`<path d="M${x + dx} ${y + dy - 5} l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4Z"/>`);
      out.push(`</g><circle cx="${x}" cy="${y}" r="18" fill="#ffffff" stroke="#0875cb" stroke-width="2.5" pointer-events="none"/>`);
    }
    thicknessBadge(out, x, y, thin, { on, round: model.pipeBadge !== 'pill', adjustable: !on && Boolean(c.adjustable), id: c.id });
  }
  if (c.gate) {
    const closed = model.gateClosed;
    // 印は操作を受け取らない（下の配管のタップを邪魔しない）
    out.push(`<rect x="${gx - 5}" y="${my - 12}" width="10" height="24" rx="2" fill="${closed ? 'var(--ink)' : 'var(--card)'}" stroke="var(--ink)" stroke-width="1.5" pointer-events="none"/>`);
    badge(out, { x: gx, y: my - 19, text: closed ? '閉' : '水門', tone: closed ? 'slate' : 'blue', size: 8, h: 13 });
  }
}

// 水の色：少ないグラスは明るく、多いグラスは暗く（要件5.5）
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

// 噴水：中央の水柱と、左右へ落ちるしぶき。噴き上がり0.6秒、その後は高さを少しゆらしながら続ける
function drawFountain(out, cx, top, since, still) {
  const rise = still ? 1 : Math.min(1, since / 600);
  const ease = 1 - (1 - rise) ** 2;
  const sway = still ? 0 : Math.sin(since / 170) * 1.6;
  const peak = top - 4 - (54 + sway) * ease;
  const base = top + 6;
  out.push(`<path class="fountain-core" d="M${cx} ${base} L${cx} ${peak}" stroke="#216ea8" stroke-width="4.5" stroke-linecap="round" opacity=".95"/>`);
  out.push(`<path d="M${cx} ${base} L${cx} ${peak + 2}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`);
  if (ease < 0.6) return;
  const spread = 19 * ease;
  for (const dir of [-1, 1]) {
    out.push(`<path d="M${cx} ${peak + 1} Q${cx + dir * spread * 0.7} ${peak - 6} ${cx + dir * spread} ${top + 2}" fill="none" stroke="#287fb5" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>`);
    out.push(`<path d="M${cx} ${peak + 1} Q${cx + dir * spread * 0.7} ${peak - 6} ${cx + dir * spread} ${top + 2}" fill="none" stroke="#dff6ff" stroke-width=".8" stroke-linecap="round"/>`);
    // しぶきの粒：上から盤の縁へ落ちていく
    for (let i = 0; i < 3; i++) {
      const p = still ? (i + 0.5) / 3 : ((since / 900) + i / 3) % 1;
      const x = cx + dir * spread * p;
      const y = (1 - p) ** 2 * (peak + 1) + 2 * (1 - p) * p * (peak - 6) + p * p * (top + 2);
      out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="var(--water-mid)" opacity="${(0.85 - p * 0.4).toFixed(2)}"/>`);
    }
  }
}

function drawRainbow(out, cx, top, opacity) {
  // 明るい空でも色が消えない7本の帯。右端の器でも円弧を盤内に収める。
  const x = Math.max(39, Math.min(VIEW_W - 39, cx));
  const base = top - 30;
  out.push(`<g class="rainbow" opacity="${opacity.toFixed(3)}" fill="none" stroke-width="2.6">`);
  ['#df565e', '#ed9941', '#ead152', '#66ad75', '#4fa9c6', '#4c78bd', '#9569b1'].forEach((color, i) => {
    const r = 36 - i * 2.6;
    out.push(`<path d="M${x - r} ${base} A${r} ${r} 0 0 1 ${x + r} ${base}" stroke="${color}"/>`);
  });
  out.push('</g>');
}

function basinShape(cx) {
  const top = GROUND - 34;
  return {
    top, left: cx - 29, right: cx + 29,
    bowl: `M${cx - 31} ${top} L${cx + 31} ${top} L${cx + 22} ${GROUND - 4} Q${cx} ${GROUND + 3} ${cx - 22} ${GROUND - 4} Z`
  };
}

export function basinPlacement(layout, outlet) {
  const node = layout.nodes.get(outlet.tower);
  // 全30面共通の固定サイズ。左12px（グラス幅の約1/3）を底まで見せる。
  const cx = node.cx + 26;
  return { cx, width: 62, left: cx - 31, right: cx + 31 };
}

// スマホでは、部品のない上空だけを表示範囲から外す。座標・配管の道筋は変えない。
// 実行前から噴水・虹・札の場所も含め、途中で倍率が変わらないようにする。
const compactViewCache = new WeakMap();
export function boardViewBox(layout, stage, compact = false) {
  if (!compact) return `0 0 ${VIEW_W} ${VIEW_H}`;
  if (!compactViewCache.has(layout)) {
    const tops = [layout.towerTop - 12, layout.yOf(layout.H) - 42];
    for (const wall of stage.walls ?? []) tops.push(layout.yOf(Number(wall.height)) - 12);
    for (const c of stage.candidates.filter(c => c.siphon)) tops.push(pipePath(layout, c).my - 32);
    for (const o of stage.outlets) tops.push(layout.yOf(Number(o.height)) - 34 - 90);
    const top = Math.max(0, Math.floor(Math.min(...tops)));
    compactViewCache.set(layout, `0 ${top} ${VIEW_W} ${VIEW_H - top}`);
  }
  return compactViewCache.get(layout);
}

// model: { stage, layout, connected:Set, primed:Set, thinness(c), selected, phase, levels:Map(id→number|null),
//          settled, view:{result, outlets, broken}（今見せている状態の計算結果）, gateClosed,
//          prevLevels:Map, time, reducedMotion, highlight:{id, until} }
export function renderBoard(svg, model) {
  const { stage, layout, phase, levels, settled, prevLevels, time, reducedMotion } = model;
  const pick = model.art === false ? {} : ADOPTED;
  const evaluation = model.view;
  const { H, unit, towerTop } = layout;
  const out = [];
  out.push(`<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky-top)"/><stop offset="1" stop-color="var(--sky-bottom)"/></linearGradient>
    <linearGradient id="glassfill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity=".7"/></linearGradient>
    <linearGradient id="porcelain" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#ffffff"/><stop offset=".5" stop-color="#fffefa"/><stop offset="1" stop-color="#d6dfe7"/></linearGradient>
    <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d7b783"/><stop offset="1" stop-color="#ac8058"/></linearGradient>
    <pattern id="pebbles" width="73" height="47" patternUnits="userSpaceOnUse"><path d="M0 10 Q18 4 38 11 T73 9 M0 39 Q22 33 45 39 T73 36" fill="none" stroke="#916d4c" stroke-width=".6" opacity=".3"/><path d="M9 20 l3 -2 4 1 1 3 -5 1 Z M49 7 l4 -1 2 3 -4 1 Z M34 37 l3 -2 5 2 -1 3 -5 0 Z" fill="#ead3aa" stroke="#9e7b55" stroke-width=".6"/><circle cx="24" cy="8" r=".8" fill="#886447"/><circle cx="65" cy="29" r="1" fill="#886447"/><circle cx="15" cy="40" r=".6" fill="#fff0d2"/></pattern>
  </defs>`);
  out.push(`<rect x="0" y="0" width="${VIEW_W}" height="${GROUND}" fill="url(#sky)"/>`);
  if (pick.bg) {
    out.push(`<image href="${art('bg-trial.webp')}" x="0" y="0" width="${VIEW_W}" height="${GROUND}" preserveAspectRatio="xMidYMax slice"/>`);
  }
  out.push(`<rect x="0" y="${GROUND}" width="${VIEW_W}" height="${VIEW_H - GROUND}" fill="url(#soil)"/>`);
  out.push(`<path d="M0 370 H360 V390 Q300 384 245 391 T120 389 T0 392 Z" fill="#e3c998"/>`);
  out.push(`<path d="M0 420 Q55 412 120 422 T240 419 T360 425 V470 H0 Z" fill="#af845d" opacity=".3"/>`);
  out.push(`<rect x="0" y="${GROUND}" width="${VIEW_W}" height="100" fill="url(#pebbles)"/>`);
  out.push(`<path d="M0 370 Q8 368 16 370 T48 370 T80 370 T112 370 T144 370 T176 370 T208 370 T240 370 T272 370 T304 370 T336 370 T368 370" stroke="#987448" stroke-width="2" fill="none"/>`);

  // 壁（サイフォンが越える）
  for (const wall of stage.walls ?? []) {
    const x = 18 + wall.x * 32.4;
    const y = layout.yOf(Number(wall.height));
    out.push(`<rect x="${x - 8}" y="${y}" width="16" height="${GROUND - y}" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
    for (let yy = y + 14; yy < GROUND; yy += 14) out.push(`<line x1="${x - 8}" y1="${yy}" x2="${x + 8}" y2="${yy}" stroke="var(--stone-edge)" stroke-width="1"/>`);
  }

  // 地面の下を通る配管（サイフォンはグラスの後に描いて、グラスの中の入口が見えるようにする）
  for (const c of stage.candidates.filter(c => !c.siphon)) drawPipe(out, layout, c, model);
  drawCrossings(out, layout, stage, model);

  // 泉
  const spring = layout.nodes.get(stage.spring.id);
  const sx0 = spring.cx - spring.w / 2;
  const sy = layout.yOf(H);
  // 絵の部品は、明るい背景に溶け込まないよう、部品の周りだけに青い陰影を置き、縁を濃い青で縁取る（バインディング）。
  // 前作は暗い背景に淡い陰影と明るい縁取りで分けていた。本作は明るい背景なので、その逆（2026-11-01 発案者）。
  // 仕上がりは採用する絵に合わせて決める。それまでは目立たない控えめな値にしておく（強すぎると「あからさま」になる）
  if (pick.spring) out.push(`<rect x="${sx0 - 9}" y="${sy - 11}" width="${spring.w + 18}" height="${GROUND - sy + 11}" rx="8" fill="none" stroke="rgba(29, 79, 136, .1)" stroke-width="4"/>`);
  if (!pick.spring) out.push(`<rect x="${sx0 - 4}" y="${sy - 10}" width="${spring.w + 8}" height="${GROUND - sy + 10}" rx="5" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
  out.push(`<rect x="${sx0}" y="${sy}" width="${spring.w}" height="${GROUND - sy}" fill="${waterColor(H, H)}"/>`);
  out.push(`<path d="${surfacePath(sx0, sx0 + spring.w, sy, reducedMotion ? 0 : 0.8, time / 420)}" stroke="var(--surface)" stroke-width="2" fill="none"/>`);
  if (pick.spring) {
    sliced(out, 'part-spring', sx0 - 8, sy - 12, spring.w + 16, GROUND - sy + 12, 120, 24, 20);
    out.push(`<rect x="${sx0 - 7}" y="${sy - 11}" width="${spring.w + 14}" height="${GROUND - sy + 11}" rx="6" fill="none" stroke="var(--blue-deep)" stroke-width="1" opacity=".4"/>`);
  }
  // 給水塔：水の高さが見える縦長の設備。自然の泉という呼び名は使わない。
  out.push(`<rect x="${sx0 - 7}" y="${GROUND - 5}" width="${spring.w + 14}" height="6" rx="2" fill="url(#porcelain)" stroke="#627e9b" stroke-width="1"/>`);
  out.push(`<g class="source-height" aria-label="給水塔の高さ${esc(stage.spring.height)}">`);
  badge(out, { x: spring.cx, y: sy - 32, text: '給水塔', tone: 'blue' });
  badge(out, { x: spring.cx, y: sy - 15, text: `高さ${stage.spring.height}`, size: 9, h: 14 });
  out.push('</g>');
  // 給水塔の目盛りも、グラスと共通の高さ1ずつ。青い水の上で読める白い刻み。
  for (let k = 1; k <= H; k++) {
    const y = layout.yOf(k);
    out.push(`<line class="spring-tick" data-height-level="${k}" x1="${sx0 + spring.w - 7}" y1="${y}" x2="${sx0 + spring.w - 1}" y2="${y}" stroke="#ffffff" stroke-width="1.5"/>`);
  }

  // グラス
  for (const t of stage.towers) {
    const node = layout.nodes.get(t.id);
    const x0 = node.cx - TOWER_W / 2;
    const x1 = node.cx + TOWER_W / 2;
    const level = levels.get(t.id);
    const finalT = evaluation?.result.towers[t.id];
    const onTick = settled && finalT?.state === 'water' && model.onScale(finalT.level);
    // グラスの光（ぼかしのフィルターは処理が重いので、太い半透明の線を重ねて表す）
    if (onTick) {
      out.push(`<rect x="${x0 - 5}" y="${towerTop - 5}" width="${TOWER_W + 10}" height="${GROUND - towerTop + 5}" rx="10" fill="none" stroke="var(--gold)" stroke-width="8" opacity=".22"/>`);
      out.push(`<rect x="${x0 - 2}" y="${towerTop - 2}" width="${TOWER_W + 4}" height="${GROUND - towerTop + 2}" rx="7" fill="none" stroke="var(--gold)" stroke-width="3" opacity=".75"/>`);
    }
    if (!pick.glass) out.push(`<rect x="${x0}" y="${towerTop}" width="${TOWER_W}" height="${GROUND - towerTop}" rx="6" fill="url(#glassfill)"/>`);
    else out.push(`<rect x="${x0 - 4}" y="${towerTop - 3}" width="${TOWER_W + 8}" height="${GROUND - towerTop + 3}" rx="8" fill="rgba(29, 79, 136, .04)" stroke="rgba(29, 79, 136, .1)" stroke-width="4"/>`);
    if (level !== null && level !== undefined && level * unit > 1.5) {
      const y = layout.yOf(level);
      out.push(`<rect x="${x0 + 2}" y="${y}" width="${TOWER_W - 4}" height="${(GROUND - y - 1).toFixed(2)}" rx="3" fill="${waterColor(level, H)}" opacity=".92"/>`);
      const dist = settled && finalT?.state === 'water' ? model.tickDistance(finalT.level) : 0;
      const amp = reducedMotion ? 0 : dist * 6;
      out.push(`<path d="${surfacePath(x0 + 2, x1 - 2, y, amp, time / 260 + node.cx)}" stroke="var(--surface)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    }
    if (pick.glass) {
      sliced(out, 'part-glass', x0 - 3, towerTop - 4, TOWER_W + 6, GROUND - towerTop + 4, 68, 24, 20);
      out.push(`<rect x="${x0 - 1.5}" y="${towerTop - 2}" width="${TOWER_W + 3}" height="${GROUND - towerTop + 2}" rx="6" fill="none" stroke="var(--blue-deep)" stroke-width="1" opacity=".4"/>`);
    }
    // 目盛り（音名は出さない）
    for (let k = 1; k <= H; k++) {
      const y = layout.yOf(k);
      out.push(`<line class="glass-tick" data-height-level="${k}" x1="${x0 - 5}" y1="${y}" x2="${x0 + 5}" y2="${y}" stroke="var(--tick)" stroke-width="1.4"/>`);
    }
    // 前回の水面の線（編集中だけ）
    const prev = prevLevels?.get(t.id);
    if (phase === 'edit' && prev !== null && prev !== undefined) {
      const y = layout.yOf(prev);
      out.push(`<line x1="${x0 + 3}" y1="${y}" x2="${x1 - 3}" y2="${y}" stroke="var(--prev)" stroke-width="1.6" stroke-dasharray="3 3"/>`);
    }
    const lit = model.highlight && model.highlight.id === t.id && model.highlight.until > time;
    if (!pick.glass || lit) out.push(`<rect x="${x0}" y="${towerTop}" width="${TOWER_W}" height="${GROUND - towerTop}" rx="6" fill="none" stroke="${lit ? 'var(--gold)' : 'var(--glass-edge)'}" stroke-width="${lit ? 3 : 1.8}"/>`);
    if (!pick.glass) out.push(`<rect x="${x0 + 5}" y="${towerTop + 6}" width="3" height="${GROUND - towerTop - 14}" rx="1.5" fill="#ffffff" opacity=".7"/>`);
    if (settled && finalT?.state === 'empty') {
      badge(out, { x: node.cx, y: GROUND - 14, text: '空', icon: 'cup', tone: 'blue' });
    }
  }

  // サイフォン（グラスの中の入口から、壁の上を越える）
  for (const c of stage.candidates.filter(c => c.siphon)) drawPipe(out, layout, c, model);

  // 出口の噴水盤
  for (const o of stage.outlets) {
    const node = layout.nodes.get(o.tower);
    // 器を接続元のグラスの前面へ重ねる。管の位置はこの器の配置から独立させる。
    const vessel = basinPlacement(layout, o);
    const cx = vessel.cx;
    const b = basinShape(cx);
    const verdict = settled ? evaluation?.outlets.find(v => v.id === o.id) : null;
    const flowing = phase !== 'edit' && evaluation?.result.outlets[o.id]?.active && !evaluation.result.outlets[o.id].flow.isZero();
    // 口の高さが0より上の出口は、口と噴水盤をその高さへ持ち上げ、台の上に置く
    const dy = layout.yOf(Number(o.height)) - GROUND;
    if (dy < 0 && pick.basin) {
      // 台座の絵：上（224×96 を半分にしたもの）と、縦に伸ばす中
      const pw = 30, topH = pw * 48 / 112;
      const top = GROUND - 4 + dy;
      out.push(`<g class="pedestal"><ellipse cx="${cx}" cy="${GROUND + 2}" rx="20" ry="3" fill="#70583e" opacity=".22"/><path class="pedestal-body" d="M${cx - 15} ${top} H${cx + 15} V${top + 7} L${cx + 11} ${top + 11} V${GROUND - 5} H${cx - 11} V${top + 11} L${cx - 15} ${top + 7}Z" fill="#fffefa" stroke="#537594" stroke-width="1.2"/><path d="M${cx + 4} ${top + 10} H${cx + 11} V${GROUND - 5} H${cx + 4}Z" fill="#d2e1ed"/>`);
      out.push(`<image href="${art('part-pedestal-middle.png')}" x="${cx - pw / 2}" y="${GROUND - 4 + dy + topH - 0.5}" width="${pw}" height="${Math.max(0, 4 - dy - topH + 0.5)}" preserveAspectRatio="none"/>`);
      out.push(`<image href="${art('part-pedestal-top.png')}" x="${cx - pw / 2}" y="${GROUND - 4 + dy}" width="${pw}" height="${topH}" preserveAspectRatio="none"/>`);
      out.push(`<path d="M${cx - 15} ${top} H${cx + 15} V${top + 7} L${cx + 11} ${top + 11} V${GROUND - 5} H${cx - 11} V${top + 11} L${cx - 15} ${top + 7}Z" fill="none" stroke="#537594" stroke-width="1.1"/><rect class="pedestal-foot" x="${cx - 17}" y="${GROUND - 6}" width="34" height="7" rx="1.5" fill="#fffefa" stroke="#537594" stroke-width="1.2"/></g>`);
    } else if (dy < 0) out.push(`<rect x="${cx - 14}" y="${GROUND - 4 + dy}" width="28" height="${4 - dy}" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
    out.push(`<g class="basin" transform="translate(0 ${dy})">`);
    // 出口の高さを維持し、グラス前面から器へ伸びる管として描く。
    const outletPipeX = node.cx + TOWER_W / 2 + 18;
    const outletPipe = `M${node.cx} ${GROUND - 9} H${outletPipeX} V${GROUND - 20}`;
    out.push(`<path class="outlet-pipe" data-outlet-source="${esc(o.tower)}" d="${outletPipe}" fill="none" stroke="#7b92a5" stroke-width="5" stroke-linejoin="round"/>`);
    // 出口も通常の管と同じ「太・中・細」で示す。
    const mouth = 1 / Number(o.conductance ?? 1);
    out.push('<g class="basin-vessel">');
    out.push(`<path class="bowl" d="${b.bowl}" fill="${pick.basin ? 'none' : 'var(--stone)'}" stroke="${pick.basin ? 'none' : 'var(--stone-edge)'}" stroke-width="1.5"/>`);
    if (pick.basin) out.push(`<ellipse cx="${cx}" cy="${GROUND - 1}" rx="31" ry="4" fill="rgba(29, 79, 136, .15)"/>`);
    // 白い陶器の枠＋ガラスの内器。窓以外の縁・脚・底は不透明な白。
    const windowTop = b.top + 8, windowBottom = GROUND - 7;
    const windowPaths = [`M${cx - 22} ${windowTop} H${cx + 22} L${cx + 17} ${windowBottom} Q${cx} ${windowBottom + 2} ${cx - 17} ${windowBottom} Z`];
    const windows = windowPaths.map(d => `<path d="${d}"/>`).join('');
    out.push(`<path class="porcelain-body" d="${b.bowl} ${windowPaths.join(' ')}" fill-rule="evenodd" fill="url(#porcelain)" stroke="#527492" stroke-width="1.2"/>`);
    out.push(`<ellipse cx="${cx}" cy="${b.top}" rx="31" ry="4.5" fill="#fffefa" stroke="#527492" stroke-width="1.2"/><ellipse cx="${cx}" cy="${b.top - .2}" rx="27.5" ry="2.7" fill="#f5f0e4" stroke="#d3b879" stroke-width=".7"/>`);
    out.push(`<g class="ceramic-windows" fill="#f9f7ef" stroke="#8ca4b5" stroke-width=".55">${windows}</g>`);
    const clipId = `${svg.id ? `${svg.id}-` : ''}clip-${o.id}`;
    out.push(`<clipPath id="${clipId}">${windows}</clipPath>`);
    // ガラス越しの奥の陶器。背面の目盛りは上へ浅く湾曲させ、手前より薄くする。
    out.push(`<g class="rear-gauge" clip-path="url(#${clipId})" fill="none">`);
    for (const fraction of [.25, .5, .8]) {
      const y = windowBottom - (windowBottom - windowTop) * fraction;
      const r = 21 - (y - windowTop) * .25;
      out.push(`<path d="M${cx - r} ${y} Q${cx} ${y - 5} ${cx + r} ${y}" stroke="${fraction === .8 ? '#ac883c' : '#7f909b'}" stroke-width="${fraction === .8 ? '.85' : '.55'}" opacity="${fraction === .8 ? '.65' : '.4'}"/>`);
    }
    out.push('</g>');
    // 届いた量が0なら水を描かない。必要量はゲージの80%位置、残り20%で多すぎる状態を示す。
    if (verdict && verdict.flow.sign() > 0) {
      const ratio = Math.min(1.25, verdict.flow.toNumber() / Math.max(verdict.target.toNumber(), 1e-9));
      const fillTop = windowBottom - (windowBottom - windowTop) * ratio / 1.25;
      out.push(`<g clip-path="url(#${clipId})"><rect class="amount-fill" x="${cx - 24}" y="${fillTop}" width="48" height="${windowBottom - fillTop + 1}" fill="#388ac7" opacity=".76"/><path d="M${cx - 24} ${fillTop} H${cx + 24}" stroke="#165785" stroke-width=".8"/></g>`);
      if (verdict.verdict === 'over') {
        out.push(`<path d="M${b.right + 1} ${b.top} q4 8 1 18 M${b.left - 1} ${b.top} q-4 8 -1 18" fill="none" stroke="var(--water-mid)" stroke-width="2.4" stroke-linecap="round"/>`);
      }
    }
    out.push(`<path class="glass-shine" d="M${cx - 19} ${windowTop + 2} l2 8 M${cx + 19} ${windowTop + 2} l-1 5" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".8"/>`);
    // 手前の陶器にも同じ高さの目盛り。円い器の外周に沿う短い弧にする。
    for (const fraction of [.25, .5, .8]) {
      const y = windowBottom - (windowBottom - windowTop) * fraction;
      const r = 28 - (y - windowTop) * .28;
      out.push(`<path class="${fraction === .8 ? 'amount-mark' : 'ceramic-tick'}" d="M${cx - r} ${y} q1.5 .7 3 .9 M${cx + r - 3} ${y + .9} q1.5 -.2 3 -.9" stroke="${fraction === .8 ? '#b28c3c' : '#9aa9b4'}" stroke-width="${fraction === .8 ? '1' : '.6'}" stroke-linecap="round" fill="none"/>`);
    }
    out.push('</g>');
    // 短い出口管は細めの固定幅。実際のサイズは引き出し先の丸バッジで示す。
    const horizontal = `M${node.cx} ${GROUND - 9} H${outletPipeX}`;
    out.push(`<g class="outlet-visible" fill="none" stroke-linecap="round" pointer-events="none"><path d="${horizontal}" stroke="#6f8aa5" stroke-width="6"/><path d="${horizontal}" stroke="${flowing ? '#4b9ad8' : '#edf2f7'}" stroke-width="3.6"/></g>`);
    // クリアの噴水と、100点の虹（2026-11-01 発案者）。ジングルの鳴り始めと同時に噴き上がり、
    // 100点のときは噴き上がった後に虹がかかる。NGでは噴かない。
    // 盤面は毎フレーム描き直すので、CSSのアニメーションではなく時刻から形と濃さを計算する
    if (verdict && model.fountainAt != null && model.outcome && model.outcome !== 'ng') {
      const since = model.time - model.fountainAt;
      if (since >= 0) {
        if (model.outcome === 'perfect') {
          const k = model.reducedMotion ? 1 : Math.max(0, Math.min(1, (since - RAINBOW_AFTER_MS) / RAINBOW_FADE_MS));
          if (model.reducedMotion ? since >= RAINBOW_AFTER_MS : k > 0) {
            const opacity = 1 - (1 - k) ** 3;
            drawRainbow(out, cx, b.top, opacity);
          }
        }
        drawFountain(out, cx, b.top, since, model.reducedMotion);
        if (pick.fountain) {
          // 6コマ。140ミリ秒ごとに進め、高く上がった後は4〜6コマ目を繰り返す（コマの速さは仮の値）
          const n = Math.floor(since / 140);
          const frame = model.reducedMotion ? 6 : n < 6 ? n + 1 : 4 + ((n - 6) % 3);
          out.push(`<image href="${art(`fx-fountain-0${frame}.png`)}" x="${cx - 30}" y="${b.top - 72}" width="60" height="80" opacity=".65"/>`);
        }
      }
    }
    // 量の札は器のすぐ上に少し離す（発案者の選択）。「必要量」は比較中の仮表記。
    const target = typeof o.target === 'object' ? (model.gateClosed ? o.target.closed : o.target.open) : o.target;
    const [vt, vm] = verdict ? VERDICT_BADGE[verdict.verdict] ?? ['light', null] : ['light', null];
    if (model.startCue > 0) {
      const w = 12 + textWidth(`必要量${target}`, 9);
      const left = Math.min(VIEW_W - w - 2, Math.max(2, cx - w / 2));
      out.push(`<rect class="start-cue" x="${left - 3}" y="${b.top - 29}" width="${w + 6}" height="22" rx="5" fill="#ffe19c" stroke="#a17b29" stroke-width="2.5" opacity="${model.startCue.toFixed(3)}" pointer-events="none"/>`);
    }
    badge(out, { x: cx, y: b.top - 18, text: `必要量${target}`, tone: model.startCue > .5 ? 'gold' : vt, mark: vm, size: 9, h: 16 });
    out.push('</g>');
    if (dy < 0) badge(out, { x: cx, y: b.top + dy - 38, text: `高さ${o.height}`, size: 8, h: 13 });
    // 短い出口の管は、引き出し線の先で太さを示す。「出口 太」の札は置かない。
    const { x: labelX, y: labelY } = outletLabelPositions(layout, stage).get(o.id);
    const sourceX = (node.cx + outletPipeX) / 2;
    const leftLabel = labelX < node.cx;
    out.push(`<path class="outlet-leader" d="M${sourceX} ${GROUND + dy - 9} L${labelX + (leftLabel ? 8 : -8)} ${labelY + 4}" fill="none" stroke="#1d4f88" stroke-width=".8" pointer-events="none"/><circle cx="${sourceX}" cy="${GROUND + dy - 9}" r="1.4" fill="#1d4f88" pointer-events="none"/>`);
    thicknessBadge(out, labelX, labelY, mouth, { id: `outlet-${o.id}` });
  }
  const labelPositions = pipeLabelPositions(layout, stage);
  for (const c of stage.candidates) drawPipeLabel(out, layout, c, model, labelPositions.get(c.id));
  // 左の既存の余白へ共通の物差し。グラスと給水塔に同じ yOf を使う。
  out.push(`<g class="height-ruler" aria-label="高さの物差し。地面が0、1目盛りは高さ1。" pointer-events="none"><rect x="1" y="${sy - 22}" width="21" height="${GROUND - sy + 30}" rx="3" fill="#ffffff" fill-opacity=".9" stroke="#b6cadb" stroke-width=".7"/><text x="11.5" y="${sy - 10}" text-anchor="middle" font-size="9" font-weight="700" fill="#173f70">高さ</text><path d="M19 ${sy} V${GROUND}" fill="none" stroke="#507c9f" stroke-width=".8"/>`);
  for (let k = 0; k <= H; k++) {
    const y = layout.yOf(k);
    out.push(`<g class="ruler-tick" data-height-level="${k}"><line x1="17" y1="${y}" x2="21" y2="${y}" stroke="#507c9f" stroke-width="1"/><text x="15" y="${y + 4}" text-anchor="end" font-size="12" font-weight="600" fill="#173f70">${k}</text></g>`);
  }
  out.push('</g>');
  drawGuide(out, stage, layout, model.guide);
  svg.innerHTML = out.join('');
}

// 練習面の案内。説明の札も含めて、背景から分かれる青と白の二重枠で囲む。
// guide：spring・tower・basin・badges・pipe:ID。枠は操作を受け取らない
function drawGuide(out, stage, layout, guide) {
  if (!guide) return;
  const ring = (x, y, w, h) => out.push(`<g class="guide-frame" pointer-events="none"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="guide-ring-back"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="guide-ring"/></g>`);
  if (guide === 'spring') {
    const s = layout.nodes.get(stage.spring.id);
    const sy = layout.yOf(layout.H);
    ring(s.cx - s.w / 2 - 10, sy - 42, s.w + 20, GROUND - sy + 48);
  } else if (guide === 'tower') {
    const n = layout.nodes.get(stage.towers[0].id);
    ring(n.cx - TOWER_W / 2 - 12, layout.towerTop - 8, TOWER_W + 24, GROUND - layout.towerTop + 14);
  } else if (guide === 'basin') {
    const o = stage.outlets[0];
    const vessel = basinPlacement(layout, o);
    const cx = vessel.cx;
    const dy = layout.yOf(Number(o.height)) - GROUND;
    // 必要量の札は器の上端−18、札の高さ16。札の上にも5px空ける。
    const top = basinShape(cx).top - 18 - 8 - 5 + dy;
    ring(cx - vessel.width / 2 - 5, top, vessel.width + 10, GROUND + 8 + dy - top);
    const label = outletLabelPositions(layout, stage).get(o.id);
    ring(label.x - 18, label.y - 18, 36, 36);
  } else if (guide === 'badges') {
    for (const c of stage.candidates) {
      const { x: mx, y: my } = pipeLabelPositions(layout, stage).get(c.id);
      ring(mx - 18, my - 18, 36, 36);
    }
  } // pipe:ID は管と札の下に描く。最後に重ねて管の中身を隠さない。
}

// 盤面上の点からグラスを探す（結果表示中のなぞりに使う）
export function towerAt(layout, stage, x, y) {
  if (y < layout.towerTop - 12 || y > GROUND + 4) return null;
  for (const t of stage.towers) {
    const node = layout.nodes.get(t.id);
    if (Math.abs(x - node.cx) <= TOWER_W / 2 + 6) return t.id;
  }
  return null;
}
