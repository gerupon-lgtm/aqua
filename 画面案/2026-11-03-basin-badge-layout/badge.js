// v0.14.10本番のバッジ描画をそのまま使う比較用の複製。
const VIEW_W = 360;
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


export { badge };
