# bg-trial / 優先度1の比較候補

生成日：2026-11-01（日本時間） / 道具：Codexの組み込み画像生成。

**採用：全案未確定。発案者が実画面で見比べてから選ぶ。現在の公開画面には未組み込み。**

[全体の案内](../2026-11-01-priority1/README.md)

![A・B比較](comparison.png)

## 候補と使い方

## bg-trial-a — 若葉の湧き庭

採用：未確定。

生成原本：[originals/bg-trial-a.png](originals/bg-trial-a.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [bg-trial-a.png](bg-trial-a.png)：1536×1536 / RGB / 2,401,177 bytes。保存先 `public/graphics/candidates-20261101/bg-trial/bg-trial-a.png`

加工：原本 1254×1254 → 1536×1536。切り抜きなし。RGB PNG、減色なし。600KB程度を目指した減色試作では石・葉の細部に色の段差が出たため、取り込み用は画質を保つ版とした。 / compact-study.pngは容量優先の減色試作で、正式な候補の代替ではない。取り込み用の容量は上のファイル一覧を参照。600KBの目安は未達。原本・圧縮試作・画質を保つ版を比較できる。

参照画像：

- `C:\Users\user\Documents\project\ダイクストラ法検証\public\graphics\ruins.png`

上記がこの呼び出しで渡した画像。前作の絵はシリーズの画風の参照で、上書き対象ではない。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Square 1536x1536 board SKY background. Central 70% horizontally (x15%-85%) and entire upper 80% remain almost empty pale luminous sky with faint soft clouds, low contrast so overlaid game parts and pipes stay readable. All architecture, rocks and leaves confined to extreme left/right 15% and bottom corners, horizon at the very bottom 4%, no ground cross-section below it. No fountains, spring vessels, glasses, pipes, foreground game objects, water features, or central monuments. Candidate A: natural spring garden suggested only through a few fresh willow leaves at the outer corners, worn ivory stone garden edges at bottom far corners, tiny distant blue mountains at the bottom edge, overwhelmingly open clear morning sky.
```

## bg-trial-b — 白石の回廊庭

採用：未確定。

生成原本：[originals/bg-trial-b.png](originals/bg-trial-b.png)

取り込み用候補（元ファイル名のまま、採用前）：

- [bg-trial-b.png](bg-trial-b.png)：1536×1536 / RGB / 2,681,968 bytes。保存先 `public/graphics/candidates-20261101/bg-trial/bg-trial-b.png`

加工：原本 1254×1254 → 1536×1536。切り抜きなし。RGB PNG、減色なし。600KB程度を目指した減色試作では石・葉の細部に色の段差が出たため、取り込み用は画質を保つ版とした。 / compact-study.pngは容量優先の減色試作で、正式な候補の代替ではない。取り込み用の容量は上のファイル一覧を参照。600KBの目安は未達。原本・圧縮試作・画質を保つ版を比較できる。

参照画像：

- `C:\Users\user\Documents\project\ダイクストラ法検証\public\graphics\observatory.png`

上記がこの呼び出しで渡した画像。前作の絵はシリーズの画風の参照で、上書き対象ではない。

実際に使った指示文（全文）：

```text
Use case: illustration-story. New game art for AQUA NOTES, the daytime sister of PRISM NOTES. Use attached image(s) only as painterly series style reference: refined, luminous, serene mature fantasy, delicate material texture, no cartoon. White #f4f9fd and soft blue #e2eef8, restrained pale gold only on lit edges, morning light from upper left. No lettering, logos, signatures, frames, people or characters. Square 1536x1536 board SKY background. Central 70% horizontally (x15%-85%) and entire upper 80% remain almost empty pale luminous sky with faint soft clouds, low contrast so overlaid game parts and pipes stay readable. All architecture, rocks and leaves confined to extreme left/right 15% and bottom corners, horizon at the very bottom 4%, no ground cross-section below it. No fountains, spring vessels, glasses, pipes, foreground game objects, water features, or central monuments. Candidate B: airy white-stone cloister garden, slender weathered ivory columns cropped at the extreme outer edges only, a few young climbing leaves, faint blue hill horizon in bottom 4%. No arch spans the center. More architectural than A yet equally empty and pale in central game area.
```
