# 絵の発注書（表示資材）

版：v0.1（2026-11-01、アプリ v0.12.0 の画面の骨組みに合わせて作成）。正典は要件定義書 v0.4・構想たたき台 4章（世界観）・screens.md 0章（デザイントークン）。

## 1. 目的と分担

画面の骨組み（v0.12.0）で、絵を置く場所と大きさが決まった。この文書は、絵の作り手（Codex の画像生成）への発注書であり、できた絵の出所の記録でもある（前作 prism の docs/assets.md と同じ使い方）。

| 担当 | すること |
|---|---|
| Codex | この発注書の各資材を画像生成で作り、`public/graphics/` に置く。採用候補と生成の指示文を 5章の形で記録する |
| 発案者 | 候補を見比べて採用を決める（T-13 の完了条件：実画面で見比べて選ぶ） |
| Claude | 骨組み・図形で描く部分（水・目盛り・配管の線・動き）を作り、採用された絵を組み込む。バッジは採用デザインを図形（SVG）で作る |

絵の採用は、発案者が実画面で確かめてから確定する。モックの承認だけで確定にしない（tasks.md T-13）。

## 2. 共通の決まり

### 世界観（確定事項）

- 昼の明るい世界。白と青が基調。前作「プリズム・ノーツ」（夜の遺跡・濃紺と金）と、夜と昼の対になる
- 淡い金色は、光る場所（グラスの光、噴水盤の縁、星のような輝き）にだけ差し色として使う
- 静けさ。水音とグラスハープが似合う、澄んだ落ち着いた雰囲気。子ども向けの漫画調にしない（前作と同じく、上品で大人びたファンタジーの絵画調）
- 案内役は水の精霊（前作の星の精霊の役目を引き継ぐ、案内のときだけ現れる小さな人型）

### 色（いまの画面の値。絵はこれに合う色にする）

| 用途 | 値 |
|---|---|
| 空（上→下） | `#f4f9fd` → `#e2eef8` |
| 文字 | `#17314c` |
| 青 | `#2a6db5`（濃い青 `#1d4f88`、水の中間 `#4b9ad8`） |
| 淡い金 | `#c9a14a` |
| 土（地面の下の断面） | `#ece5d6`、線 `#d6c9ae` |
| 石（泉の器・噴水盤） | `#fbfaf6`、縁 `#c3c8ce` |

### すべての絵に共通の禁止事項

- 文字・数字・ロゴ・署名・枠を描かない（文字はアプリが重ねる）
- 背景には、ゲームの部品（泉・グラス・配管・噴水盤・人物・精霊）を描かない。部品は別の資材として作る
- 背景の中央（左右の端からそれぞれ 15% を除いた範囲）と上部は、明るく開けた空にし、細かい模様や強いコントラストを置かない（部品と配管を読みやすくするため。前作の指示「中央65%を開けた空に」と同じ考え方）
- 実在の建物・作品・人物に似せない

### 形式と置き場所

- PNG。背景は不透明（RGB）、部品・精霊・演出は透過（RGBA、本当に透明な背景）
- 保存先：`public/graphics/<資材ID>.png`（例 `public/graphics/bg-trial.png`）。既存のファイルを上書きしない
- 生成の原本と比較案は、リポジトリの外ではなく `画面案/<日付>-<名前>/` に置き、README に指示文と採否を書く（前作と同じ）

## 3. 盤面の寸法（絵の大きさを決める前提）

盤面は SVG で、座標の範囲は 横360 × 縦470。地面の線は上から 370（全体の 79%）。地面より下は土の断面で、地面の下を通る配管を描く。

