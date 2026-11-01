# sheet-ui-play / 追加発注 優先度1

作成：2026-11-01（日本時間）。道具：Codexの組み込み画像生成。

**全案未採用。発案者が実画面で見比べて選ぶ。これは静止したデザイン見本であり、画面への組み込み・実機検証は行っていない。**

[追加分の全体案内](../2026-11-01-priority1-addendum/README.md)

A 陶器の縁 / B すりガラスの縁

![comparison-edit](comparison-edit.png)

![comparison-result](comparison-result.png)

![comparison-pc](comparison-pc.png)

各A/Bにスマホ編集中・スマホ結果・PCの3枚。スマホは公開版の配置を参照し、プレイと結果で盤面を縮める提案はしない。PCは追加発注書4-1の指定どおり前作の左盤面・右条件列の配置を参照した。

公開版の測定値は [layout-reference.json](../2026-11-01-priority1-addendum/layout-reference.json)。画面の見本は配置の骨組みと素材を示すもので、採用後は既存の矩形・文字サイズへ書式を合わせる。生成画像の画素と実画面の矩形が完全一致したという検査結果ではない。

結果画像の100点・3本・指定2などは表示用の仮の文字。出題・計算・上限値・得点の変更や、その配管が満点になるという検証を意味しない。

## 候補ごとの出所と指示文

作業中に追加発注書1-2「部品と背景の境界」が追記されたため、最終候補は濃い青（#1d4f88前後）の縁と、部品の周りだけの淡い青の陰影へ更新した。透明な素材・反射・配置は保持し、背景全体を暗くする提案はしない。更新前も原本のhistoryに保存。

### sheet-ui-play-a-edit — 陶器の縁・編集中

採用：未確定。

