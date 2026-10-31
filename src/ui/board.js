// 断面の盤面（SVG）。真横から見た図で、画面の上下がそのまま高さ（screens.md 2章）。
// 計算は分数で済ませてあり、ここでは描画の直前に小数へ直すだけ。

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
  return { H, unit, nodes, towerTop, depthGap, yOf: level => GROUND - level * unit };
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WIDTH = { 1: 10, 2: 6.5, 3: 4 };

// 管の通り道：グラスの底から地面の下へ下り、横へ進んで、相手の底へ上がる。
// サイフォンはグラスの中の入口から上がり、壁の上の山を越えて、相手の入口へ下りる（logic-design 3章）
function pipePath(layout, c) {
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
  const shift = (c.depth - 2) * 7;
  const x1 = left.cx + shift + (left.kind === 'spring' ? 6 : 0);
  const x2 = right.cx - shift;
  const y = GROUND + 12 + c.depth * layout.depthGap;
  const d = `M${x1} ${GROUND - 2} L${x1} ${y - r} Q${x1} ${y} ${x1 + r} ${y} L${x2 - r} ${y} Q${x2} ${y} ${x2} ${y - r} L${x2} ${GROUND - 2}`;
  return { d, reversed, mx: (x1 + x2) / 2, my: y, gx: x1 + (x2 - x1) * 0.72, pts: [[x1, GROUND - 2], [x1, y], [x2, y], [x2, GROUND - 2]] };
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

const THICK_LABEL = { 1: '太', 2: '中', 3: '細' };

// 1本の水路を描く。サイフォンの未開通は山に空気（泡）がたまった様子で示す（要件5.2、screens.md 2章）
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
  out.push(`<g class="pipe${on ? ' on' : ''}" data-pipe="${c.id}">`);
  if (on) {
    if (selected === c.id) out.push(`<path d="${d}" fill="none" stroke="var(--gold)" stroke-width="${w + 10}" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>`);
    // つないだ管は、編集中は青いふちと淡い青の中身で、候補（灰色の点線）とはっきり分ける
    const edge = phase === 'edit' ? 'var(--blue)' : 'var(--pipe-edge)';
    const core = filled && !broken ? 'var(--water-mid)' : phase === 'edit' ? 'var(--pipe-on)' : 'var(--pipe-empty)';
    out.push(`<path d="${d}" fill="none" stroke="${edge}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${core}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
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
  }
  // 太さの札。つないだ管は青地に白文字（つないだ後も太さが分かる）、候補は白地に灰色の点線。
  // 太さを選べる候補は「細〜太」、つないだ後は選んだ太さ
  if (on || phase === 'edit') {
    const text = !on && c.adjustable ? `${THICK_LABEL[Math.max(...c.adjustable.map(Number))]}〜${THICK_LABEL[Math.min(...c.adjustable.map(Number))]}` : THICK_LABEL[thin];
    const bw = text.length * 11 + 8;
    const box = on
      ? `fill="var(--blue)" stroke="var(--card)" stroke-width="1.5"`
      : `fill="var(--card)" stroke="var(--pipe-off)" stroke-width="1" ${c.adjustable ? 'stroke-dasharray="3 2"' : ''}`;
    out.push(`<rect x="${mx - bw / 2}" y="${my - 9}" width="${bw}" height="18" rx="9" ${box} pointer-events="none"/><text x="${mx}" y="${my + 4}" class="badge-text${on ? ' on' : ' cand'}" text-anchor="middle">${text}</text>`);
  }
  if (c.gate) {
    const closed = model.gateClosed;
    // 印は操作を受け取らない（下の水路のタップを邪魔しない）
    out.push(`<rect x="${gx - 5}" y="${my - 12}" width="10" height="24" rx="2" fill="${closed ? 'var(--ink)' : 'var(--card)'}" stroke="var(--ink)" stroke-width="1.5" pointer-events="none"/>`);
    out.push(`<text x="${gx + 9}" y="${my + 4}" class="tiny" text-anchor="start" pointer-events="none">水門${closed ? '（閉）' : ''}</text>`);
  }
  if (phase === 'edit') out.push(`<path d="${d}" fill="none" stroke="transparent" stroke-width="20" class="hit" data-pipe="${c.id}"/>`);
  out.push(`</g>`);
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
const RAINBOW_AFTER_MS = 800; // 100点：噴き始めから虹が出始めるまで
function drawFountain(out, cx, top, since, still) {
  const rise = still ? 1 : Math.min(1, since / 600);
  const ease = 1 - (1 - rise) ** 2;
  const sway = still ? 0 : Math.sin(since / 170) * 1.6;
  const peak = top - 4 - (26 + sway) * ease;
  const base = top + 6;
  out.push(`<path d="M${cx} ${base} L${cx} ${peak}" stroke="var(--water-mid)" stroke-width="4.5" stroke-linecap="round" opacity=".9"/>`);
  out.push(`<path d="M${cx} ${base} L${cx} ${peak + 2}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`);
  if (ease < 0.6) return;
  const spread = 15 * ease;
  for (const dir of [-1, 1]) {
    out.push(`<path d="M${cx} ${peak + 1} Q${cx + dir * spread * 0.7} ${peak - 6} ${cx + dir * spread} ${top + 2}" fill="none" stroke="var(--water-mid)" stroke-width="2" stroke-linecap="round" opacity=".7"/>`);
    // しぶきの粒：上から盤の縁へ落ちていく
    for (let i = 0; i < 3; i++) {
      const p = still ? (i + 0.5) / 3 : ((since / 900) + i / 3) % 1;
      const x = cx + dir * spread * p;
      const y = (1 - p) ** 2 * (peak + 1) + 2 * (1 - p) * p * (peak - 6) + p * p * (top + 2);
      out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="var(--water-mid)" opacity="${(0.85 - p * 0.4).toFixed(2)}"/>`);
    }
  }
}

function basinShape(cx) {
  const top = GROUND - 26;
  return {
    top, left: cx - 22, right: cx + 22,
    bowl: `M${cx - 24} ${top} L${cx + 24} ${top} L${cx + 17} ${GROUND - 4} Q${cx} ${GROUND + 2} ${cx - 17} ${GROUND - 4} Z`
  };
}

// model: { stage, layout, connected:Set, primed:Set, thinness(c), selected, phase, levels:Map(id→number|null),
//          settled, view:{result, outlets, broken}（今見せている状態の計算結果）, gateClosed,
//          prevLevels:Map, time, reducedMotion, highlight:{id, until} }
export function renderBoard(svg, model) {
  const { stage, layout, phase, levels, settled, prevLevels, time, reducedMotion } = model;
  const evaluation = model.view;
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

  // 壁（サイフォンが越える）
  for (const wall of stage.walls ?? []) {
    const x = 18 + wall.x * 32.4;
    const y = layout.yOf(Number(wall.height));
    out.push(`<rect x="${x - 8}" y="${y}" width="16" height="${GROUND - y}" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
    for (let yy = y + 14; yy < GROUND; yy += 14) out.push(`<line x1="${x - 8}" y1="${yy}" x2="${x + 8}" y2="${yy}" stroke="var(--stone-edge)" stroke-width="1"/>`);
  }

  // 地面の下を通る水路（サイフォンはグラスの後に描いて、グラスの中の入口が見えるようにする）
  for (const c of stage.candidates.filter(c => !c.siphon)) drawPipe(out, layout, c, model);

  // 泉
  const spring = layout.nodes.get(stage.spring.id);
  const sx0 = spring.cx - spring.w / 2;
  const sy = layout.yOf(H);
  out.push(`<rect x="${sx0 - 4}" y="${sy - 10}" width="${spring.w + 8}" height="${GROUND - sy + 10}" rx="5" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
  out.push(`<rect x="${sx0}" y="${sy}" width="${spring.w}" height="${GROUND - sy}" fill="${waterColor(H, H)}"/>`);
  out.push(`<path d="${surfacePath(sx0, sx0 + spring.w, sy, reducedMotion ? 0 : 0.8, time / 420)}" stroke="var(--surface)" stroke-width="2" fill="none"/>`);
  out.push(`<text x="${spring.cx}" y="${sy - 16}" class="label" text-anchor="middle">泉</text>`);

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

  // サイフォン（グラスの中の入口から、壁の上を越える）
  for (const c of stage.candidates.filter(c => c.siphon)) drawPipe(out, layout, c, model);

  // 出口の噴水盤
  for (const o of stage.outlets) {
    const node = layout.nodes.get(o.tower);
    const cx = node.cx + TOWER_W / 2 + 28;
    const b = basinShape(cx);
    const verdict = settled ? evaluation?.outlets.find(v => v.id === o.id) : null;
    const flowing = phase !== 'edit' && evaluation?.result.outlets[o.id]?.active && !evaluation.result.outlets[o.id].flow.isZero();
    // 口の高さが0より上の出口は、口と噴水盤をその高さへ持ち上げ、台の上に置く
    const dy = layout.yOf(Number(o.height)) - GROUND;
    if (dy < 0) out.push(`<rect x="${cx - 14}" y="${GROUND - 4 + dy}" width="28" height="${4 - dy}" fill="var(--stone)" stroke="var(--stone-edge)" stroke-width="1.5"/>`);
    out.push(`<g transform="translate(0 ${dy})">`);
    // グラスから噴水盤への口
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
    }
    out.push(`<line x1="${b.left + 3}" y1="${markY}" x2="${b.right - 3}" y2="${markY}" stroke="var(--gold)" stroke-width="2"/>`);
    // クリアの噴水と、100点の虹（2026-11-01 発案者）。ジングルの鳴り始めと同時に噴き上がり、
    // 100点のときは噴き上がった後に虹がかかる。NGでは噴かない。
    // 盤面は毎フレーム描き直すので、CSSのアニメーションではなく時刻から形と濃さを計算する
    if (verdict && model.fountainAt != null && model.outcome && model.outcome !== 'ng') {
      const since = model.time - model.fountainAt;
      if (since >= 0) {
        if (model.outcome === 'perfect') {
          const k = model.reducedMotion ? 1 : Math.max(0, Math.min(1, (since - RAINBOW_AFTER_MS) / 700));
          if (model.reducedMotion ? since >= RAINBOW_AFTER_MS : k > 0) {
            const opacity = 0.9 * (1 - (1 - k) ** 3);
            out.push(`<path d="M${cx - 30} ${b.top - 4} A30 34 0 0 1 ${cx + 30} ${b.top - 4}" fill="none" stroke="url(#bow)" stroke-width="7" opacity="${opacity.toFixed(3)}"/>`);
          }
        }
        drawFountain(out, cx, b.top, since, model.reducedMotion);
      }
    }
    out.push('</g>');
    if (dy < 0) out.push(`<text x="${cx}" y="${GROUND - 26 + dy - 8}" class="tiny" text-anchor="middle">口の高さ ${esc(o.height)}</text>`);
    const target = typeof o.target === 'object' ? (model.gateClosed ? o.target.closed : o.target.open) : o.target;
    out.push(`<text x="${cx}" y="${GROUND + 16}" class="tiny" text-anchor="middle">指定 ${esc(target)}</text>`);
  }
  svg.innerHTML = out.join('');
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
