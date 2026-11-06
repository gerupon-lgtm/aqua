// 画面幅に合わせて、本文を短い文節の間で折り返す。文と区切りはチュートリアル側が正本。
import { textMarkup } from './text-layout.js';
import { LESSONS, PRACTICE_STEPS } from '../content/tutorial.js';
const PHRASES = new Map([...Object.values(LESSONS), ...PRACTICE_STEPS].map(s => [s.intro ?? s.text, s.phrases]));

export function guideMessage(text, { title = '', progress = '', cheer = false } = {}) {
  const parts = PHRASES.get(text);
  const copy = parts ? parts.map(part => `<span class="phrase">${textMarkup(part)}</span>`).join('') : textMarkup(text);
  return `<span class="spirit${cheer ? ' spirit-cheer' : ''}" role="img" aria-label="水の妖精"></span><span class="guide-copy"><strong class="guide-caption">水の妖精${progress ? `<small>${textMarkup(progress)}</small>` : ''}</strong>${title ? `<strong class="guide-title">${textMarkup(title)}</strong>` : ''}<span class="guide-text">${copy}</span></span>`;
}