候補：[表示用PNG](sheet-ui-play-a-edit.png) / 原本：[生成原本](originals/sheet-ui-play-a-edit.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-a-edit.png`。1170×2532 RGB PNG、2,690,418 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

直前の公開版スマホ編集中スクリーンショット（配置参照）と docs/reference/prism-v0.100.0-q3-layout.png（シリーズ参照）。CUAで390×844の配置を確認し、指示文に3倍の座標を記録。

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-69732dcf-db49-4d6c-ba38-82c1d196b1f5.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PLAY EDITING screen, a single ULTRA-TALL portrait1170x2532 (aspect390:844), RGB, no phone frame or status bar. Input1 is CURRENT AQUA MOBILE SCREEN and the EXACT LAYOUT TEMPLATE, input2 is PRISM MOBILE SCREEN for series styling only. Retain Input1 component positions, proportions, widths/heights; do NOT copy prism gameplay, prism node layout or night colors. At1170x2532: header y0-141 with 2-line AQUA/NOTES at x48 left, 記録 / 音オン / ☰ at right; stage row y150-309 ‹ 1 まっすぐ届ける ∨ ›, subline 選択プレイ・お試し; condition card x48 y324 w1074 h300 with クリア条件, ふりかえり top right, 噴水盤に 2 届ける and 配管 0本. Board fixed x51 y726 w1068 h1356, preserve full tall panel and its lower SOIL zone starting79% down; same source LEFT, two tall stemless GLASSES center, BASIN right, pipe routes below ground from original screenshot; do not widen, shrink or rearrange board or game parts. Subtle edge-only white fantasy garden sky behind game parts, light low-contrast center. GUIDE row x48 y2109 w1074 h200: tiny same-series water spirit LEFT of exact text 水は高いところから低いところへ流れます。流れる量＝高さの差÷細さ。 Buttons remain at bottom RIGHT: 配管クリア x513 y2316 w315 h132, 水を流す x852 y2316 w270 h132. Preserve empty lower left space; do not center or enlarge buttons. Footer v0.13.0 試作 © SIKUMI LAB at y2480. Remove black UPDATE AVAILABLE overlay from template only, it is temporary; do not move any remaining element into its place. All current visual styling temporary: redesign color, edges and surfaces while maintaining this rigid layout. Editing state: source has water, glasses EMPTY, pipes not flowing, no success fountain, rainbow or result panel. White/blue theme, quiet flat functional UI with painterly board. No new legend, resources, controls or invented features. Candidate A: white porcelain cards, small rounded8px corners, fine cool blue-gray stroke, clear cobalt primary button. Simple Montserrat two-line AQUA/NOTES with NO emblem.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-a-edit design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-ui-play-a-pc — 陶器の縁・PC

採用：未確定。

候補：[表示用PNG](sheet-ui-play-a-pc.png) / 原本：[生成原本](originals/sheet-ui-play-a-pc.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-a-pc.png`。1920×1080 RGB PNG、2,447,422 bytes。

加工：原本1672×941を縦横比を保って1919×1080へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\prism-pc.webp`
- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-69732dcf-db49-4d6c-ba38-82c1d196b1f5.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-4657842d-9558-4c1d-908b-cc63a37cf1ad.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-403fa8fc-9029-4c6a-99c5-1a998bad1446.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PLAY PC editing view. SINGLE full desktop screen1920x1080 RGB landscape16:9, no device/browser chrome. Input1 PRISM PC layout is the EXACT STRUCTURE reference; input2 matching AQUA mobile candidate is style/parts reference. Follow specified PC TWO-COLUMN structure (do NOT reproduce current centered one-column AQUA PC placeholder). Header x24..1896 y16..90: 2-line AQUA/NOTES logo LEFT and tagline 水をつなぎ、グラスを鳴らす。 to its right; action buttons 記録 / 音オン / 更新 / ☰ at far right. Large BOARD frame left x24 y110 w1434 h900. Background fills entire board, bright low-contrast white-stone garden and open pale sky at center. Same AQUA source at left, two upright tall stemless glasses at center and basin right, soil cross-section bottom21%, pipe paths below ground, keep original glass proportions and object relationships; no prisms/bells/star gameplay copied from PRISM. Board toolbar inside bottom frame strip y935-1010, contains 配管クリア then − / 全体 / ＋ at right. Small legend inside board lower left つないだ配管 / つなげる配管. Sidebar RIGHT x1482 y110 w414 h900: group title お試し・湧き水の庭, stage navigation ‹ 1 まっすぐ届ける ∨ ›, condition section この課題の条件 with ⓘ, exact condition 噴水盤に 2 届ける; resource block 配管の本数 / 上限6本 / 使用0本 / 残り6本 plus small 桶の残り2 / NGの残り20; status 配管をつないでください。; small guide row water spirit to left of text; main large cobalt 水を流す anchored near sidebar bottom and small disabled 停止 below. Footer © SIKUMI LAB v0.13.0 試作. All numbers are specimen strings and no changes to scoring/limits are proposed. Editing state, empty glasses, no fountain/rainbow/result overlay, no new controls beyond listed. Landscape UI remains readable, restrained elegant white-blue daytime series, no black huge panels, no invented menus. Candidate A: same porcelain white, small rounded corners and thin blue-gray strokes as the attached mobile candidate.

Additional correction call:
Use case: precise-object-edit. Make ONLY2 small style corrections to attached AQUA PC design. Preserve absolutely all layout, typography, object positions, panel sizes and other colors. The ordinary HEADER 更新 button currently has a GOLD FILL; change its fill to WHITE/very pale blue and its text and fine border to DARK BLUE, matching other neutral header controls. Ordinary resource remaining count 6 must also be BLUE rather than gold. Gold should remain only as tiny natural reflected highlights on fantasy stone/glass materials, not normal UI states. Add/retain a tiny footer on the lower-right blank margin exactly © SIKUMI LAB v0.13.0 試作, without changing sidebar/board dimensions. No other changes, no new content. Keep landscape1920x1080 aspect.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-a-pc design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-ui-play-a-result — 陶器の縁・結果

採用：未確定。

候補：[表示用PNG](sheet-ui-play-a-result.png) / 原本：[生成原本](originals/sheet-ui-play-a-result.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-a-result.png`。1170×2532 RGB PNG、2,489,937 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-69732dcf-db49-4d6c-ba38-82c1d196b1f5.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-cd31b76d-d02a-44b6-ae57-6d9d861d8c4f.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. Use case: precise-object-edit. Edit attached AQUA mobile EDITING design to create its matching RESULT screen. KEEP every header/stage/card/board/guide/button rectangle exactly in the same position and size, identical1170x2532 ultratall aspect, no phone frame, no reflow or shrinking board. Only change water/run state and add a lower overlay. Source stays left, glass1 and glass2 and basin stay in exact locations, same pipe routes. Show a modest amount of blue water in glasses exactly aligned to a left tick, narrow pale-gold musical light; a small clear fountain rises from right basin with a soft shallow rainbow above it, understated. Replace 配管0本 with 配管3本 as a fictional design sample, not a calculation specification. Add a SINGLE floating white RESULT TOAST anchored to bottom panel, x48..1122 y~2040..2450, overlapping/hiding guide and lower buttons, while leaving board frame and glass positions untouched. Header 100点 with a tiny 最高点 mark, dismiss × at upper right. Body row 指定2 / 届いた2, small 最少3本. Text グラスのふちをなぞると、音を聞き直せます。 Small disclosure くわしい記録. Footer three aligned buttons 解説 / もう一度 / 次へ, main blue 次へ at right. Keep text short to fit toast, no huge trophy/characters or second modal. Main original lower buttons obscured beneath overlay, not relocated. Keep original footer outside toast. Do not introduce collection, achievements, statistics, currencies, extra levels or new buttons. Palette white and blue, gold only for success/musical glints. This is a visual sample, all numbers are sample strings.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-a-result design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces, fountain jet and rainbow subtle edges) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-ui-play-b-edit — すりガラスの縁・編集中

