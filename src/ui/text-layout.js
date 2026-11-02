// 数字と補足、ゲーム中の語を途中で切らない。画面・案内・解説で共用する表示処理。
import { frac } from '../logic/fraction.js';

const escapeText = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TERMS = [
  '太さを選べる配管', '太さを変えられる配管', 'グラスの水位', '高さの差', '水位の差', '流れる量', '流れやすくなります',
  '高い受け皿', '左の噴水盤', '右の噴水盤', '中の噴水盤', '噴水盤', '給水塔', 'サイフォン', 'グラス', '配管',
  '管の数字', '凡例', '水門', '呼び水', '必要量', '届いた量', '目盛り', '通り道', '分かれ道', '受け皿', '細さ', '太さ', '本数', 'グラスハープ', 'ジングル',
  'チュートリアル', '連続プレイ', '選択プレイ', '自由作成', 'パーツの説明', 'いちばん少ない',
  '予想どおり', '予想', '実際', '届きました', '届きません', '届けます', '届けましょう', '届けました',
  '流れます', '流れません', '足りません', '足りない', '多すぎます', 'ちょうど', '変わります',
  'つながっていない', 'つないだあと', 'つなぎましょう', '確かめましょう', '見比べます', '聞き直せます',
  '並べると', '並べて', '比べて', '選びます', '調えます', '使えます', '探します', '組み合わせて',
  '水が届いていません', '流れにくさ', '流れやすさ', '減らすと', '増やすと', '足し算', '流れていません'
].sort((a, b) => b.length - a.length);
// 分数と「約」の括弧は本文では一まとまり。大きな数値欄だけはamountMarkupで分ける。
const token = new RegExp(`(?:（[^（）]{1,24}）|(?:[÷＝→] ?)?(?:差 ?|細さ ?|管の数字 ?|入る ?|出る ?)?[−-]?\\d+(?:[./]\\d+)*(?:[〜–]\\d+)?(?:（約[−-]?\\d+(?:\\.\\d+)?）)?(?: ?(?:秒|本|回|個|面))?|→ ?(?:グラス[A-Z]|給水塔|(?:左の|右の|中の)?噴水盤|高い受け皿)|グラス[A-Z]|${TERMS.join('|')})(?:には|では|から|まで|より|だけ|ほど|は|が|を|に|の|へ|で|と|も|や)?[、。！？：]?`, 'g');

export function textMarkup(text) {
  let result = '', at = 0;
  for (const match of String(text).matchAll(token)) {
    result += escapeText(String(text).slice(at, match.index));
    result += `<span class="text-unit">${escapeText(match[0])}</span>`;
    at = match.index + match[0].length;
  }
  return result + escapeText(String(text).slice(at));
}

export function phraseMarkup(text) {
  return String(text).split('|').map(part => `<span class="phrase">${textMarkup(part)}</span>`).join('');
}

export function amountMarkup(value) {
  const f = frac(value), exact = f.toString();
  return `<b class="amount-number"><span class="amount-exact">${exact}</span>${f.isInteger() ? '' : `<span class="amount-approx">（約${f.toNumber().toFixed(2)}）</span>`}</b>`;
}

const VERDICTS = { exact: ['✓', 'ちょうど'], short: ['−', '足りない'], over: ['＋', '多い'] };
export function deliveryMarkup(label, outlet) {
  const [icon, name] = VERDICTS[outlet.verdict];
  // 320px幅では「549/139」（7文字）も2列に収まらない。
  const wide = Math.max(String(outlet.target).length, String(outlet.flow).length) >= 7;
  return `<li class="${outlet.verdict}"><div class="delivery-head${wide ? ' long-label' : ''}"><span>${textMarkup(label)}</span><span class="verdict-badge ${outlet.verdict}"><span aria-hidden="true">${icon}</span>${name}</span></div><div class="delivery-values${wide ? ' long-amount' : ''}"><div><span class="amount-label">必要量</span>${amountMarkup(outlet.target)}</div><div><span class="amount-label">届いた量</span>${amountMarkup(outlet.flow)}</div></div></li>`;
}