- 背景（空）を置くのは、地面より上の 横360 × 縦370 の範囲。ほぼ正方形なので、背景は正方形で作り、この範囲を覆うように縮小・切り抜きして置く
- 画面の幅が 414px のスマホで、盤面の幅はおよそ 380px（1単位 ≒ 1.06px）。高解像度の画面（3倍）でもにじまないよう、部品は表示の4倍程度で描く
- グラス：幅 34。高さは面によって変わる（泉の高さで決まり、おおよそ 150〜300）
- 泉の器：幅は面によって変わる（おおよそ 40〜60）、高さはグラスと同じく変わる
- 噴水盤：幅 48・高さ 26 前後（器の形は逆台形で底が丸い）。口の高い面では台座の上に乗る
- 壁（サイフォンが越える）：幅 16、高さは面によって変わる

## 4. 資材の一覧

優先度 1 は、次の実画面の見比べ（T-13）に必要なもの。2 以降は、その後でよい。

| ID | 名前 | 使う場所 | 大きさ（px） | 形式 | 枚数 | 優先度 |
|---|---|---|---|---|---|---|
| bg-trial | 盤面の背景：お試し（1〜6面） | 盤面の空 | 1536×1536 | RGB | 1 | 1 |
| bg-split | 盤面の背景：分けて届ける（7〜12面） | 盤面の空 | 1536×1536 | RGB | 1 | 2 |
| bg-adjust | 盤面の背景：流れを調える（13〜18面） | 盤面の空 | 1536×1536 | RGB | 1 | 2 |
| bg-levels | 盤面の背景：低い出口、高い出口（19〜24面） | 盤面の空 | 1536×1536 | RGB | 1 | 2 |
| bg-wall | 盤面の背景：壁を越える（25〜30面） | 盤面の空 | 1536×1536 | RGB | 1 | 2 |
| bg-pump・bg-tune・bg-loop・bg-finale | 後続の背景（31〜54面の4まとまり） | 盤面の空 | 1536×1536 | RGB | 4 | 4 |
| title-portrait・title-landscape | タイトル画面の背景 | タイトル | 1024×1536・1672×941 | RGB | 2 | 1 |
| spirit | 水の精霊 | 案内の行の左（表示 38×56） | 1024×1536 | RGBA | 1（＋表情違い 任意） | 1 |
| part-spring | 泉の石の器 | 盤面 | 3分割（4-3 参照） | RGBA | 1式 | 1 |
| part-glass | グラス | 盤面 | 3分割（4-3 参照） | RGBA | 1式 | 1 |
| part-basin | 噴水盤（台座つきの別版も） | 盤面 | 384×208・台座 224×縦伸び | RGBA | 2 | 1 |
| fx-fountain | 噴水（クリア） | 噴水盤の上 | 384×512・6〜8コマ | RGBA | 1式 | 1 |
| fx-rainbow | 虹（100点） | 噴水の上 | 768×512 | RGBA | 1 | 1 |
| ui-badges | 盤面のバッジのデザイン | 盤面の文字の札 | 1枚のデザイン表 1536×1024 | RGB | 1 | 1 |
| part-wall | 壁の石（縦に繰り返せる） | 盤面 | 128×128 タイル | RGBA | 1 | 2 |
| part-bucket・part-gate | 桶・水門 | 盤面・条件カード | 256×256 | RGBA | 各1 | 2 |
| soil | 地面の下の断面（横に繰り返せる） | 盤面の地面の下 | 1024×256 タイル | RGB | 1 | 3 |
| icon-app | アプリのアイコン（ホーム画面） | PWA | 1024×1024 | RGB | 1 | 3 |
| part-pump・part-drain | 手押しポンプ・排水口（後続） | 盤面 | 256×384 | RGBA | 各1 | 4 |

ロゴ（AQUA / NOTES）は、前作と同じく書体（Montserrat）で作るので発注しない。水のしずくなどの飾りを足す場合だけ、別に相談する。

### 4-1. 盤面の背景（bg-*）

- 正方形 1536×1536。下の辺が地面の線にあたる。下の辺の近くに遠景の岸・草地・石畳などの地平を置き、その下は描かない（土の断面はアプリが描く）
- 左右の端と下の角だけに建物・木・岩を置き、中央と上部は明るい空と遠い雲にする
- 面のまとまりごとに場所を変えるが、同じ世界の続きに見えるよう、光の向き（左上から朝〜昼の光）と色調をそろえる
- 場所の案（採用は発案者が決める）：

