# sheet-ui-title / 追加発注 優先度1

作成：2026-11-01（日本時間）。道具：Codexの組み込み画像生成。

**全案未採用。発案者が実画面で見比べて選ぶ。これは静止したデザイン見本であり、画面への組み込み・実機検証は行っていない。**

[追加分の全体案内](../2026-11-01-priority1-addendum/README.md)

A 文字だけのロゴ / B 小さなしずく

![comparison](comparison.png)

現在の8ボタンの並びを保持する参照とし、ロゴの上に小さく SIKUMI NOTES 02 を追加。Aは装飾なし、Bはしずく付き。見本のv0.13.0は参照した版であり、新しい公開版ではない。

## 候補ごとの出所と指示文

### sheet-ui-title-a — 陶器の白と文字だけのロゴ

採用：未確定。

候補：[表示用PNG](sheet-ui-title-a.png) / 原本：[生成原本](originals/sheet-ui-title-a.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-title/sheet-ui-title-a.png`。1170×2532 RGB PNG、2,763,604 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

公開版v0.13.0のタイトル画面（CUAで390×844表示）。ボタン8個の矩形を読み、指示文に3倍の座標を記録。

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-4ed593ac-7a4d-409f-b990-2c8ef7927286.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-TITLE. Input is CURRENT AQUA title screen, use it as RIGID LAYOUT TEMPLATE. Create a single ultratall portrait1170x2532 RGB (aspect390:844), no phone outline or status bar. Preserve every logo/button/copyright location and dimensions. Retain same bright painterly garden background and all existing objects in scene; change UI surfaces and wordmark finish only. Remove black update-available overlay at bottom, leaving background visible, do not move elements into its place. Add the specifically requested small series text SIKUMI NOTES 02 ABOVE the existing two-line geometric MONTSERRAT AQUA / NOTES wordmark; series line small, work logo remains same size/position at about y255-435, no serif. Tagline 水をつなぎ、グラスを鳴らす。（仮） at about y531. EXACT button rectangles at3x template scale: x48 y639 w1074 h174 チュートリアル; x48 y843 w1074 h174 連続プレイ; row3 y1047 h144: x48 w522 選択プレイ and x600 w522 自由作成（準備中） disabled; row4 y1221 h144: パーツの説明 and 遊び方と概要 in SAME2columns; row5 y1395 h144: プレイ画面へ and 更新 in SAME2columns. Gap between rows30px. Do NOT add large panels, different button groups, extra headings, controls or change wording. Tutorial selected main button cobalt white text; other enabled buttons white dark-blue text, disabled visibly muted. Footer centered © SIKUMI LAB v0.13.0 試作 around y1725; retain scene below it. No additional series label inside buttons. White-blue daytime sister of PRISM NOTES, elegant readable restrained, preserve current hierarchy and board-free title composition. Candidate A: porcelain-white buttons with small rounded corners8px at device scale, thin blue-gray border, gentle top edge highlight only. PURE typographic 2line AQUA/NOTES with no emblem. No gold outlines except a tiny naturally sunlit edge.

Additional correction call:
Use case: precise-object-edit. Edit ONLY ONE button label on attached AQUA title screen. The LEFT HALF-WIDTH button in the FIRST TWO-COLUMN ROW, below the full-width 連続プレイ button and beside disabled 自由作成（準備中）, incorrectly repeats 連続プレイ. Replace ONLY that left half-width button text with exact 選択プレイ. Keep the FULL-WIDTH second button above reading 連続プレイ. Do not move, resize, redraw or restyle any button or text besides that one label. Keep all other lettering, series line SIKUMI NOTES 02, AQUA/NOTES logo, background and every element unchanged. No new labels or layout changes.
```

### sheet-ui-title-b — すりガラスと小さなしずく

採用：未確定。

候補：[表示用PNG](sheet-ui-title-b.png) / 原本：[生成原本](originals/sheet-ui-title-b.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-title/sheet-ui-title-b.png`。1170×2532 RGB PNG、2,848,832 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

公開版v0.13.0のタイトル画面（CUAで390×844表示）。ボタン8個の矩形を読み、指示文に3倍の座標を記録。

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-TITLE. Input is CURRENT AQUA title screen, use it as RIGID LAYOUT TEMPLATE. Create a single ultratall portrait1170x2532 RGB (aspect390:844), no phone outline or status bar. Preserve every logo/button/copyright location and dimensions. Retain same bright painterly garden background and all existing objects in scene; change UI surfaces and wordmark finish only. Remove black update-available overlay at bottom, leaving background visible, do not move elements into its place. Add the specifically requested small series text SIKUMI NOTES 02 ABOVE the existing two-line geometric MONTSERRAT AQUA / NOTES wordmark; series line small, work logo remains same size/position at about y255-435, no serif. Tagline 水をつなぎ、グラスを鳴らす。（仮） at about y531. EXACT button rectangles at3x template scale: x48 y639 w1074 h174 チュートリアル; x48 y843 w1074 h174 連続プレイ; row3 y1047 h144: x48 w522 選択プレイ and x600 w522 自由作成（準備中） disabled; row4 y1221 h144: パーツの説明 and 遊び方と概要 in SAME2columns; row5 y1395 h144: プレイ画面へ and 更新 in SAME2columns. Gap between rows30px. Do NOT add large panels, different button groups, extra headings, controls or change wording. Tutorial selected main button cobalt white text; other enabled buttons white dark-blue text, disabled visibly muted. Footer centered © SIKUMI LAB v0.13.0 試作 around y1725; retain scene below it. No additional series label inside buttons. White-blue daytime sister of PRISM NOTES, elegant readable restrained, preserve current hierarchy and board-free title composition. Candidate B: frosted-white buttons with tiny cut/chamfered corners and a single clear-blue rim, very subtle glass reflection, little extra ornament. Add ONE tiny blue droplet/ripple beside Q tail without replacing letter, keep same logo width/height. No gold filled buttons.
```

