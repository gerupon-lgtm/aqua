# part-basin / 優先度1の比較候補

生成日：2026-11-01（日本時間） / 道具：Codexの組み込み画像生成。

**採用：全案未確定。発案者が実画面で見比べてから選ぶ。現在の公開画面には未組み込み。**

[全体の案内](../2026-11-01-priority1/README.md)

![A・B比較](comparison.png)

## 候補と使い方

器A/Bに加え、対応する台座A/Bを収録。台座は上と繰り返す胴に分割。器と台座を重ねたときの接続は実画面で確認する。

## part-basin-a — 金の細縁の噴水盤

採用：未確定。

生成原本：[originals/part-basin-a.png](originals/part-basin-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-basin-a.png](part-basin-a.png)：384×208 / RGBA / 43,901 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-a.png`

加工：物体領域 (0, 163, 1704, 855) を余白つきで切り出し、縦横比を保って384×208の透過キャンバスへ収めた。内側の透明部分は生成結果を保持。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single isolated game FOUNTAIN BASIN, transparent RGBA background, wide canvas 1536x832, finished target384x208. White ivory stone inverted trapezoid vessel with broad open top and rounded shallow bottom, viewed exactly straight from front as cutaway. Subtle thin pale-gold line only along mouth rim. EMPTY interior cavity truly transparent; no blue water, no fountain jets. A small plain open pipe inlet enters from LEFT side only, no right pipe. Soft blue-gray bevel, smooth classic stone, no crystals/stars/ornament, no feet/pedestal, no floor/ground shadow. Compact silhouette centered with small transparent margin, entire basin and left inlet visible. Side wall shape narrows toward rounded bottom, broad opening, suitable for front view game board with width48 height26. Do not draw scenery or a realistic back wall blocking the cavity.
```

## part-basin-b — 水紋の彫り縁の噴水盤

採用：未確定。

生成原本：[originals/part-basin-b.png](originals/part-basin-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-basin-b.png](part-basin-b.png)：384×208 / RGBA / 64,535 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-b.png`

加工：物体領域 (0, 191, 1704, 818) を余白つきで切り出し、縦横比を保って384×208の透過キャンバスへ収めた。内側の透明部分は生成結果を保持。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Single isolated game FOUNTAIN BASIN candidate B, true transparent RGBA background, wide1536x832 canvas for target384x208. Entire ivory limestone vessel viewed straight front CUTAWAY, shallow inverted trapezoid bowl with a broad open mouth and gently round bottom. Center cavity is EMPTY and transparent so app draws water behind. Thin pale gold line at rim, one restrained shallow WAVE relief on the outside bottom stone, soft cool blue-gray stone bevels. Slightly softer rounded corners than A. A short small inlet enters from LEFT only. No liquid, no jets, no pedestal, no handles, no stars/crystals, no floor/shadow or scene. Leave small transparent margin, functional clean silhouette at game width48px. Interior MUST stay open transparent, not an opaque back wall.
```

## part-basin-pedestal-a — 端正な白石台座

採用：未確定。

生成原本：[originals/part-basin-pedestal-a.png](originals/part-basin-pedestal-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-basin-pedestal-a-whole.png](part-basin-pedestal-a-whole.png)：224×509 / RGBA / 115,732 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-a-whole.png`
- [part-basin-pedestal-a-top.png](part-basin-pedestal-a-top.png)：224×96 / RGBA / 27,917 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-a-top.png`
- [part-basin-pedestal-a-middle.png](part-basin-pedestal-a-middle.png)：224×64 / RGBA / 602 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-a-middle.png`

加工：物体領域 (205, 97, 816, 1486) を余白つきで切り出し、幅224pxへ比例縮小。上96pxと中央1行を高さ64pxへ拡大した胴を分離。胴の上下端は同一。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Isolated WHITE STONE PEDESTAL matching minimalist classical fountain basin, true transparent RGBA background, portrait1024x1536. A simple upright RECTANGULAR stone plinth viewed perfectly straight front. NO basin or bowl on top. Broad shallow flat top cap (about top15%), constant-width straight rectangular pillar shaft below (about75%), with NO foot or bottom widening because shaft is vertically extendable. Smooth ivory stone, subtle pale blue-gray side bevels, single faint pale gold line on cap only, no carvings, no columns/fluting, no gems/stars. Central front face opaque stone. Entire support within margins, no ground, no floor shadow, no other objects. This asset will split into top cap and a vertically repeating body strip at target width224px.
```

## part-basin-pedestal-b — 水紋の白石台座

採用：未確定。

生成原本：[originals/part-basin-pedestal-b.png](originals/part-basin-pedestal-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [part-basin-pedestal-b-whole.png](part-basin-pedestal-b-whole.png)：224×499 / RGBA / 96,612 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-b-whole.png`
- [part-basin-pedestal-b-top.png](part-basin-pedestal-b-top.png)：224×96 / RGBA / 30,463 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-b-top.png`
- [part-basin-pedestal-b-middle.png](part-basin-pedestal-b-middle.png)：224×64 / RGBA / 520 bytes。保存先 `public/graphics/candidates-20261101/part-basin/part-basin-pedestal-b-middle.png`

加工：物体領域 (184, 54, 838, 1510) を余白つきで切り出し、幅224pxへ比例縮小。上96pxと中央1行を高さ64pxへ拡大した胴を分離。胴の上下端は同一。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. A SINGLE white limestone game PEDESTAL on true transparent RGBA1024x1536portrait. Full front elevation, shallow broad top cap on straight rectangular pillar. No bowl/no basin. Candidate B: one delicate shallow wave relief on top cap matching wave-relief fountain basin, rest of tall shaft is smooth and featureless ivory stone with blue-gray side bevel. Top cap15%, constant width shaft75%, no base flare/foot since shaft will vertically repeat. NO gold except one tiny reflected edge glint. No stars, no crystals, no floor shadow, no scenery. Entire silhouette in margins, opaque stone face. Top and body will be extracted separately target224px wide.
```
