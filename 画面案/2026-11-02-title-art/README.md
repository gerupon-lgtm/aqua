# タイトルの絵の作り直し（v0.14.5）

発案者の実画面の指摘「妖精が沈む」「グラスと噴水盤が子供の落書きに見える」に対応。画面全体の見本画像ではなく、タイトルで実際に表示する透過部品を制作した。配置・作品ロゴ・メニュー構成はv0.14.4を維持する。採用の受け入れは実画面で行う。

## 参照と制作

- 道具：組み込みのimagegen。グラスと噴水盤を別々に生成、透明背景を指定。
- 共通の画風参照：既存の水の精霊A（元は星の精霊と昼夜の対として制作したもの）。白・水色・青、控えめな金、細い線と立体的な陰影。
- グラスの形の参照：既存候補Aのpart-glass-a-whole.png。
- 噴水盤の素材と水の参照：既存候補Aのpart-basin-a.png、fx-fountain-a-06.png。
- 精霊は描き直していない。採用済み原本を256×384へ縮め直し、CSSで彩度・輪郭・影を付けた。以前の128×192を拡大する方法から変更。

以下は制作指示を記録用に整理したもの。新しい文字やキャラクターを描かせず、アプリの部品として小さく表示できることを優先した。

### グラスの指示文

Create one production-ready title emblem on a genuinely transparent background. Match the first reference, the adopted water spirit: delicate blue and white fantasy painting, refined fine golden details, luminous modeled materials and coherent volume. Use the second reference only for the tall straight open drinking-glass shape. Draw one upright tall glass, half filled with sapphire-blue water, with a slightly curved water surface, clean highlights, thick glass base, and a slightly elevated frontal view showing its depth. Use a distinct cobalt outer edge so it remains legible at about 90 pixels. No stem, handle, character, text, symbol, scenery, plinth, extra objects, surrounding haze, or checkerboard. Center the complete object with roughly ten-percent margins. Preserve actual alpha transparency; do not paint a fake transparent background. Avoid a flat vector or diagram-like look.

### 噴水盤の指示文

Create one production-ready title emblem on a genuinely transparent background, matching the adopted water spirit in the first reference: refined blue and white fantasy painting, delicate fine gold, modeled ceramic and glass, and luminous but clearly defined water. Use the second reference for a broad low white porcelain frame containing a glass inner bowl, with subtle golden trim. Use the third reference for the fountain water's shape, but make the water more visible with cyan and cobalt than in the very pale original. Draw a central upright jet and two shorter symmetrical arcs landing in the bowl. Use a coherent slightly elevated frontal perspective. Keep the bowl and water distinct when shown about 90 pixels wide. No tall pedestal, character, text, rainbow, scenery, extra objects, checkerboard, or surrounding haze. Center the complete object with safe margins and real alpha transparency. Avoid flat vector outlines.

## 原本と配信用の絵

| 手元の原本（このフォルダ、Git対象外） | 配信用（Git対象） | 大きさ | バイト数 |
|---|---|---|---|
| title-glass-original.png | public/graphics/title-glass-v2.png | 384×384 RGBA | 123625 |
| title-fountain-original.png | public/graphics/title-fountain-v2.png | 384×384 RGBA | 164713 |
| spirit-adopted-original.png | public/graphics/spirit-detail-v2.png | 256×384 RGBA | 118262 |

`python scripts/prepare-title-art.py`で縦横比を保って縮小・PNG最適化する。絵の内容・色・形は加工せず、切り抜きも行わない。通常のビルドは変換済みPNGを使うため、原本もPythonも不要。3枚は版付き・通信なし資材に入る。既存のcandidates-20261101とcandidates-20261101-addendumは変更しない。

実画面の点検は[見た目再点検](../2026-11-02-見た目再点検/README.md)、実装と公開の記録は[点検](../../docs/reviews/2026-11-02-visual-readability.md)。
