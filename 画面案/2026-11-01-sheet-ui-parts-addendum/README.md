# sheet-ui-parts / 追加発注 優先度1

作成：2026-11-01（日本時間）。道具：Codexの組み込み画像生成。

**全案未採用。発案者が実画面で見比べて選ぶ。これは静止したデザイン見本であり、画面への組み込み・実機検証は行っていない。**

[追加分の全体案内](../2026-11-01-priority1-addendum/README.md)

A 白い陶器の面 / B すりガラスの面

![comparison](comparison.png)

ボタン4種×4状態、条件・面の切り替え、選択・予想・結果の札、下から出る4種のシート、精霊の案内、更新案内を収録。金の枠は案内で押してほしい状態。

**Bの主表の予想欄は2択に見えるため、その欄だけは下記の「B案・予想3択の拡大見本」を使う。正しい構成は「1届く・2届く・3届く」の3択。2択への仕様変更案ではない。**

![B・予想3択の拡大見本](sheet-ui-parts-b-prediction-detail.png)

画像の細かな文言・数値は表示見本。メニュー項目や課題名を追加する指示ではない。採用後は実際の文言と計算結果を重ねる。小さく描かれた文字の誤字・省略まで取り込まない。

## 候補ごとの出所と指示文

### sheet-ui-parts-a — 白い陶器の縁と青い面

採用：未確定。

