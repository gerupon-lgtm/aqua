// 本体が出力した札の外周を読む。文字幅の再実装ではなく実際のrectを検査する。
export function renderedLabels(markup) {
  const read = text => Object.fromEntries([...text.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
  return [...markup.matchAll(/<g class="(board-badge[^\"]*|pipe-label[^\"]*|pump-caption)"([^>]*)>([\s\S]*?)<\/g>/g)].map(m => {
    const rect = /<rect ([^>]+)>/.exec(m[3]);
    if (!rect) throw new Error(`札に外周がない: ${m[1]}`);
    const a = read(rect[1]), data = read(m[2]);
    const x = +a.x, y = +a.y, w = +a.width, h = +a.height, pad = +(a['stroke-width'] ?? 0) / 2;
    return { kind: m[1], text: [...m[3].matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map(t => t[1]).join(''),
      id: data['data-pipe-label'] ?? data['data-outlet'] ?? data['data-pump'] ?? '',
      l: x - pad, t: y - pad, r: x + w + pad, b: y + h + pad,
      x: x + w / 2, y: y + h / 2, radius: m[1].startsWith('pipe-label') ? w / 2 + pad : null };
  });
}

export function overlaps(a, b, gap = .2) {
  if (a.radius && b.radius) return Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius + gap;
  if (a.radius || b.radius) {
    const [c, r] = a.radius ? [a, b] : [b, a];
    return Math.hypot(Math.max(r.l - c.x, 0, c.x - r.r), Math.max(r.t - c.y, 0, c.y - r.b)) < c.radius + gap;
  }
  return a.l < b.r + gap && b.l < a.r + gap && a.t < b.b + gap && b.t < a.b + gap;
}

export function labelConflicts(labels) {
  const conflicts = [];
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    if (overlaps(labels[i], labels[j])) conflicts.push([labels[i], labels[j]]);
  }
  return conflicts;
}

export function partConflicts(layout, stage, labels) {
  const bodies = [...layout.nodes.values()].map(n => ({ kind: 'body', id: n.id,
    l: n.cx - (n.kind === 'spring' ? 31.5 : 20.5), r: n.cx + (n.kind === 'spring' ? 31.5 : 20.5),
    t: n.kind === 'spring' ? layout.yOf(Number([stage.spring, stage.spring2].find(s => s?.id === n.id).height)) - 12 : layout.towerTop - 4,
    b: 370 }));
  bodies.push(...(stage.walls ?? []).map((w,i)=>({kind:'wall',id:`wall${i+1}`,l:18+w.x*32.4-9,r:18+w.x*32.4+9,t:layout.yOf(Number(w.height)),b:371})));
  const issues = [];
  for (const label of labels.filter(l => l.radius || l.kind === 'pump-caption')) for (const body of bodies) {
    if (overlaps(label, body)) issues.push({ kind: 'label-body', label, body });
  }
  for (const o of stage.outlets) {
    const cx = layout.nodes.get(o.tower).cx + 26, y = layout.yOf(Number(o.height));
    const pan = { id: o.id, l: cx - 31, r: cx + 31, t: y - 4.5, b: y + 10.2 };
    for (const body of bodies.filter(b => b.id !== o.tower)) if (overlaps(pan, body)) issues.push({ kind: 'pan-foreign-body', pan, body });
    if (Number(o.height) > 0) {
      const pedestal = { id: o.id, l: cx - 13.5, r: cx + 13.5, t: y + 5, b: 370 };
      for (const body of bodies.filter(b => b.id !== o.tower)) if (overlaps(pedestal, body)) issues.push({ kind: 'pedestal-foreign-body', pedestal, body });
    }
  }
  return issues;
}
