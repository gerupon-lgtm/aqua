// 採用案：高さが上、必要量が下。札の位置は通水・判定で動かさない。
export const HEIGHT_BADGE = { w: 41, h: 15 };
const QUANTITY_BADGE_TONES = {
  light: ['#ffffff', '#1d4f88', '#17314c'],
  blue: ['#1d56a0', '#163f78', '#ffffff'],
  orange: ['#dc5a2c', '#b4421c', '#ffffff'],
  gold: ['#ffe19c', '#956e21', '#17314c']
};
const escapeBadgeText = value => String(value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

export function outletAnnotations(layout, outlet, cx) {
  const y = layout.yOf(Number(outlet.height));
  const w = 66;
  const x = Math.min(360 - w / 2 - 2, Math.max(w / 2 + 2, cx));
  return {
    quantity: { x, y: y - 14.5, w, h: 15, variant: 'one' },
    height: { x: x + w / 2 - HEIGHT_BADGE.w / 2, y: y - 34, w: HEIGHT_BADGE.w + 1.2, h: HEIGHT_BADGE.h + 1.2 }
  };
}

export function annotationRect(p, kind, pad = 1) {
  return { kind, l: p.x - p.w / 2 - pad, r: p.x + p.w / 2 + pad, t: p.y - p.h / 2 - pad, b: p.y + p.h / 2 + pad };
}

export function heightBadge(out, { x, y, text, outletId }) {
  const { w, h } = HEIGHT_BADGE;
  const left = Math.min(360 - w - 2, Math.max(2, x - w / 2)), top = y - h / 2;
  const owner = outletId == null ? '' : ` data-outlet="${escapeBadgeText(outletId)}"`;
  out.push(`<g class="board-badge height-card"${owner} pointer-events="none"><rect x="${left}" y="${top}" width="${w}" height="${h}" rx="3.5" fill="#ffffff" stroke="#1d4f88" stroke-width="1.2"/><rect x="${left + 1.6}" y="${top + 1.6}" width="${w - 3.2}" height="${h - 3.2}" rx="2.2" fill="none" stroke="rgba(29, 79, 136, .22)" stroke-width=".8"/><text x="${left + w / 2}" y="${y + 3.24}" font-size="9" font-weight="700" fill="#17314c" text-anchor="middle" class="board-badge-text">${escapeBadgeText(text)}</text></g>`);
}

export function quantityBadge(out, p, target, tone = 'light', mark = null, cue = 0) {
  const status = mark === 'check' ? 'ok' : mark ? 'ng' : 'empty';
  if (status === 'ok') tone = 'blue';
  else if (status === 'ng') tone = 'orange';
  const [fill, edge, ink] = QUANTITY_BADGE_TONES[tone] ?? QUANTITY_BADGE_TONES.light;
  const { x, y, w, h } = p, left = x - w / 2, top = y - h / 2;
  if (cue > 0) out.push(`<rect class="start-cue" x="${left - 3}" y="${top - 3}" width="${w + 6}" height="${h + 6}" rx="6" fill="#ffe19c" stroke="#a17b29" stroke-width="2.5" opacity="${cue.toFixed(3)}" pointer-events="none"/>`);
  out.push(`<g class="board-badge quantity-card" data-variant="one" data-status="${status}" data-outlet="${escapeBadgeText(p.outletId)}" aria-label="必要量${escapeBadgeText(target)}/秒" pointer-events="none"><rect x="${left}" y="${top}" width="${w}" height="${h}" rx="3.5" fill="${fill}" stroke="${edge}" stroke-width="1.2"/><rect x="${left + 1.6}" y="${top + 1.6}" width="${w - 3.2}" height="${h - 3.2}" rx="2.2" fill="none" stroke="${tone === 'light' ? '#c2d2e2' : '#ffffff'}" stroke-opacity=".45" stroke-width=".8"/><text class="quantity-label" x="${x - 5.5}" y="${y + 3.2}" text-anchor="middle" font-size="9" font-weight="700" fill="${ink}">必要量${escapeBadgeText(target)}/秒</text>`);
  // 空のチェック枠を最初から確保し、結果の印だけを取り替える。
  out.push(`<g class="quantity-status" transform="translate(${x + w / 2 - 8} ${y})"><rect class="quantity-status-box" x="-3.5" y="-3.5" width="7" height="7" rx=".7" fill="none" stroke="${status === 'empty' ? edge : '#ffffff'}" stroke-width=".8"/>`);
  if (status !== 'empty') {
    const verdict = status === 'ok'
      ? '<path d="M-1.8 0 L-.4 1.4 L1.9 -1.6" fill="none" stroke="#f2c14e" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M-1.7 0 H1.7" fill="none" stroke="#ffffff" stroke-width="1.25" stroke-linecap="round"/>';
    out.push(`<g class="quantity-verdict" data-mark="${status === 'ok' ? 'check' : 'minus'}">${verdict}</g>`);
  }
  out.push('</g></g>');
}
