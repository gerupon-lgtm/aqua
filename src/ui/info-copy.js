// パーツと遊び方の説明。アプリと文字組み点検で、同じ内容を使う。
import { phraseMarkup } from './text-layout.js';

const partPicture = (id, alt) => `<img class="part-illustration" src="${new URL(`../../public/graphics/intro-${id}.svg`, import.meta.url).href}" alt="${alt}" width="960" height="360">`;
export const PARTS_HTML = `<dl class="parts">
  <dt>給水塔</dt><dd>${phraseMarkup('水が出るところ。|給水塔の水の高さが、|流れのもとになります。')}</dd>
  <dt>グラス</dt><dd>${phraseMarkup('水がたまります。|水位で音が決まり、|水が多いほど低い音。|目盛りに乗ると|澄んだ和音になります。')}</dd>
  <dt>配管</dt><dd>${phraseMarkup('給水塔とグラスをつなぎます。|丸い札は太さと数字の2段です。|太＝1・中＝2・細＝3。|同じ高さの差なら、|小さい数字ほど多く流れます。|流れる量＝高さの差÷管の数字。|縦につなぐと数字は足し算、|並べると流れやすくなります。')}</dd>
  <dt>噴水盤</dt><dd>${partPicture('outlets', '給水塔から分かれた水が2つの噴水盤へ届く様子')}${phraseMarkup('必要量の水を受けます。|白い陶器の枠とガラスの内器で、|水位と薄い金色の目印を|見比べます。|出口の管の太さは|引き出し線の先の丸い札で示します。')}</dd>
  <dt>高さの違う出口</dt><dd>${partPicture('height', '出口と水位の差に応じて、水が流れる様子')}${phraseMarkup('水位と口の高さの差を、|出口の管の数字で割ります。|口より低い水位では流れません。')}</dd>
  <dt>太さを選べる配管</dt><dd>${partPicture('adjustable', '配管をタップして3段階の太さを選ぶ様子')}${phraseMarkup('タップして|「太・中・細」から選びます。')}</dd>
  <dt>サイフォンと桶</dt><dd>${partPicture('siphon', '桶で壁を越える管の空気を水に置き換え、流れるようにする様子')}${phraseMarkup('壁を越える配管です。|桶で呼び水をすると流れます。|桶の数には限りがあります。')}</dd>
  <dt>水門</dt><dd>${partPicture('gate', '水門が開いているときと閉じたあとで、水の通り道が変わる様子')}${phraseMarkup('流したあと自動で閉じます。|開いたときと閉じたときの両方で、|必要量を届けます。')}</dd>
</dl>`;
export const HOWTO_HTML = `<div class="howto">
  <p>${phraseMarkup('配管をタップしてつなぎ、|「水を流す」を押します。|噴水盤に必要量が届けばクリア。|使った配管が少ないほど高い点で、|いちばん少ない答えが100点です|（桶を使う面は、|桶の少なさが先）。')}</p>
  <p>${phraseMarkup('流れたあと、|グラスを指でなぞると、|そのグラスの音を聞き直せます。|結果の「解説」で、|なぜその量になったかを|確かめられます。')}</p>
  <h3 class="sheet-sub">遊び方</h3>
  <ul class="plain"><li>${phraseMarkup('チュートリアル：|画面の見方と、|お試し1〜6面で|流れの決まりを学びます。')}</li>
  <li>${phraseMarkup('連続プレイ：|1面から順に進みます。|レベルごとに、|NGの回数に上限があります。')}</li>
  <li>${phraseMarkup('選択プレイ：|好きな面を選んで遊びます。|面ごとに最高点と、|クリアまでの最少の試行回数を|記録します。')}</li>
  <li>自由作成：準備中です。</li></ul>
</div>`;