候補：[表示用PNG](sheet-ui-parts-a.png) / 原本：[生成原本](originals/sheet-ui-parts-a.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-parts/sheet-ui-parts-a.png`。1536×2048 RGB PNG、2,168,942 bytes。

加工：原本1024×1536を縦横比を保って1365×2048へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左85px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-spirit-b.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`
- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-c5a614e5-4b25-483d-b049-9000091d8e1a.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-60caa8a0-bd23-4c9b-a0ab-50b4f2557cd8.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-f4ae0007-d3cc-44bc-bf3f-49fd952fccfe.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PARTS portrait1536x2048 RGB design specification sheet, tidy grid of real UI components with sufficient spacing, labelled sections in Japanese. No phone frame. Title UI部品のデザイン表. Seven sections: (1) BUTTONS four sizes 大 / ふつう / 小 / 丸い選択肢, each in four states ふつう / 押せない / 選んでいる / 案内で押してほしい; last state ONLY pale-gold tutorial outline, selected BLUE, disabled muted but readable. Preserve usable 44px touch height at device scale. (2) CONDITION CARD sample クリア条件 / 噴水盤に 2 届ける / 桶 2・配管 3本・NG 残り20回, a small ふりかえり control in title row. (3) STAGE SWITCHER ‹ 1 まっすぐ届ける ∨ › and small subline 選択プレイ・お試し. (4) TOASTS include selection options 太1 中2 細3; prediction question どれだけ届く？ choices 1 届く / 2 届く / 3 届く and note 選んでから水が流れます; THREE result variants 100点 / クリア / NG with small 最高点 and 最少 marks, outlet row 指定 2・届いた 2 for success and 届いた 1 for NG; rows 解説, 記録, footerbuttons もう一度 / 次へ or 配管を見直す for NG. Result dismiss × at upper right. (5) BOTTOM SHEETS four miniature panels メニュー / 記録 / 面の一覧 / レベルの選択; show same family of surfaces and distinct headers, level choices フリー and ビギナー. (6) GUIDE ROW with small humanoid WATER SPIRIT matching attached guide asset on LEFT and 2-line advice on RIGHT. (7) UPDATE NOTICE 新しい版があります / 更新する. Simple consistent blue line icons, no extra gameplay. White/blue surfaces and dark ink labels, design must be reproducible in CSS/SVG, not textured impossible-to-read fantasy ornament. Candidate A: ivory porcelain-white cards with small rounded corners8px at device scale, thin blue-gray stroke and subtle upper edge highlight. Solid cobalt primary buttons, neutral white secondary buttons. Keep quiet and clear, no gold button fills.

Additional correction call:
Use case: precise-object-edit. Edit attached UI COMPONENT DESIGN SHEET, preserve its overall grid, rounded porcelain visual style, colors, state examples, component dimensions and portrait composition. Correct SAMPLE TEXT and omissions so this visual proposal cannot introduce new functionality: (1) Guide row sentence must be exactly 水は高いところから低いところへ流れます。 Delete any claim about pipe thickness changing the distance water reaches. (2) In メニュー miniature show ONLY タイトルへ / 記録 / パーツの説明 / 遊び方と概要 / 調整. Remove 用語集, ホーム, お知らせ and all other invented entries. In 記録 miniature replace all コレクション/実績/メダル/統計/プレイ履歴 menu entries with a small plain table header 面・最高点・最少 and one sample row 1・100点・3本. Do not invent new collection or achievement features. (3) Level labels EXACTLY フリー and ビギナー. (4) Prediction sample must show THREE choices 1 届く / 2 届く / 3 届く with 選んでから水が流れます。 Keep or add a compact separate selection sample with 太1 / 中2 / 細3 inside section4 without altering other section positions. (5) THREE RESULT cards 100点 / クリア / NG retained. In NG card, footer has 解説 and 配管を見直す only, keep the unused third/right NEXT slot empty, no もう一度 or 次へ on NG. Success cards retain もう一度 / 次へ, small 最高点 / 最少 marks. (6) Gold tutorial-outline state must appear for each of4 button sizes; ordinary selected buttons BLUE. (7) Do not print invented numeric component heights as a new size specification: remove parenthetical 高さXXpx labels only, keep actual drawn button shapes unchanged. All other content and layout untouched. No extra headings or functionality.

Additional correction call:
Use case: precise-object-edit. Edit ONLY ONE short text line in the attached UI component sheet. In SECTION2 条件カード, directly below its クリア条件 header, the current text wrongly reads 水は高いところから低いところへ流れます。. Replace ONLY that line with EXACTLY 噴水盤に 2 届ける, as the actual puzzle condition; make the numeral2 slightly larger blue as in original intent. Do NOT change the bottom GUIDE row, which must continue to say 水は高いところから低いところへ流れます。. Preserve every other pixel design, words, layout, control, all16 button states, and portrait dimensions. This is one line correction only.
```

### sheet-ui-parts-b — すりガラスと隅切りの面

採用：未確定。

候補：[表示用PNG](sheet-ui-parts-b.png) / 原本：[生成原本](originals/sheet-ui-parts-b.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-parts/sheet-ui-parts-b.png`。1536×2048 RGB PNG、2,008,749 bytes。

加工：原本1024×1536を縦横比を保って1365×2048へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左85px、上0px）。

参照画像：

- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-spirit-b.png`
- `C:\Users\user\.codex\visualizations\2026\11\01\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\addendum-work\references\aqua-badges-a.png`
- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-c5a614e5-4b25-483d-b049-9000091d8e1a.png`

追加修正の参照と指示：

- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-6df7e01f-a87f-4481-8ff9-5992ea613b89.png`
- 参照：`C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-3a85e801-9825-44f2-b7e1-4dc44253bad1.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. AQUA NOTES daytime sister of PRISM NOTES: serene mature elegant fantasy with clean readable UI, pearl white #f4f9fd, soft sky blue #e2eef8, ink #17314c, cobalt #2a6db5, ice blue #4b9ad8, restrained pale gold #c9a14a ONLY for musical alignment or tutorial highlight. All current screen VISUAL STYLING is temporary and may be redesigned, but layout and component dimensions must not change. Deliver a flat front-on design reference, no physical phone/tablet frame, no perspective, no new gameplay or invented controls. Japanese text may appear in design sheets. No watermark, signature, unrelated brand. Refined materials restrained; no cartoon, no ornate rococo frames, no excessive glowing haze. SHEET-UI-PARTS portrait1536x2048 RGB design specification sheet, tidy grid of real UI components with sufficient spacing, labelled sections in Japanese. No phone frame. Title UI部品のデザイン表. Seven sections: (1) BUTTONS four sizes 大 / ふつう / 小 / 丸い選択肢, each in four states ふつう / 押せない / 選んでいる / 案内で押してほしい; last state ONLY pale-gold tutorial outline, selected BLUE, disabled muted but readable. Preserve usable 44px touch height at device scale. (2) CONDITION CARD sample クリア条件 / 噴水盤に 2 届ける / 桶 2・配管 3本・NG 残り20回, a small ふりかえり control in title row. (3) STAGE SWITCHER ‹ 1 まっすぐ届ける ∨ › and small subline 選択プレイ・お試し. (4) TOASTS include selection options 太1 中2 細3; prediction question どれだけ届く？ choices 1 届く / 2 届く / 3 届く and note 選んでから水が流れます; THREE result variants 100点 / クリア / NG with small 最高点 and 最少 marks, outlet row 指定 2・届いた 2 for success and 届いた 1 for NG; rows 解説, 記録, footerbuttons もう一度 / 次へ or 配管を見直す for NG. Result dismiss × at upper right. (5) BOTTOM SHEETS four miniature panels メニュー / 記録 / 面の一覧 / レベルの選択; show same family of surfaces and distinct headers, level choices フリー and ビギナー. (6) GUIDE ROW with small humanoid WATER SPIRIT matching attached guide asset on LEFT and 2-line advice on RIGHT. (7) UPDATE NOTICE 新しい版があります / 更新する. Simple consistent blue line icons, no extra gameplay. White/blue surfaces and dark ink labels, design must be reproducible in CSS/SVG, not textured impossible-to-read fantasy ornament. Candidate B: frosted translucent-white surfaces with crisp chamfered tiny corners, single cool-blue fine border, very subtle glass edge. Cobalt primary buttons and ink text. Restrained architectural geometry, no dark mode, no gold button fills.

Additional correction call:
Use case: precise-object-edit. Edit attached UI COMPONENT DESIGN SHEET, preserve its overall grid, frosted blue visual style, colors, state examples, component dimensions and portrait composition. Correct SAMPLE TEXT and omissions so this visual proposal cannot introduce new functionality: (1) Guide row sentence must be exactly 水は高いところから低いところへ流れます。 Delete any claim about pipe thickness changing the distance water reaches. (2) In メニュー miniature show ONLY タイトルへ / 記録 / パーツの説明 / 遊び方と概要 / 調整. Remove 用語集, ホーム, お知らせ and all other invented entries. In 記録 miniature replace all コレクション/実績/メダル/統計/プレイ履歴 menu entries with a small plain table header 面・最高点・最少 and one sample row 1・100点・3本. Do not invent new collection or achievement features. (3) Level labels EXACTLY フリー and ビギナー. (4) Prediction sample must show THREE choices 1 届く / 2 届く / 3 届く with 選んでから水が流れます。 Keep or add a compact separate selection sample with 太1 / 中2 / 細3 inside section4 without altering other section positions. (5) THREE RESULT cards 100点 / クリア / NG retained. In NG card, footer has 解説 and 配管を見直す only, keep the unused third/right NEXT slot empty, no もう一度 or 次へ on NG. Success cards retain もう一度 / 次へ, small 最高点 / 最少 marks. (6) Gold tutorial-outline state must appear for each of4 button sizes; ordinary selected buttons BLUE. (7) Do not print invented numeric component heights as a new size specification: remove parenthetical 高さXXpx labels only, keep actual drawn button shapes unchanged. All other content and layout untouched. No extra headings or functionality.

Additional correction call:
Use case: precise-object-edit. Attached UI parts sheet. Make ONLY2 local corrections, leave every other panel, text, layout, shape and color unchanged. FIRST, section4 SECOND panel titled どれだけ届く？ currently has only TWO choices 1 and3. Erase ONLY the choice-button row in that single panel and redraw it as exactly THREE EQUAL NARROW BUTTONS side-by-side occupying the SAME TOTAL WIDTH: left text 1 届く, CENTER text 2 届く, right text 3 届く. Reduce each button width so all3 fit. Do not alter first 太1/中2/細3 panel, which already has3choices. Keep note 選んでから水が流れます。 SECOND, in section1 FOURTH column of tutorial-highlight states, add thin pale-gold glowing outlines to the ふつうボタン row AND 小ボタン row, matching the already golden 大ボタン and 丸い選択肢 above/below. Thus ALL FOUR shapes in that last column have gold outline; the BLUE selected third column untouched. Preserve guide, condition, menus, result cards and portrait composition completely.
```

### sheet-ui-parts-b-prediction-detail — B案・予想3択の拡大見本

採用：未確定。

候補：[表示用PNG](sheet-ui-parts-b-prediction-detail.png) / 原本：[生成原本](originals/sheet-ui-parts-b-prediction-detail.png)

保存先：`public/graphics/candidates-20261101-addendum/sheet-ui-parts/sheet-ui-parts-b-prediction-detail.png`。1536×1024 RGB PNG、1,049,808 bytes。

加工：原本1536×1024を縦横比を保って1536×1024へ縮小／拡大し、指定寸法へ余白を補った。画像の切り抜き・縦横別の引き伸ばし・減色なし。余白の開始位置（左0px、上0px）。

参照画像：

- `C:\Users\user\.codex\generated_images\01a1962c-6d7f-7672-8c5a-0cb45a96f3ff\exec-0db18e8a-0f17-4afe-af41-1fd5ef5874a6.png`

実際に使った指示文（初回と修正の全文）：

```text
Use case: ui-mockup. NEW standalone enlarged DETAIL SHEET for AQUA NOTES candidate B. Attached sheet is ONLY a visual material reference; do NOT copy its two-button prediction example. Canvas1536x1024 RGB. One large frosted white/light-blue prediction card with crisp blue edge, Japanese sans-serif, empty pale background. Small sheet caption B案・予想の問い（3択の詳細） outside card. In card header exact どれだけ届く？ with × upper right. Main contents: EXACTLY THREE SEPARATE EQUALLY SIZED BUTTONS in a SINGLE HORIZONTAL ROW. There MUST be a LEFT button text 1 届く, a CENTER button text 2 届く, and a RIGHT button text 3 届く. Three buttons, three equal columns, all visible, no missing middle. Put a thin vertical gap between each. CENTER button cobalt BLUE with WHITE text to demonstrate a chosen option, left/right WHITE with DARK BLUE text. Do not merge any buttons. Under row exact note 選んでから水が流れます。. No submit/confirm button, no fourth option, no numbers as option indices outside those quantities. All3 labels large readable, amount plus 届く indicates flow quantity. Quiet elegant daytime white/blue palette, no scene, no serif, no gold, no decorations. Detail sheet supplements B's primary UI component sheet; preserves actual three-choice behavior.
```