| ID | まとまり | 場所の案 |
|---|---|---|
| bg-trial | お試し | 朝の湧き水の庭。白い石の小さな泉の縁と若葉、遠くに青い山 |
| bg-split | 分けて届ける | 白い石の運河が枝分かれする水辺の町。遠くに小さな橋 |
| bg-adjust | 流れを調える | 水車と堰のある明るい谷。流れの速さを調える水門の気配 |
| bg-levels | 低い出口、高い出口 | 段々に重なる泉の棚（テラス状の噴水庭園） |
| bg-wall | 壁を越える | 白い城壁と、それを越える古い水道橋 |
| bg-pump | 高さを直して呼び水（後続） | 井戸と手押しポンプのある丘の村 |
| bg-tune | 音を調える（後続） | 水の音楽堂。ガラスの鉢が並ぶ回廊 |
| bg-loop | 一周して戻る（後続） | 二つの湧き水がめぐる湖と、輪になった水路 |
| bg-finale | 総まとめ（後続） | 雲の上の白い水の神殿。前作の夜の遺跡と対になる昼の聖域 |

指示文の下書き（共通部分）：

```text
Painterly serene fantasy illustration, square 1:1, bright daytime, white and soft blue palette with tiny pale gold highlights only on sunlit edges. Calm, elegant, mature (not cartoon). The central 70% and the upper half must stay an open, bright, low-contrast sky with distant soft clouds, so that game parts drawn on top stay readable. Scenery only near the left and right edges and the lower corners. The bottom edge is the horizon line: distant ground meets it; draw nothing below it. No people, no characters, no text, no logos, no frames, no fountains or glasses in the foreground.
```

まとまりごとの追記の例（お試し）：`Morning spring garden: low white stone rims of a small natural spring and fresh young leaves at the far left and right edges, distant blue mountains near the horizon, gentle morning light from the upper left.`

### 4-2. タイトル画面の背景（title-*）

- 縦 1024×1536（スマホ縦）と横 1672×941（横向き・PC）の2枚。同じ場面の構図違い
- 上から 15〜45% にロゴ、45〜85% にボタンが重なる。この範囲は明るく静かに保つ
- 場面の案：朝の光の中、白い石の泉の庭に、グラスハープのように並ぶ透明な水の器が遠くに見える。前作のタイトル（夜の遺跡と天文台）と対になる昼の景色

### 4-3. 盤面の部品（part-*）

泉とグラスは、面によって高さが変わり、中の水位はアプリが動かす。そのため、1枚の絵ではなく、縦に伸ばせる3つに分けて作る。

| 部品 | 分け方 | 大きさの目安（4倍で描く） | 注意 |
|---|---|---|---|
| グラス（part-glass） | 上（口の縁）・中（縦に繰り返す胴）・下（底） | 幅 136。上 48・中 64（繰り返し）・下 40 | 透明なガラス。中は空で、水と目盛りはアプリが描く。縁と映り込みのハイライトだけで形が分かるように。目盛りの線は描かない |
| 泉の器（part-spring） | 上・中・下 | 幅 240。上 48・中 64・下 40 | 白い石の器。中の水はアプリが描く（器の内側は空けておく） |
| 噴水盤（part-basin） | 1枚 | 384×208 | 白い石の逆台形の器、底は丸い。縁に淡い金の細い線。中の水はアプリが描く（内側は空ける）。口（グラスとつながる管）は左側から入る |
| 台座（part-basin の別版） | 上・中（繰り返し） | 幅 224 | 口の高い噴水盤を乗せる白い石の台 |

指示文の下書き（グラス）：

```text
Game asset on a genuinely transparent background: a single tall clear glass vessel for a glass harp, seen straight from the side, empty, elegant thin rim with a faint pale gold line, subtle white highlights and soft blue reflections, no water, no tick marks, no shadow on the background. Deliver as three separate pieces: top rim, a seamlessly tileable vertical body section, and the base. Same width for all pieces, perfectly vertical edges.
```

