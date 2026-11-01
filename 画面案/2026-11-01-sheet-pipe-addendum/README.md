# sheet-pipe / 追加発注 優先度1

作成：2026-11-01（日本時間）。道具：Codexの組み込み画像生成。

**全案未採用。発案者が実画面で見比べて選ぶ。これは静止したデザイン見本であり、画面への組み込み・実機検証は行っていない。**

[追加分の全体案内](../2026-11-01-priority1-addendum/README.md)

A 白い陶器 / B 青い縁のガラス管

![comparison](comparison.png)

白い陶器と透明なガラス管の2つの素材案。外縁・本体・水の層、太さ3種、4状態、L字、グラス底の接続、近接する2本、交差と札を示す。

太さの正しい値は 太1=10・中2=6.5・細3=4（盤面の座標単位）。交差を接続に変えず、合流はグラスのみ。白い点は流れの向きの表示で、水の計算単位や粒子の仕様ではない。見本の描画幅を画素から採寸して使わない。

## 候補ごとの出所と指示文

作業中に追加発注書1-2「部品と背景の境界」が追記されたため、最終候補は濃い青（#1d4f88前後）の縁と、部品の周りだけの淡い青の陰影へ更新した。透明な素材・反射・配置は保持し、背景全体を暗くする提案はしない。更新前も原本のhistoryに保存。

### sheet-pipe-a — 白い陶器の配管

採用：未確定。

