import { outletAnnotations, annotationRect } from './board-annotations.js';

export const badgeTextWidth = (text, size) => [...String(text)].reduce((n, ch) => n + (/[\x20-\x7e]/.test(ch) ? size * .6 : size * 1.02), 0);
export const captionWidth = (text, size) => Math.round(12 + badgeTextWidth(text, size));
export const rectsOverlap = (a, b, gap = 1) => a.l < b.r + gap && b.l < a.r + gap && a.t < b.b + gap && b.t < a.b + gap;
export function captionRect(x, y, w, h = 15, kind = 'caption') {
  const left = Math.min(360 - w - 2, Math.max(2, x - w / 2));
  return { kind, x: left + w / 2, y, w, h, l: left - .6, r: left + w + .6, t: y - h / 2 - .6, b: y + h / 2 + .6 };
}

// 状態によって幅や位置を変えない、部品の札の配置。実管と入力の計算は触らない。
const cache = new WeakMap();
export function equipmentAnnotations(layout, stage, pipePath) {
  if (cache.has(layout)) return cache.get(layout);
  const pumps = new Map(), drains = new Map(), gates = new Map(), crests = new Map(), gateBodies = [], names = [];
  const walls = (stage.walls ?? []).map(w => ({ kind: 'wall', l: 18 + w.x * 32.4 - 9, r: 18 + w.x * 32.4 + 9, t: layout.yOf(Number(w.height)), b: 371 }));
  const bodies = [...layout.nodes.values()].map(n => ({ l:n.cx-(n.kind==='spring'?32.5:21.5), r:n.cx+(n.kind==='spring'?32.5:21.5), t:n.kind==='spring'?layout.yOf(Number([stage.spring,stage.spring2].find(s=>s?.id===n.id).height))-12:layout.towerTop-4, b:370 }));
  const notes = stage.outlets.flatMap(o => Object.values(outletAnnotations(layout, o, layout.nodes.get(o.tower).cx + 26)).map(p => annotationRect(p, 'outlet caption')));
  for (const tower of stage.towers) {
    const node = layout.nodes.get(tower.id);
    const crests = stage.candidates.filter(c => c.siphon && (c.a === tower.id || c.b === tower.id)).map(c => pipePath(layout, c).my);
    names.push({ ...captionRect(node.cx, Math.min(layout.towerTop - 3, ...crests.map(y => y - (stage.free ? 26 : 14))), captionWidth(`グラス${tower.id}`, 9.5), 15, 'glass caption'), owner: tower.id });
    for (const c of stage.candidates.filter(c => c.siphon && c.pump === tower.id)) {
      const other = layout.nodes.get(c.a === tower.id ? c.b : c.a), p = pipePath(layout, c);
      const leg = p.pts[node.cx <= other.cx ? 0 : 3];
      // 入口を指す線はその高さのまま。札だけをグラス間の空きへ出す。
      const middle = (node.cx + other.cx) / 2;
      const options = [0, -18, 18, -36, 36].flatMap(dy => [0,-10,10,-20,20,-42,42,-60,60,-80,80].map(dx => ({ ...captionRect(middle+dx,leg[1]+dy,34,29,'pump caption'), cost:dx*dx+dy*dy })));
      options.sort((a,b)=>a.cost-b.cost);
      const caption = options.find(p => p.t>=0 && p.b<=370 && ![...notes,...names,...pumps.values(),...walls,...bodies].some(r=>rectsOverlap(p,r))) ?? options[0];
      pumps.set(c.id, { ...caption, anchor: { x: leg[0], y: leg[1] }, inlet: c.siphon.inlet });
    }
  }
  for (const d of stage.drains ?? []) {
    const node = layout.nodes.get(d.tower), w = captionWidth('排水口 全開', 8.5);
    // 底の低い水位を残し、同じグラスの必要量・高さ札も避ける。
    const ys = [306, 286, 326, 266, 246, 226, 206, 186, 166, 146, 126];
    const y = ys.find(y => y - 8.1 > layout.towerTop + 12 && ![...notes, ...names, ...pumps.values(), ...drains.values()].some(r => rectsOverlap(captionRect(node.cx, y, w), r))) ?? 306;
    const sideCost = side => {
      const x = node.cx + side * 36;
      let cost = x < 4 || x > 356 ? 10000 : 0;
      for (const n of layout.nodes.values()) if (n.id !== node.id && Math.abs(n.cx - x) < (n.kind === 'spring' ? 34 : 23)) cost += 1000;
      for (const o of stage.outlets) if (o.tower !== d.tower && Number(o.height) === 0 && Math.abs(layout.nodes.get(o.tower).cx + 26 - x) < 34) cost += 1000;
      for (const c of stage.candidates) { const p = pipePath(layout, c); if (p.pts.some(([px, py]) => py >= 368 && Math.abs(px - x) < 8)) cost += 100; }
      return cost;
    };
    const side = sideCost(-1) <= sideCost(1) ? -1 : 1;
    drains.set(d.id, { ...captionRect(node.cx, y, w, 15, 'drain caption'), side, portX: node.cx + side * 36 });
  }
  const paths = stage.candidates.map(c => ({ c, p: pipePath(layout, c) }));
  for (const { c, p } of paths.filter(r => r.c.gate)) {
    const gx = p.gx ?? p.mx, w = captionWidth('水門', 8);
    gateBodies.push({ kind: 'gate body', l: gx - 5.75, r: gx + 5.75, t: p.my - 9.75, b: p.my + 9.75 });
    const candidates = [-19, 19].flatMap(dy => [0, -26, 26, -42, 42].map(dx => captionRect(gx + dx, p.my + dy, w, 13, 'gate caption')))
      .filter(r => r.t >= 0 && r.b < 469);
    const score = r => {
      let cost = (r.x - gx) ** 2 + (r.y - (p.my - 19)) ** 2;
      if ([...notes, ...names, ...pumps.values(), ...drains.values(), ...gates.values()].some(q => rectsOverlap(r, q))) cost += 100000;
      for (const { c: other, p: q } of paths) {
        const y = Math.min(q.my, 455), xs = [q.mx];
        for (let x = q.pts[1][0] + 8; x <= q.pts[2][0] - 8; x += 2) xs.push(x);
        const options = xs.filter(x => !paths.some(({ c: next, p: s }) => next.id !== other.id && [[s.pts[0], s.pts[1]], [s.pts[2], s.pts[3]]].some(([a, b]) => y >= Math.min(a[1], b[1]) - 7 && y <= Math.max(a[1], b[1]) + 7 && Math.abs(x - a[0]) < 15.2)));
        const blocked = options.filter(x => Math.hypot(Math.max(r.l - x, 0, x - r.r), Math.max(r.t - y, 0, y - r.b)) < 15.2).length;
        if (options.length) cost += blocked === options.length ? 100000 : 1800 * blocked / options.length;
      }
      return cost;
    };
    candidates.sort((a, b) => score(a) - score(b));
    gates.set(c.id, { ...candidates[0], anchor: { x: gx, y: p.my - 9.75 } });
  }
  for (const { c, p } of paths.filter(r => r.c.lifted)) {
    const occupied = [...names, ...pumps.values(), ...drains.values(), ...gates.values(), ...gateBodies, ...crests.values()];
    const xs = [26, 38, -26, -38, 0].map(dx => p.mx + dx).filter(x => x >= 16 && x <= 344);
    const x = xs.find(x => !occupied.some(r => rectsOverlap(captionRect(x, p.my, 30, 30), r))) ?? p.mx + 26;
    crests.set(c.id, captionRect(x, p.my, 30, 30, 'crest handle'));
  }
  const result = { pumps, drains, gates, crests, names, gateBodies, all: [...names, ...pumps.values(), ...drains.values(), ...gates.values(), ...gateBodies, ...crests.values(), ...walls] };
  cache.set(layout, result);
  return result;
}