### 4-4. 水の精霊（spirit）

- 前作の星の精霊と同じ役目と扱い：案内のときだけ、案内の行の左に小さく（表示 38×56）出す
- 1024×1536 の縦長、透過。全身が入り、上下に少し余白
- 姿の案：澄んだ水でできた小さな人型。白と青、髪や衣の先が水のしずく・波紋のように揺れる。淡い金の小さな光をひとつ（前作の星の精霊とのつながり）。穏やかで知的な表情、子どもっぽくしすぎない
- 表情違い（任意）：説明するとき・よくできたとき（答え合わせ）

### 4-5. 噴水と虹（fx-*）

- 噴水（fx-fountain）：クリアのとき、ジングルの鳴り始めと同時に噴水盤から噴き上がる。6〜8コマの連続画像（各 384×512、透過）。1コマ目は噴き始め、最後のコマは高く上がった状態で、最後の2〜3コマを繰り返せるようにする。白と淡い青の水、しぶきに小さな光
- 虹（fx-rainbow）：100点のとき、噴き上がった後に噴水の上へかかる。768×512、透過。半円より浅い弧。アプリが透明度を変えてふわっと出すので、1枚でよい。色は柔らかく、前作の金の光と合う上品な色合い
- いまはアプリが図形で描いている（src/ui/board.js の drawFountain と虹）。採用した絵に置き換えるか、図形の描き方を絵に合わせるかは、見比べてから決める
- 動きを減らす設定の端末では、最後のコマだけを表示する

### 4-6. 盤面のバッジ（ui-badges）

盤面の文字の情報を、読みやすくきれいなバッジにする（2026-11-01 発案者）。中の文字と数字はアプリが重ねるので、デザイン表を1枚作り、それを元に Claude が図形（SVG）で作る。

デザイン表に入れるもの（すべて文字の入った見本として描いてよい。デザイン表だけは文字を入れる）：

| バッジ | いまの表示 | 状態 |
|---|---|---|
| 泉の名前 | 「泉」 | 1つ |
| 噴水盤の指定量 | 「指定 2」「開 3・閉 2」 | ふつう・届いた（ちょうど）・多い・足りない |
| 噴水盤の口の細さ | 「口 太1」 | 1つ |
| 口の高さ | 「口の高さ 3」 | 1つ |
| 配管の太さ | 「太1」「中2」「細3」「細3〜太1」 | 候補（つないでいない）・つないだ |
| 水門 | 「水門」「水門（閉）」 | 開・閉 |
| 空のグラス | 「空」 | 1つ |

- 条件：盤面の上で小さく（高さ 16〜20px）表示しても読める。配管の上に重なっても区別できる。前作の秒数の札（四角い札に白い文字）と同じシリーズに見える
- 指示文の下書き：`UI design sheet, flat and elegant, for small label badges used on a bright white-and-blue game board: ...（上の表の各バッジを、状態ごとに並べる）`

## 5. 採用と出所の記録

前作と同じく、採用した資材ごとに次を書き足す。

| 項目 | 書くこと |
|---|---|
| 保存先 | `public/graphics/<ID>.png` |
| 生成日・道具 | 例：2026-11-xx、Codex の組み込み画像生成 |
| 指示文 | 実際に使った全文 |
| 参照した画像 | 例：採用済みの bg-trial を画風の参照にした |
| 加工 | 切り抜き・縮小などをしたか（していなければ「加工なし」） |
| 採用 | 発案者が実画面で見比べて選んだ日と、候補の置き場所 |


### 2026-11-01：優先度1のA/B候補（未採用）

発案者の画像制作依頼により、Codexの組み込み画像生成で全10資材IDに各2案を制作。台座A/Bを別に含め、候補原本22枚（別途バッジBの修正前1枚も保持）。**採用は全て未確定。発案者が実画面で選んでから確定する。**

