// 説明の挿絵。画面の部品と同じ白い陶器・ガラス・青い水で、文字なしのSVGを作る。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const defs = `<defs><linearGradient id="ceramic" x2=".3" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dbe6ef"/></linearGradient><linearGradient id="glass"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#b9e4f6" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 0 10Z" fill="#257fb9"/></marker></defs>`;
const line = (d, color = '#66b6df', width = 12) => `<path d="${d}" fill="none" stroke="#527492" stroke-width="${width + 5}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
const glass = (x, y, width, height, level) => `<path d="M${x} ${y} H${x + width} V${y + height} Q${x + width / 2} ${y + height + 10} ${x} ${y + height}Z" fill="url(#glass)" stroke="#527492" stroke-width="3"/><path d="M${x + 4} ${y + height - level} H${x + width - 4} V${y + height - 3} Q${x + width / 2} ${y + height + 4} ${x + 4} ${y + height - 3}Z" fill="#61b1d9" opacity=".8"/><path d="M${x + 10} ${y + 12} V${y + height - 12}" stroke="#fff" stroke-width="4" opacity=".8"/>`;
// imgとして開いたSVGでも同じ盤を出せるよう、採用PNGを内部に含める。
const drainPanImage = 'data:image/png;base64,' + readFileSync(new URL('../public/graphics/part-drain-pan-v2.png', import.meta.url)).toString('base64');
const outlet = (fromX, mouthY, cx, width = 130) => {
  const scale = width / 62, depth = 13.5 * scale;
  const photoY = mouthY - 30.611825192802055 * width / 512;
  return `${line(`M${fromX} ${mouthY} V${mouthY + depth} H${cx} V${mouthY}`, '#f4f3e9', 5.5 * scale)}<image href="${drainPanImage}" x="${cx - width / 2}" y="${photoY}" width="${width}" height="${104 * width / 512}"/><ellipse cx="${cx}" cy="${mouthY}" rx="${2.7 * scale}" ry="${1.1 * scale}" fill="#fff" stroke="#527492" stroke-width="${scale}"/><path d="M${cx} ${mouthY} q${scale} ${-8 * scale} ${5 * scale} ${-3 * scale} q${2 * scale} ${2 * scale} ${3 * scale} ${4 * scale}" fill="none" stroke="#287fb5" stroke-width="${1.4 * scale}" stroke-linecap="round"/>`;
};
const arrow = d => `<path d="${d}" fill="none" stroke="#257fb9" stroke-width="4" marker-end="url(#arrow)"/>`;
const gate = (x, y, closed) => `<g transform="translate(${x} ${y})"><rect x="-17" y="-26" width="34" height="52" rx="5" fill="#fffefa" stroke="#527492" stroke-width="3"/><path d="M-12 ${closed ? 0 : -18} H12" stroke="${closed ? '#244b6d' : '#65b5d9'}" stroke-width="9"/><path d="M0 -26 V-43 M-16 -43 H16" stroke="#527492" stroke-width="4"/></g>`;
const diagrams = {
  'intro-gate': [0, 1].map((closed, i) => `<g transform="translate(${i * 510} 0)">${line('M43 275 V290 H242 V275')}${line('M72 275 V320 H270 V275', closed ? '#edf2f7' : '#67b6df')}${glass(30, 55, 55, 220, 190)}${glass(230, 80, 55, 195, closed ? 80 : 130)}${outlet(285, 240, 365, 85)}${gate(175, 320, closed)}${arrow('M110 290 H180')}</g>`).join('') + arrow('M425 170 H495'),
  'intro-outlets': `${line('M155 290 V300 H485 V250')}${line('M177 290 V325 H735 V250')}${glass(115, 45, 65, 245, 215)}${glass(450, 55, 70, 195, 135)}${glass(700, 55, 70, 195, 95)}${outlet(520, 225, 635, 110)}${outlet(770, 225, 885, 110)}${arrow('M285 300 H365')}${arrow('M535 325 H620')}`,
  'intro-adjustable': [16, 10, 5].map((w, i) => `<g transform="translate(0 ${i * 100})">${line('M130 75 H620', '#86c7e3', w)}<circle cx="720" cy="75" r="32" fill="${i === 1 ? '#2a6db5' : '#fffefa'}" stroke="#527492" stroke-width="3"/><path d="M702 75 H738" stroke="${i === 1 ? '#fff' : '#527492'}" stroke-width="${w}"/></g>`).join('') + '<path d="M789 166 V230 L805 216 L821 242 L839 232 L822 207 L843 205Z" fill="#fffefa" stroke="#244b6d" stroke-width="3"/><circle cx="720" cy="175" r="42" fill="none" stroke="#8bcbe8" stroke-width="3"/>',
  'intro-height': `${glass(240, 35, 100, 270, 190)}${outlet(340, 218, 635, 175)}<path d="M220 218 H360" stroke="#b28c3c" stroke-width="3" stroke-dasharray="7 5"/><path d="M395 115 V218 M385 115 H405 M385 218 H405" fill="none" stroke="#257fb9" stroke-width="3"/>${arrow('M445 230 H520')}<path d="M249 115 H333" stroke="#257fb9" stroke-width="3"/>`,
  'intro-siphon': `${glass(155, 85, 85, 220, 155)}<path d="M440 330 V165 H505 V330" fill="url(#ceramic)" stroke="#8797a5" stroke-width="3"/><path d="M440 195 H505 M440 235 H505 M440 275 H505" stroke="#bdc7cd" stroke-width="2"/>${line('M240 240 H315 V105 Q315 85 335 85 H650 Q670 85 670 105 V260 H735', '#75bedf')}${outlet(735, 260, 805, 145)}<g transform="translate(350 25) rotate(20)"><path d="M-34 0 H34 L25 48 H-25Z" fill="#f7fcff" stroke="#527492" stroke-width="3"/><path d="M-34 0 Q0 -32 34 0" fill="none" stroke="#527492" stroke-width="3"/></g><path d="M377 57 Q384 70 372 83" fill="none" stroke="#58a9d4" stroke-width="6" stroke-linecap="round"/>${arrow('M530 85 H600')}${arrow('M670 155 V215')}`
};
for (const [name, content] of Object.entries(diagrams)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360">${defs}${content}</svg>\n`;
  writeFileSync(fileURLToPath(new URL(`../public/graphics/${name}.svg`, import.meta.url)), svg);
}
