// パーツと遊び方：概要の一覧から、項目ごとの詳しい説明を開く。
import { phraseMarkup } from './text-layout.js';
import { HELP_TOPICS } from './help-content.js';
export { HELP_TOPICS };
export const partPicture = (id, alt) => `<img class="part-illustration" src="${new URL(`../../public/graphics/intro-${id}.svg`, import.meta.url).href}" alt="${alt}" width="960" height="360">`;
const META = {
  parts:{title:'パーツの説明',lead:'役割と表示を知り、詳しい使い方を確かめられます。',pages:['水を運ぶ部品','高さと管の工夫','流れを調える部品']},
  howto:{title:'遊び方と概要',lead:'まずは4つの手順から。流れの決まりと自由作成も案内します。',pages:['基本の遊び方','決まりとモード','自由作成と記録']}
};
export function helpOverview(kind, page = 0) {
  const items = HELP_TOPICS[kind], meta = META[kind];
  if (!items || !Number.isInteger(page)) return null;
  const pages = Math.ceil(items.length / 4), current = Math.max(0,Math.min(pages-1,page));
  const cards = items.slice(current*4,current*4+4).map((item,i)=>`<button type="button" class="help-card" data-help-kind="${kind}" data-help-topic="${item.id}" aria-label="${item.name}の説明"><span class="help-number" aria-hidden="true">${String(current*4+i+1).padStart(2,'0')}</span><span class="help-card-copy"><strong>${phraseMarkup(item.name)}</strong><span class="help-summary">${phraseMarkup(item.summary)}</span><small>詳しく見る <span aria-hidden="true">→</span></small></span></button>`).join('');
  return {title:meta.title,html:`<p class="help-lead">${phraseMarkup(meta.lead)}</p><h3 class="help-section-title">${meta.pages[current]}</h3><div class="help-list">${cards}</div><nav class="pager help-pager" aria-label="${meta.title}のページ"><button type="button" class="ghost" data-help-kind="${kind}" data-help-page="${current-1}" ${current===0?'disabled':''}>前へ</button><span>${current+1} / ${pages}</span><button type="button" class="ghost" data-help-kind="${kind}" data-help-page="${current+1}" ${current===pages-1?'disabled':''}>次へ</button></nav>`};
}
export function helpTopic(kind, id) {
  const index = HELP_TOPICS[kind]?.findIndex(item=>item.id===id) ?? -1;
  if (index<0) return null;
  const item=HELP_TOPICS[kind][index];
  const picture=item.picture?partPicture(item.picture,item.alt):'';
  const sections=item.sections.map(s=>`<section><h3>${phraseMarkup(s.title)}</h3>${s.paragraphs.map(p=>`<p>${phraseMarkup(p)}</p>`).join('')}</section>`).join('');
  return {title:item.name,html:`<article class="help-detail"><p class="help-lead">${phraseMarkup(item.summary)}</p>${picture}${sections}</article>`,page:Math.floor(index/4)};
}