[比較一覧・確認範囲](../画面案/2026-11-01-priority1/README.md)。資材ごとのREADMEに指示文全文、参照画像、加工、保存先、採否を記録。原本も同じ候補フォルダに保持。

| 資材 | 候補と出所 | 取り込み用候補の保存先 |
|---|---|---|
| bg-trial A/B | [README](../画面案/2026-11-01-bg-trial/README.md) | `public/graphics/candidates-20261101/bg-trial/` |
| fx-fountain A/B | [README](../画面案/2026-11-01-fx-fountain/README.md) | `public/graphics/candidates-20261101/fx-fountain/` |
| fx-rainbow A/B | [README](../画面案/2026-11-01-fx-rainbow/README.md) | `public/graphics/candidates-20261101/fx-rainbow/` |
| part-basin A/B | [README](../画面案/2026-11-01-part-basin/README.md) | `public/graphics/candidates-20261101/part-basin/` |
| part-glass A/B | [README](../画面案/2026-11-01-part-glass/README.md) | `public/graphics/candidates-20261101/part-glass/` |
| part-spring A/B | [README](../画面案/2026-11-01-part-spring/README.md) | `public/graphics/candidates-20261101/part-spring/` |
| spirit A/B | [README](../画面案/2026-11-01-spirit/README.md) | `public/graphics/candidates-20261101/spirit/` |
| title-landscape A/B | [README](../画面案/2026-11-01-title-landscape/README.md) | `public/graphics/candidates-20261101/title-landscape/` |
| title-portrait A/B | [README](../画面案/2026-11-01-title-portrait/README.md) | `public/graphics/candidates-20261101/title-portrait/` |
| ui-badges A/B | [README](../画面案/2026-11-01-ui-badges/README.md) | `public/graphics/candidates-20261101/ui-badges/` |

前作の夜の遺跡・天文台・出発点・星の精霊を参照し、白と青の昼の対として制作した。精霊は同じシリーズの顔・髪・浮遊する姿を引き継ぐ。泉・グラスは上48px／胴64px／下40px、台座は上／胴、噴水は各384×512の6コマに分割。虹は768×512、バッジは1536×1024の参照表。透明度・寸法・繰り返す胴の上下端を確認し、加工と検査値を比較フォルダへ記録。

比較用候補であり、現在の公開版には未組み込み。16〜20pxの札・分割接続・噴水の動きの自然さ・背景上での読みやすさ・実機での見え方は、採用時の実画面で確認する。ソース・index.html・版・キャッシュ設定には変更なし。コミット・GitHub送信・デプロイなし。

### 2026-11-01：追加発注・優先度1のA/B候補（未採用）

docs/assets-addendum.md の追加発注と発案者の依頼により、Codexの組み込み画像生成で7資材を各A/Bで制作。プレイ画面は各案にスマホ編集中・結果・PCの3枚。主候補18枚と部品表Bの予想3択の拡大見本1枚、合計19枚。**全案未採用。発案者が実画面で見比べて選んでから確定する。**

[比較一覧・確認範囲](../画面案/2026-11-01-priority1-addendum/README.md)。各資材のREADMEに初回・修正の指示文全文、参照、加工、原本・修正前と候補の保存先を記録。

| 資材 | 比較と出所 | 新しい保存先 |
|---|---|---|
| sheet-pipe A/B | [README](../画面案/2026-11-01-sheet-pipe-addendum/README.md) | `public/graphics/candidates-20261101-addendum/sheet-pipe/` |
| sheet-water A/B | [README](../画面案/2026-11-01-sheet-water-addendum/README.md) | `public/graphics/candidates-20261101-addendum/sheet-water/` |
| sheet-ui-play A/B | [README](../画面案/2026-11-01-sheet-ui-play-addendum/README.md) | `public/graphics/candidates-20261101-addendum/sheet-ui-play/` |
| sheet-ui-title A/B | [README](../画面案/2026-11-01-sheet-ui-title-addendum/README.md) | `public/graphics/candidates-20261101-addendum/sheet-ui-title/` |
| sheet-ui-parts A/B | [README](../画面案/2026-11-01-sheet-ui-parts-addendum/README.md) | `public/graphics/candidates-20261101-addendum/sheet-ui-parts/` |
| logo-aqua A/B | [README](../画面案/2026-11-01-logo-aqua-addendum/README.md) | `public/graphics/candidates-20261101-addendum/logo-aqua/` |
| logo-series A/B | [README](../画面案/2026-11-01-logo-series-addendum/README.md) | `public/graphics/candidates-20261101-addendum/logo-series/` |