候補：[表示用PNG](sheet-pipe-a.png) / 原本：[生成原本](originals/sheet-pipe-a.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-pipe/sheet-pipe-a.png`。1536×1024 RGB PNG、1,785,501 bytes。

加工：原本1536×1024を縦横比を保って1536×1024へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-bg-a.png`

初回生成と修正前の画像も `originals/` の history 連番へ保持。初回の参照と修正指示を以下に記録。

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-c64ae6e8-6f8f-4499-afe9-2cbd97a28535.png`、`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-2f50b729-19b5-47f1-b3d2-30cda576e6b5.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-5daa2876-c2f4-4eab-a66d-255b1eff0d96.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. Sheet-pipe, landscape design sheet1536x1024 RGB. Organize clearly labelled rows and panels. Include material cutaway/exploded CROSS SECTION with outer edge / inner body / blue water layers, 3 pipe widths in exact visual ratio10:6.5:4 game units (labels 太1 / 中2 / 細3), and4 states: 候補 gray-blue dashed hollow outline; つないだ・水なし solid empty pipe; 流れている blue water with moving WHITE DOT train shown in3 small sequential stills, no arrowheads baked into pipes; 太さを選べる候補 with the sample badge 細3〜太1. Show 90-degree rounded L elbow, junction into bottom of a tall transparent upright stemless glass, TWO close parallel pipes with routes kept visually distinct, and ordinary crossing with visible over/under interruption so destinations remain traceable (NOT a junction). Pipes must ONLY connect at glasses, never at crossings. Show small rectangular labels 太1/中2/細3 over pipe, white/dark text on blue/white badge as in reference. Pale sky and warm soil panels demonstrate readability both above and below ground. Use consistent cross section on straight and curved samples; main purpose precise practical drawing rules for SVG reconstruction, not scenery. Candidate A: PORCELAIN, narrow cool gray-blue outside edge, ivory ceramic wall, hollow light interior and translucent cobalt water inside; soft single highlight, modest rounded joins, understated rounded rectangular badges. White outline remains visible on bright sky and beige soil. One coherent material throughout this sheet.

Correction call:
Use case: precise-object-edit. Edit the attached AQUA NOTES PIPE DESIGN SHEET, preserve its white porcelain material, blue-and-white styling and all useful sample panels, 1536x1024. Correct exactly these technical issues: (1) In the glass-connection sample, show a tall UPRIGHT STRAIGHT-SIDED STEMLESS CYLINDRICAL GLASS, not a wine goblet; pipe comes straight UP into the BOTTOM CENTER, not into the side wall, no pipe entering from above. (2) The adjustable candidate must be one hollow DASHED constant-width pipe outline with the label 細3〜太1; do NOT draw funnel, taper, stacked different widths along one pipe or a physical expanding segment. (3) Any width-ratio heading must read exactly 10 : 6.5 : 4, and labels exactly 太1 中2 細3. (4) Underground visibility panel background must be pale warm flat SOIL #ece5d6 with subtle stone speckles, not dark rocky brown, preserve pipe readability. (5) Replace the large invented serif AQUA NOTES brand heading with the plain Japanese sheet title 配管のデザイン表. Leave all other states, samples, 3 sequential white-dot motion stills and non-connecting crossing diagrams intact. This is a design sheet with sample Japanese text, not a new gameplay layout. No new panels or objects.

Additional correction call:
Use case: precise-object-edit. IMAGE1 is edit target, entire porcelain PIPE DESIGN SHEET. IMAGE2 is supporting reference for the CORRECT bottom connection geometry only. Change ONLY the lower-row panel titled グラスへの接続: DELETE the vertical blue tube that currently runs from the TOP of that panel DOWN through the glass from above. There must be NO PIPE ABOVE THE GLASS and NO TUBE INSIDE THE GLASS. Keep a simple upright stemless cylinder; a pipe connects to its BOTTOM CENTER from BELOW, with short straight tube extending downward OUTSIDE and UNDER the bottom, like image2. To create space, the glass may be slightly shorter within this one panel only. All upper/top space above its mouth must be plain background, no tube. Keep porcelain material. Preserve all other panels, labels, pipe samples, title, typography, 1536x1024 layout and colors unchanged. Do not change any other section.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-pipe-a design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-pipe-b — 青い縁のガラス管

採用：未確定。

候補：[表示用PNG](sheet-pipe-b.png) / 原本：[生成原本](originals/sheet-pipe-b.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-pipe/sheet-pipe-b.png`。1536×1024 RGB PNG、1,702,499 bytes。

加工：原本1536×1024を縦横比を保って1536×1024へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-bg-a.png`

初回生成と修正前の画像も `originals/` の history 連番へ保持。初回の参照と修正指示を以下に記録。

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-2f50b729-19b5-47f1-b3d2-30cda576e6b5.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. Sheet-pipe, landscape design sheet1536x1024 RGB. Organize clearly labelled rows and panels. Include material cutaway/exploded CROSS SECTION with outer edge / inner body / blue water layers, 3 pipe widths in exact visual ratio10:6.5:4 game units (labels 太1 / 中2 / 細3), and4 states: 候補 gray-blue dashed hollow outline; つないだ・水なし solid empty pipe; 流れている blue water with moving WHITE DOT train shown in3 small sequential stills, no arrowheads baked into pipes; 太さを選べる候補 with the sample badge 細3〜太1. Show 90-degree rounded L elbow, junction into bottom of a tall transparent upright stemless glass, TWO close parallel pipes with routes kept visually distinct, and ordinary crossing with visible over/under interruption so destinations remain traceable (NOT a junction). Pipes must ONLY connect at glasses, never at crossings. Show small rectangular labels 太1/中2/細3 over pipe, white/dark text on blue/white badge as in reference. Pale sky and warm soil panels demonstrate readability both above and below ground. Use consistent cross section on straight and curved samples; main purpose precise practical drawing rules for SVG reconstruction, not scenery. Candidate B: CLEAR GLASS TUBES with a crisp blue outer edge, pale double refraction line and almost transparent interior; blue water visibly contained within outline, no white ceramic body. Blue-gray dashed outline for candidates, subtle chamfered rectangular badges. Clear gaps between close parallel lines and legible crossings. One coherent material throughout this sheet.

Correction call:
Use case: precise-object-edit. Edit the attached AQUA NOTES PIPE DESIGN SHEET, preserve its transparent glass material, blue-and-white styling and all useful sample panels, 1536x1024. Correct exactly these technical issues: (1) In the glass-connection sample, show a tall UPRIGHT STRAIGHT-SIDED STEMLESS CYLINDRICAL GLASS, not a wine goblet; pipe comes straight UP into the BOTTOM CENTER, not into the side wall, no pipe entering from above. (2) The adjustable candidate must be one hollow DASHED constant-width pipe outline with the label 細3〜太1; do NOT draw funnel, taper, stacked different widths along one pipe or a physical expanding segment. (3) Any width-ratio heading must read exactly 10 : 6.5 : 4, and labels exactly 太1 中2 細3. (4) Underground visibility panel background must be pale warm flat SOIL #ece5d6 with subtle stone speckles, not dark rocky brown, preserve pipe readability. (5) Replace the large invented serif AQUA NOTES brand heading with the plain Japanese sheet title 配管のデザイン表. Leave all other states, samples, 3 sequential white-dot motion stills and non-connecting crossing diagrams intact. This is a design sheet with sample Japanese text, not a new gameplay layout. No new panels or objects.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-pipe-b design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