採用：未確定。

候補：[表示用PNG](sheet-ui-play-b-edit.png) / 原本：[生成原本](originals/sheet-ui-play-b-edit.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-b-edit.png`。1170×2532 RGB PNG、2,638,598 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

直前の公開版スマホ編集中スクリーンショット（配置参照）と docs/reference/prism-v0.100.0-q3-layout.png（シリーズ参照）。CUAで390×844の配置を確認し、指示文に3倍の座標を記録。

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-2800039e-f73a-4721-875d-20b51bf3e862.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PLAY EDITING screen, a single ULTRA-TALL portrait1170x2532 (aspect390:844), RGB, no phone frame or status bar. Input1 is CURRENT AQUA MOBILE SCREEN and the EXACT LAYOUT TEMPLATE, input2 is PRISM MOBILE SCREEN for series styling only. Retain Input1 component positions, proportions, widths/heights; do NOT copy prism gameplay, prism node layout or night colors. At1170x2532: header y0-141 with 2-line AQUA/NOTES at x48 left, 記録 / 音オン / ☰ at right; stage row y150-309 ‹ 1 まっすぐ届ける ∨ ›, subline 選択プレイ・お試し; condition card x48 y324 w1074 h300 with クリア条件, ふりかえり top right, 噴水盤に 2 届ける and 配管 0本. Board fixed x51 y726 w1068 h1356, preserve full tall panel and its lower SOIL zone starting79% down; same source LEFT, two tall stemless GLASSES center, BASIN right, pipe routes below ground from original screenshot; do not widen, shrink or rearrange board or game parts. Subtle edge-only white fantasy garden sky behind game parts, light low-contrast center. GUIDE row x48 y2109 w1074 h200: tiny same-series water spirit LEFT of exact text 水は高いところから低いところへ流れます。流れる量＝高さの差÷細さ。 Buttons remain at bottom RIGHT: 配管クリア x513 y2316 w315 h132, 水を流す x852 y2316 w270 h132. Preserve empty lower left space; do not center or enlarge buttons. Footer v0.13.0 試作 © SIKUMI LAB at y2480. Remove black UPDATE AVAILABLE overlay from template only, it is temporary; do not move any remaining element into its place. All current visual styling temporary: redesign color, edges and surfaces while maintaining this rigid layout. Editing state: source has water, glasses EMPTY, pipes not flowing, no success fountain, rainbow or result panel. White/blue theme, quiet flat functional UI with painterly board. No new legend, resources, controls or invented features. Candidate B: frosted white-blue panels with very small clipped/chamfered corners, cool crisp blue rim, restrained glass reflections. Same 2-line geometric logo and control sizes, do not add a giant droplet.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-b-edit design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-ui-play-b-pc — すりガラスの縁・PC

採用：未確定。

候補：[表示用PNG](sheet-ui-play-b-pc.png) / 原本：[生成原本](originals/sheet-ui-play-b-pc.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-b-pc.png`。1920×1080 RGB PNG、2,332,225 bytes。

加工：原本1672×941を縦横比を保って1919×1080へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\prism-pc.webp`
- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-2800039e-f73a-4721-875d-20b51bf3e862.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-43672f6d-b6ab-4fd3-b996-4e000f1dd862.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-09f09b77-c968-4d12-a2b3-76041d43a8a9.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PLAY PC editing view. SINGLE full desktop screen1920x1080 RGB landscape16:9, no device/browser chrome. Input1 PRISM PC layout is the EXACT STRUCTURE reference; input2 matching AQUA mobile candidate is style/parts reference. Follow specified PC TWO-COLUMN structure (do NOT reproduce current centered one-column AQUA PC placeholder). Header x24..1896 y16..90: 2-line AQUA/NOTES logo LEFT and tagline 水をつなぎ、グラスを鳴らす。 to its right; action buttons 記録 / 音オン / 更新 / ☰ at far right. Large BOARD frame left x24 y110 w1434 h900. Background fills entire board, bright low-contrast white-stone garden and open pale sky at center. Same AQUA source at left, two upright tall stemless glasses at center and basin right, soil cross-section bottom21%, pipe paths below ground, keep original glass proportions and object relationships; no prisms/bells/star gameplay copied from PRISM. Board toolbar inside bottom frame strip y935-1010, contains 配管クリア then − / 全体 / ＋ at right. Small legend inside board lower left つないだ配管 / つなげる配管. Sidebar RIGHT x1482 y110 w414 h900: group title お試し・湧き水の庭, stage navigation ‹ 1 まっすぐ届ける ∨ ›, condition section この課題の条件 with ⓘ, exact condition 噴水盤に 2 届ける; resource block 配管の本数 / 上限6本 / 使用0本 / 残り6本 plus small 桶の残り2 / NGの残り20; status 配管をつないでください。; small guide row water spirit to left of text; main large cobalt 水を流す anchored near sidebar bottom and small disabled 停止 below. Footer © SIKUMI LAB v0.13.0 試作. All numbers are specimen strings and no changes to scoring/limits are proposed. Editing state, empty glasses, no fountain/rainbow/result overlay, no new controls beyond listed. Landscape UI remains readable, restrained elegant white-blue daytime series, no black huge panels, no invented menus. Candidate B: same frosted white surface and small chamfered edges with clear blue rim as attached mobile candidate.

Additional correction call:
Use case: precise-object-edit. Make ONLY2 small style corrections to attached AQUA PC design. Preserve absolutely all layout, typography, object positions, panel sizes and other colors. The ordinary HEADER 更新 button currently has a GOLD FILL; change its fill to WHITE/very pale blue and its text and fine border to DARK BLUE, matching other neutral header controls. Ordinary resource remaining count 6 must also be BLUE rather than gold. Gold should remain only as tiny natural reflected highlights on fantasy stone/glass materials, not normal UI states. Add/retain a tiny footer on the lower-right blank margin exactly © SIKUMI LAB v0.13.0 試作, without changing sidebar/board dimensions. No other changes, no new content. Keep landscape1920x1080 aspect.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-b-pc design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-ui-play-b-result — すりガラスの縁・結果

採用：未確定。

候補：[表示用PNG](sheet-ui-play-b-result.png) / 原本：[生成原本](originals/sheet-ui-play-b-result.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-play/sheet-ui-play-b-result.png`。1170×2532 RGB PNG、2,568,331 bytes。

加工：原本853×1844を縦横比を保って1170×2529へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上1px）。

参照画像：

- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-2800039e-f73a-4721-875d-20b51bf3e862.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-dca6a6f8-2802-4bf3-90fa-ab94e64ef97a.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. Use case: precise-object-edit. Edit attached AQUA mobile EDITING design to create its matching RESULT screen. KEEP every header/stage/card/board/guide/button rectangle exactly in the same position and size, identical1170x2532 ultratall aspect, no phone frame, no reflow or shrinking board. Only change water/run state and add a lower overlay. Source stays left, glass1 and glass2 and basin stay in exact locations, same pipe routes. Show a modest amount of blue water in glasses exactly aligned to a left tick, narrow pale-gold musical light; a small clear fountain rises from right basin with a soft shallow rainbow above it, understated. Replace 配管0本 with 配管3本 as a fictional design sample, not a calculation specification. Add a SINGLE floating white RESULT TOAST anchored to bottom panel, x48..1122 y~2040..2450, overlapping/hiding guide and lower buttons, while leaving board frame and glass positions untouched. Header 100点 with a tiny 最高点 mark, dismiss × at upper right. Body row 指定2 / 届いた2, small 最少3本. Text グラスのふちをなぞると、音を聞き直せます。 Small disclosure くわしい記録. Footer three aligned buttons 解説 / もう一度 / 次へ, main blue 次へ at right. Keep text short to fit toast, no huge trophy/characters or second modal. Main original lower buttons obscured beneath overlay, not relocated. Keep original footer outside toast. Do not introduce collection, achievements, statistics, currencies, extra levels or new buttons. Palette white and blue, gold only for success/musical glints. This is a visual sample, all numbers are sample strings.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-ui-play-b-result design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces, fountain jet and rainbow subtle edges) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