公開版v0.13.0のスマホ配置と前作のスマホ／PC画面を参照し、昼の白と青へ展開。配置・大きさを変える提案ではなく、PCは追加発注書の前作と同じ左盤面・右条件列の指定に従う。デザイン表の文字・数値は見本で、計算・得点・機能の変更を示さない。ロゴは採用後に実際のMontserratと図形で組み、副題の採否は未確定。

部品表Bの主表の予想欄は2択に見えるため、付属の「B案・予想3択の拡大見本」が正しい3択構成を示す。寸法・RGB・原本・相対リンクを確認。画像の画素と既存矩形の完全一致や、実画面への組み込み・実フォント・小さい表示・実機は未検証。

既存の `public/graphics/candidates-20261101/` はこの作業で書き換えない。新候補は `public/graphics/candidates-20261101-addendum/` のみ。プログラム・index.html・版・キャッシュは変更せず、コミット・GitHub送信・デプロイなし。


作業中に追加発注書1-2「部品と背景の境界」が追記されたため、配管・水・プレイの計10枚を濃い青の縁（制作値#1d4f88前後）と淡い青の局所的な陰影へ更新。明るい背景を保ち、透明な素材と反射を残した。更新前もhistory原本として保持。


### 2026-11-01：見た目の仕上げ v0.14.2（実描画）

発案者の「実際に実現できるもので見せてほしい」という指示に合わせ、画面全体の生成画像を採用判定に使わず、本番のSVG・CSSと検査済み出題で比較した。[実装比較と指示の記録](../画面案/2026-11-01-実装確認/README.md)。

器は白い陶器の枠＋ガラス、固定幅62。グラス左12を見せる位置に重ね、前面と奥側の湾曲した目盛りを描く。地中の土、丸い太さバッジ、直線の引き出し、7色の虹と噴水の青い流れはSVGで実装。既存の背景・グラス・給水塔・精霊・タイトル・台座・噴水6コマの資材は継続使用。part-basin.pngとfx-rainbow.pngは保持するが、今回の器と虹の描画には使わない。既存のcandidates-20261101は変更していない。

