# sheet-water / 追加発注 優先度1

作成：2026-11-01（日本時間）。道具：Codexの組み込み画像生成。

**全案未採用。発案者が実画面で見比べて選ぶ。これは静止したデザイン見本であり、画面への組み込み・実機検証は行っていない。**

[追加分の全体案内](../2026-11-01-priority1-addendum/README.md)

A 澄んだ水と細い光 / B 青い輪郭と反射

![comparison](comparison.png)

水・目盛り・前回水位・目盛りに合う光・目盛りの間の揺れ・空・噴水盤の指定量の見え方。

淡い金の光は音階の目印で、正解の印ではない。目盛りへの一致の判定や流れる量は既存の計算を保持する。水面・目盛りの正確な位置は計算値から描き、見本の画素から判定しない。

## 候補ごとの出所と指示文

作業中に追加発注書1-2「部品と背景の境界」が追記されたため、最終候補は濃い青（#1d4f88前後）の縁と、部品の周りだけの淡い青の陰影へ更新した。透明な素材・反射・配置は保持し、背景全体を暗くする提案はしない。更新前も原本のhistoryに保存。

### sheet-water-a — 澄んだ水と細い光

採用：未確定。

候補：[表示用PNG](sheet-water-a.png) / 原本：[生成原本](originals/sheet-water-a.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-water/sheet-water-a.png`。1536×1024 RGB PNG、1,416,104 bytes。

加工：原本1536×1024を縦横比を保って1536×1024へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-bg-a.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-5621dc23-207f-4f56-b265-5e41660fd1d3.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-6b66a110-cf67-4ff6-a969-cbc10fadc6cb.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-WATER landscape reference1536x1024 RGB, title 水と目盛りのデザイン表 (plain Japanese sans-serif, do not invent a display brand logo). Tidy 3rows of technical illustrated samples, sparse restrained labels. Tall straight-sided STEMLESS cylinders exactly front-on, regular evenly spaced short horizontal TICKS on LEFT outside each glass. Include low and high water glass side by side, water shades deepen gently with depth, crisp subtle ripple surface; a hollow ivory spring reservoir with water; thin PALE GOLD DASHED line for PREVIOUS water level labelled 前回の水面, distinguish from current solid blue surface; glass exactly ON a tick glowing with very narrow soft pale-gold edge, label 目盛りに合う; glass surface BETWEEN ticks with gentle wave line labelled 目盛りの間; EMPTY transparent glass labelled 空; three shallow white fountain basins labelled 指定まで / 多い / 少ない with a fixed target mark and water respectively exactly at/above/below that mark, plus small ✓ / + / − indicators. All basin targets same height, water levels differ. Gold glass glow means MUSICAL SCALE ALIGNMENT ONLY, never an answer or puzzle-clear marker; text 音階の目印、正解の印ではない in small readable note. Use pale sky #f4f9fd and #e2eef8 for samples, no perspective bars or landscape interfering, no musical note names, no numbers/ticks inside water, no goblet stems, no overflowing giant waterfall. Candidate A: highly transparent water with only a subtle cyan gradient, fine silver-blue glass edge and one controlled narrow golden glow line. Calm almost-flat clean surfaces, delicate drawing, neat rounded white labels.

Additional correction call:
Use case: precise-object-edit. Edit the attached WATER DESIGN SHEET. Make ONLY these semantic corrections while retaining layout, all glass shapes and drawing style, 1536x1024: Remove ALL upward FOUNTAIN JETS/spouts from the three shallow basin samples and from the spring-reservoir sample. The three basins illustrate target/over/under water levels, NOT completed animations, so their water surface may have subtle ripples only, NO jet above it. Spring remains a hollow stone reservoir holding still water, NO spout. For the sample labelled 目盛りに合う, shift its CURRENT SOLID BLUE water surface exactly onto the adjacent highlighted tick; keep PREVIOUS gold DASHED waterline distinct at another level. Preserve empty glass, between-ticks gentle ripple, all existing captions, three basin water levels and target mark comparisons, colors, panels and text. No new objects or text.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-water-a design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

### sheet-water-b — 青い輪郭と水面の反射

採用：未確定。

候補：[表示用PNG](sheet-water-b.png) / 原本：[生成原本](originals/sheet-water-b.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-water/sheet-water-b.png`。1536×1024 RGB PNG、1,391,535 bytes。

加工：原本1536×1024を縦横比を保って1536×1024へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-bg-a.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-28b7094e-6064-4a3a-af90-466d62a331af.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-WATER landscape reference1536x1024 RGB, title 水と目盛りのデザイン表 (plain Japanese sans-serif, do not invent a display brand logo). Tidy 3rows of technical illustrated samples, sparse restrained labels. Tall straight-sided STEMLESS cylinders exactly front-on, regular evenly spaced short horizontal TICKS on LEFT outside each glass. Include low and high water glass side by side, water shades deepen gently with depth, crisp subtle ripple surface; a hollow ivory spring reservoir with water; thin PALE GOLD DASHED line for PREVIOUS water level labelled 前回の水面, distinguish from current solid blue surface; glass exactly ON a tick glowing with very narrow soft pale-gold edge, label 目盛りに合う; glass surface BETWEEN ticks with gentle wave line labelled 目盛りの間; EMPTY transparent glass labelled 空; three shallow white fountain basins labelled 指定まで / 多い / 少ない with a fixed target mark and water respectively exactly at/above/below that mark, plus small ✓ / + / − indicators. All basin targets same height, water levels differ. Gold glass glow means MUSICAL SCALE ALIGNMENT ONLY, never an answer or puzzle-clear marker; text 音階の目印、正解の印ではない in small readable note. Use pale sky #f4f9fd and #e2eef8 for samples, no perspective bars or landscape interfering, no musical note names, no numbers/ticks inside water, no goblet stems, no overflowing giant waterfall. Candidate B: stronger cool-blue outer glass contour and gently layered pale-blue water with a defined reflective meniscus. A thin luminous waterline and tiny sparse specular gleams, compact chamfered neutral labels. No gold beyond musical alignment and previous-level guide.

Confirmed boundary direction (addendum1-2):
Use case: precise-object-edit. Edit ONLY material EDGE SEPARATION on the attached AQUA NOTES sheet-water-b design, in response to a newly confirmed art direction. Preserve all shapes, component positions, dimensions, routes, water levels, text, buttons, samples and layout EXACTLY. All white/transparent GAME PARTS (glass vessel outlines, ivory spring reservoir, fountain basin, pipes, water surfaces) must be cleanly readable over BRIGHT backdrop: add a restrained DARK BLUE binding contour around their silhouette, approximately #1d4f88 (not black), fine but clearly present at small final size, about1.3-1.8 screen px on full screen views. Keep an inner white/glass highlight and transparent refraction intact; do NOT make glass opaque or flatten its material. Add only a very soft pale BLUE contact/ambient halo immediately around EACH PART, not a surrounding rectangle. Do NOT darken entire background, panel or scene. No strong cartoon outline, heavy glow, black shadow, new objects or changed sizes. Water's current surface edge dark blue and slight blue local shadow; pale-gold musical alignment lights remain delicate. Do NOT outline Japanese text, logo, human guide, ordinary UI controls or all scenery. Header and footer text remain unchanged. Correct blue contour and local pale shadow only, same canvas aspect and ALL existing graphic content. This is final material separation refinement; no text or logic changes.
```

