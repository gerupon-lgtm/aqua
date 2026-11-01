# ui-badges / 優先度1の比較候補

生成日：2026-11-01（日本時間） / 道具：Codexの組み込み画像生成。

**採用：全案未確定。発案者が実画面で見比べてから選ぶ。現在の公開画面には未組み込み。**

[全体の案内](../2026-11-01-priority1/README.md)

![A・B比較](comparison.png)

## 候補と使い方

Aは角丸、Bは隅切り。各表に22の見本を収録。文字は生成された見本のため、実装では正確な文字列をアプリ側で描く。

Bは初回生成で接続済みの札と水門にも金のチェックが出たため、画像生成の編集で白へ修正した。金は到達ちょうどの成功印に残す。修正前の原本は originals/ui-badges-b-initial.png に保持。初回と修正の指示文全文を下記へ記録。

小さい表示の読みやすさは実際の16〜20pxのSVGで確認する。生成表の目視確認だけで合格とはしない。

## ui-badges-a — 角丸の青い札

採用：未確定。

生成原本：[originals/ui-badges-a.png](originals/ui-badges-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [ui-badges-a.png](ui-badges-a.png)：1536×1024 / RGB / 883,132 bytes。保存先 `public/graphics/candidates-20261101/ui-badges/ui-badges-a.png`

加工：1536×1024 RGBのデザイン表。図形として描き直すための参照であり、札全体をそのまま縮小して配信するための画像ではない。

参照画像：
この呼び出しへの画像添付はなし。前作の確認から言語化した共通の画風・色・用途を指示文へ指定。

実際に使った指示文（全文）：

```text
Use case: ui-mockup. UI design reference sheet1536x1024 RGB for AQUA NOTES bright daytime white-blue game. Clean flat production UI drawing rather than painterly decorative prop. Match the family of PRISM NOTES' small rectangular blue labels with white text: mature restrained, crisp flat fills, high contrast, white/blue #17314c #2a6db5 #1d4f88, tiny #c9a14a accent ONLY for exact success. These labels will be reconstructed as SVG at16-20px tall, so use simple shapes, generous interior and legible Japanese sans-serif; no thin ornate calligraphy, no drop shadows, no noisy texture. Pale off-white background. Arrange SEVEN compact horizontal category rows with clear spacing. Need ALL following sample badges, exact Japanese text: row1 one 泉. row2 four badges each saying 指定 2: normal pale blue, exact arrival blue with small gold check, excess muted orange with plus symbol, shortfall gray-blue with minus symbol. row3 four badges each saying 開 3・閉 2 in the same4 states. row4 two badges 口 太1 and 口の高さ 3. row5 eight pipe badges: 太1 中2 細3 細3〜太1 in unconnected state (WHITE fill, gray-blue edge and dark text), then same four texts in connected state (BLUE fill white text). row6 two gate badges 水門 and 水門（閉）, open blue and closed slate with clear outline icon. row7 one empty-glass badge 空. Total22 sample badges. State markers must distinguish without color alone. All words exact, no added English, no numbers outside required badge text, no logo/watermark, no character/scenery. Do not turn badges into giant decorative buttons. Candidate A: small rounded rectangular badges with corner radius3px at final18px height, simple strong outer edges and restrained paired thin border. Keep every example compact and visually related; zero leaf or scroll decorations.
```

## ui-badges-b — 隅切りの端正な札

採用：未確定。

生成原本：[originals/ui-badges-b.png](originals/ui-badges-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [ui-badges-b.png](ui-badges-b.png)：1536×1024 / RGB / 1,064,121 bytes。保存先 `public/graphics/candidates-20261101/ui-badges/ui-badges-b.png`

加工：1536×1024 RGBのデザイン表。図形として描き直すための参照であり、札全体をそのまま縮小して配信するための画像ではない。

参照画像：

- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-ef2dd011-f162-4a24-8ba1-e550e6f73d21.png`

上記がこの呼び出しで渡した画像。前作の絵はシリーズの画風の参照で、上書き対象ではない。

実際に使った指示文（全文）：

```text
Use case: ui-mockup. UI design reference sheet1536x1024 RGB for AQUA NOTES bright daytime white-blue game. Clean flat production UI drawing rather than painterly decorative prop. Match the family of PRISM NOTES' small rectangular blue labels with white text: mature restrained, crisp flat fills, high contrast, white/blue #17314c #2a6db5 #1d4f88, tiny #c9a14a accent ONLY for exact success. These labels will be reconstructed as SVG at16-20px tall, so use simple shapes, generous interior and legible Japanese sans-serif; no thin ornate calligraphy, no drop shadows, no noisy texture. Pale off-white background. Arrange SEVEN compact horizontal category rows with clear spacing. Need ALL following sample badges, exact Japanese text: row1 one 泉. row2 four badges each saying 指定 2: normal pale blue, exact arrival blue with small gold check, excess muted orange with plus symbol, shortfall gray-blue with minus symbol. row3 four badges each saying 開 3・閉 2 in the same4 states. row4 two badges 口 太1 and 口の高さ 3. row5 eight pipe badges: 太1 中2 細3 細3〜太1 in unconnected state (WHITE fill, gray-blue edge and dark text), then same four texts in connected state (BLUE fill white text). row6 two gate badges 水門 and 水門（閉）, open blue and closed slate with clear outline icon. row7 one empty-glass badge 空. Total22 sample badges. State markers must distinguish without color alone. All words exact, no added English, no numbers outside required badge text, no logo/watermark, no character/scenery. Do not turn badges into giant decorative buttons. Candidate B: shallow CHAMFERED CORNERS (cut corners), SINGLE dark-blue border not double border, subtly ivory fills for neutral and solid cobalt for connected, tiny simple square state marker at right. Slightly more architectural and compact than rounded A. Use bold readable Noto-style Japanese sans serif. Every badge is horizontal and compact; icons optional but small, prioritize text, no extra headers. Maintain all22 examples in7rows exactly as specified. No ornamental frame or filigree.

Second tool call (colour correction):
Use case: precise-object-edit. Edit target: the attached AQUA NOTES badge design sheet candidate B. Make ONLY this small color correction: in row5 the four CONNECTED PIPE badges 太1 中2 細3 細3〜太1, replace each GOLD square/check status marker with a WHITE check status marker (keep readable against blue); in row6 open 水門 badge replace GOLD square/check with WHITE. Preserve pale-gold success markers ONLY in row2 and row3 exact-arrival status badges (second badge in each of those rows). Keep all22 badge layouts, Japanese lettering, shapes, positions, blue/white colors, borders, size1536x1024, and every other pixel design unchanged as faithfully as possible. Do not add or remove anything, no new text. RGB white background. This respects series rule that gold is reserved for light/success, not ordinary connected pipes.
```