今回の部品の描き方は[画面定義6章](screens.md#6-v0142-の見た目2026-11-01)と[点検](reviews/2026-11-01-visual-finish.md)を参照。下の7章はv0.14.0時点の資材取り込みの記録として保持する。

### 2026-11-01：シリーズ配置と案内の仕上げ v0.14.4

前作の配置・Montserratの文字組を実装へ反映し、作品とSIKUMI NOTES 02のロゴを文字として組み込んだ。精霊の画像原本は変えず、表示を64×94に広げ、下地と輪郭に沿う影をCSSで付けた。新しい説明図はintro-gate/outlets/adjustable/height/siphon.svg（各960×360・文字なし・透過）。scripts/prepare-diagrams.jsで作るSVGで、画像生成の候補を採用したという意味ではない。生成画像のモックではなく、パーツの説明と実アプリの画面で確認する。[点検と依頼の照合](reviews/2026-11-01-series-and-guide.md)。既存の候補は変更しない。

### 2026-11-02：タイトルの絵と読みやすさ v0.14.5

発案者の実画面の評価を受け、タイトルの簡単な線画を、採用済み精霊を参照して生成したグラスと噴水盤の透過絵へ交換。title-glass-v2.png・title-fountain-v2.pngは384×384、spirit-detail-v2.pngは同じ精霊原本の256×384。3枚で406600バイト。原本・指示文・縮小手順は[制作記録](../画面案/2026-11-02-title-art/README.md)。scripts/prepare-title-art.pyは絵を切らず、縦横比を保って縮める。生成した全画面の見本は使わず、本番で3部品を表示する。旧候補は変更しない。

タイトルのボタン、配管の光、結果の判定・分数、台座、開始の合図と文字組みはSVG・CSS・共通表示関数で修正。[実画面の点検](reviews/2026-11-02-visual-readability.md)。
## 6. 組み込みと確かめ方

- 組み込み：背景は盤面の空の範囲に、部品は SVG の中に画像として置く。資材は版付きの配信資材と、通信なしで使う資材の一覧に含める（ビルドが自動で拾う）
- 確かめ方：スマホ縦（幅 360・414）・横向き・PC で実画面のスクリーンショットを撮り、部品と配管が背景に埋もれないこと、グラスの水位と目盛りが読めること、バッジが 16px でも読めることを確かめる
- 画像の合計の大きさ：通信なしで使うため、背景は1枚 600KB 以下を目安に圧縮する（見た目が崩れない範囲で）


## 7. 採用（2026-11-01）

最新の追加採用（2026-11-03、v0.14.12）：浅い陶器の排水盤と土、および実描画の札・噴水・虹を採用。以下の表は初回の取り込みの履歴。現在の盤は水をためず、ガラス窓を使わない。

| 追加資材 | 配信用 | 大きさ |
|---|---|---|
| 浅い陶器の噴水盤 | public/graphics/part-drain-pan-v2.png | 512×104、66821 bytes |
| 地中の土 | public/graphics/soil-loam-v1.webp | 1024×341、76946 bytes |
| 噴水・虹・札と部品の材質 | 既存の噴水6コマとSVG・CSSで描画 | 新しい全画面画像は使わない |

必要量が下、高さが上の一行表示を実画面で採用。生成の指示文と原本は[部品の制作記録](../画面案/2026-11-03-water-garden-parts/README.md)、上下を入れ替えた実画面は[最終の比較](../画面案/2026-11-03-height-first/README.md)。[組み込み・点検・公開](reviews/2026-11-03-water-garden.md)に現在の状態を記録する。2つの追加画像は通信なし資材に含め、生成原本と比較画像は含めない。既存のcandidates-20261101は変更しない。

発案者が、追加発注の画面の見本 A・B を見比べ、全体の雰囲気を **A「白い陶器」** に決めた（資材ごとに A・B を選ぶのではなく、雰囲気で一括して決める進め方に変更。見本の絵と実画面は一致しないため、実画面で判断する）。

| 資材 | 採用 | 配信用のファイル（scripts/prepare-art.py で候補 A から変換） |
|---|---|---|
| bg-trial | A | public/graphics/bg-trial.webp（1024×1024） |
| title-portrait・title-landscape | A | title-portrait.webp（768×1152）・title-landscape.webp（1280×720） |
| spirit | A | spirit.png（128×192） |
| part-spring・part-glass | A | part-spring-{top,middle,bottom}.png・part-glass-{top,middle,bottom}.png（半分の大きさ） |
| part-basin（台座つき） | A | part-basin.png・part-pedestal-{top,middle}.png |
| fx-fountain・fx-rainbow | A | fx-fountain-01〜06.png・fx-rainbow.png |
| ui-badges | A | 画像は使わず、デザイン表 A を図形（SVG）で再現（src/ui/board.js の badge） |
| sheet-pipe・sheet-ui-parts | A | 配管のつや、画面の部品の質感（白い面・内側の白い二重線・淡い影）を図形と書式で反映 |

- 合わせて約 680KB。通信なしで使う資材に入る。候補（candidates-*）は配信するが、通信なしの資材には入れない
- 部品と背景の境界は、控えめな縁取りと陰影（assets-addendum 1-2章）
- 未対応（絵が必要なもの）：見本 A の地面の下の質感（石の多い土）。図形で代用すると品質が下がるため、Codex に依頼する（assets-addendum 8章）
