# part-spring / 優先度1の比較候補

生成日：2026-11-01（日本時間） / 道具：Codexの組み込み画像生成。

**採用：全案未確定。発案者が実画面で見比べてから選ぶ。現在の公開画面には未組み込み。**

[全体の案内](../2026-11-01-priority1/README.md)

![A・B比較](comparison.png)

## 候補と使い方

`top`（上）＋`middle`（縦に繰り返す胴）＋`bottom`（下）を使用する。`whole`は全体像の参考。`joins.png`は分割接続の比較で、実アプリの検証結果ではない。

## part-spring-a — 白石の端正な泉

採用：未確定。

生成原本：[originals/part-spring-a.png](originals/part-spring-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-spring-a-whole.png](part-spring-a-whole.png)：240×427 / RGBA / 77,654 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-a-whole.png`
- [part-spring-a-top.png](part-spring-a-top.png)：240×48 / RGBA / 9,928 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-a-top.png`
- [part-spring-a-middle.png](part-spring-a-middle.png)：240×64 / RGBA / 499 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-a-middle.png`
- [part-spring-a-bottom.png](part-spring-a-bottom.png)：240×40 / RGBA / 11,939 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-a-bottom.png`

加工：原本の物体領域を余白つきで切り出し (131, 90, 893, 1446)、幅240pxへ縦横比を保って縮小。全体像の上0〜128pxを高さ48px、下290〜427pxを高さ40pxへ調整して分離し、縁と底の形が途中で切れないようにした。胴は中央1行を高さ64pxへ拡大し、縦の繰り返し境界を同一にした。描き足し・背景消去なし。 / 原本の胴の縦模様は全体像に保持。分割用の胴は縦方向に一定となる。上下の部品は縦方向の寸法を調整している。接続の反射・色の差の見え方は比較画像と実画面で要確認。

参照画像：

- `C:\Users\user\Documents\project\ダイクストラ法検証\public\graphics\source.png`

上記がこの呼び出しで渡した画像。前作の絵はシリーズの画風の参照で、上書き対象ではない。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single isolated game part on genuinely transparent RGBA background, portrait 1024x1536. White ivory stone tall OPEN reservoir vessel viewed perfectly straight from side as a 2D CUTAWAY. NOT a fountain, no flowing water. A rectangular upright stone U-shaped container: narrow ivory stone vertical side walls with perfectly parallel straight sides, open hollow central interior truly TRANSPARENT from below thin horizontal mouth rim down to a shallow rounded solid stone bottom. NO opaque back wall in the center, NO water, NO plants, NO handles, NO pipe, NO pedestal, NO ground shadow. Subtle cool gray bevels, VERY restrained pale gold line only along upper rim. Full vessel fills x15%-85%, y8%-92%. Upper rim and rounded base compact, central 60% plain constant cross-section suitable for stretching vertically. Ornament only at cap and base; body walls smooth. Clear game readable silhouette; do not draw a scene or multiple pieces. Candidate A restrained classical smooth stone.
```

## part-spring-b — 波の彫り縁の泉

採用：未確定。

生成原本：[originals/part-spring-b.png](originals/part-spring-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-spring-b-whole.png](part-spring-b-whole.png)：240×406 / RGBA / 70,943 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-b-whole.png`
- [part-spring-b-top.png](part-spring-b-top.png)：240×48 / RGBA / 9,918 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-b-top.png`
- [part-spring-b-middle.png](part-spring-b-middle.png)：240×64 / RGBA / 483 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-b-middle.png`
- [part-spring-b-bottom.png](part-spring-b-bottom.png)：240×40 / RGBA / 10,182 bytes。保存先 `public/graphics/candidates-20261101/part-spring/part-spring-b-bottom.png`

加工：原本の物体領域を余白つきで切り出し (74, 26, 950, 1507)、幅240pxへ縦横比を保って縮小。全体像の上0〜122pxを高さ48px、下276〜406pxを高さ40pxへ調整して分離し、縁と底の形が途中で切れないようにした。胴は中央1行を高さ64pxへ拡大し、縦の繰り返し境界を同一にした。描き足し・背景消去なし。 / 原本の胴の縦模様は全体像に保持。分割用の胴は縦方向に一定となる。上下の部品は縦方向の寸法を調整している。接続の反射・色の差の見え方は比較画像と実画面で要確認。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single game reservoir, transparent RGBA, 1024x1536 portrait. Front view CUTAWAY upright OPEN U-shaped white stone water container. Parallel perfectly straight vertical side walls, empty inner cavity genuinely transparent, compact rounded bottom. Entire outline within margins. Upper mouth is a thin ivory rim, NOT closed by a lid. No water, no pipe, no pedestal, no floor, no shadow, no star motifs or crystals, no scene. Central body constant cross-section for vertically repeating tile; no carvings on body. Decorative stone only along thin side walls, rim and bottom; center must be empty. Candidate B: ivory limestone rim and base have a SINGLE subtle shallow wave relief, smooth pale blue-gray side stone, minimalist aquatic architecture, no gold except one tiny sunlit glint at the rim. This is a functional hollow reservoir, not a decorative picture frame.
```
