# part-glass / 優先度1の比較候補

生成日：2026-11-01（日本時間） / 道具：Codexの組み込み画像生成。

**採用：全案未確定。発案者が実画面で見比べてから選ぶ。現在の公開画面には未組み込み。**

[全体の案内](../2026-11-01-priority1/README.md)

![A・B比較](comparison.png)

## 候補と使い方

`top`（上）＋`middle`（縦に繰り返す胴）＋`bottom`（下）を使用する。`whole`は全体像の参考。`joins.png`は分割接続の比較で、実アプリの検証結果ではない。

## part-glass-a — 薄縁のクリアグラス

採用：未確定。

生成原本：[originals/part-glass-a.png](originals/part-glass-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-glass-a-whole.png](part-glass-a-whole.png)：136×405 / RGBA / 72,391 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-a-whole.png`
- [part-glass-a-top.png](part-glass-a-top.png)：136×48 / RGBA / 10,791 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-a-top.png`
- [part-glass-a-middle.png](part-glass-a-middle.png)：136×64 / RGBA / 567 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-a-middle.png`
- [part-glass-a-bottom.png](part-glass-a-bottom.png)：136×40 / RGBA / 10,915 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-a-bottom.png`

加工：原本の物体領域を余白つきで切り出し (266, 38, 758, 1502)、幅136pxへ縦横比を保って縮小。全体像の上0〜65pxを高さ48px、下332〜405pxを高さ40pxへ調整して分離し、縁と底の形が途中で切れないようにした。胴は中央1行を高さ64pxへ拡大し、縦の繰り返し境界を同一にした。描き足し・背景消去なし。 / 原本の胴の縦模様は全体像に保持。分割用の胴は縦方向に一定となる。上下の部品は縦方向の寸法を調整している。接続の反射・色の差の見え方は比較画像と実画面で要確認。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single clear GLASS HARP vessel game asset, transparent RGBA portrait 1024x1536. Entire upright glass cylinder viewed exactly straight on, no perspective tilt, NO stem, NO wineglass foot. Perfectly parallel straight side walls, simple open thin elliptical rim and shallow round bottom. Empty interior, no water, NO tick marks, no graduations, no label, no pipe, no scenery or ground shadow. Clear center almost completely transparent; shape seen only through thin silver-white edge highlights and soft blue refraction. Slim silhouette suitable for width34 screen units and variable heights150-300: central 70% constant cross-section suitable for vertically repeating a strip. Compact rim/base, full vessel within canvas, no glow halo outside. Only a faint warm edge highlight, no gold metal. Candidate A extremely fine crystal glass, restrained vertical highlights, almost invisible clear body, delicate rolled rim, simple smooth rounded bottom.
```

## part-glass-b — 青い反射のリムグラス

採用：未確定。

生成原本：[originals/part-glass-b.png](originals/part-glass-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-glass-b-whole.png](part-glass-b-whole.png)：136×398 / RGBA / 73,264 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-b-whole.png`
- [part-glass-b-top.png](part-glass-b-top.png)：136×48 / RGBA / 11,118 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-b-top.png`
- [part-glass-b-middle.png](part-glass-b-middle.png)：136×64 / RGBA / 575 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-b-middle.png`
- [part-glass-b-bottom.png](part-glass-b-bottom.png)：136×40 / RGBA / 11,182 bytes。保存先 `public/graphics/candidates-20261101/part-glass/part-glass-b-bottom.png`

加工：原本の物体領域を余白つきで切り出し (262, 35, 764, 1505)、幅136pxへ縦横比を保って縮小。全体像の上0〜64pxを高さ48px、下326〜398pxを高さ40pxへ調整して分離し、縁と底の形が途中で切れないようにした。胴は中央1行を高さ64pxへ拡大し、縦の繰り返し境界を同一にした。描き足し・背景消去なし。 / 原本の胴の縦模様は全体像に保持。分割用の胴は縦方向に一定となる。上下の部品は縦方向の寸法を調整している。接続の反射・色の差の見え方は比較画像と実画面で要確認。

参照画像：

- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-a331abbf-4e16-4fc9-b047-65b3ea7dad7d.png`

上記がこの呼び出しで渡した画像。前作の絵はシリーズの画風の参照で、上書き対象ではない。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single game GLASS HARP vessel on truly transparent RGBA background 1024x1536 portrait, no scene. Candidate B: elegant slightly thicker crystal cylindrical glass, a thin ice-blue doubled rim and faint vertical blue highlights, shallow softly rounded bottom. Strict straight-on elevation, parallel straight vertical sides of CONSTANT width over middle 70%, NOT a goblet, NO stem or foot, no taper, no decorations in the center. EMPTY, no water, no tick marks, no numbers, no pipes, no floor shadow, no opaque halo; interior nearly transparent for animated water layer drawn behind it. Isolated full tall vessel with margins. Stronger cool-blue side edge than A so at width34px the silhouette stays clear. Body can be vertically tiled, top and base compact. Same luminous restrained painterly game asset finish as reference, NO stars and no gold framework.
```
