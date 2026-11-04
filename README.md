# アクア・ノーツ（AQUA NOTES）

配管をつなぎ、水を出口へ届けるパズル。真横から見た断面で、グラスの水位がグラスハープのように音になる。前作「プリズム・ノーツ」のシリーズ。SIKUMI LAB。

## 現在の状態（2026-11-05）

v0.26.2で「パーツの説明」「遊び方と概要」を、前作の概要一覧→詳細の構成へ再編。ポンプ・排水口・二つの給水塔と、利用可能な自由作成の操作・和音のお題を案内する。実装・検査・公開・資材照合済み。[説明の再構成](docs/reviews/2026-11-05-help-restructure.md)。

Claudeによるv0.26.0の機能実装後、v0.26.1で配置を点検・修整し、公開・資材照合済み。現在は54面と自由作成を含む。練習・お試しの出口管の札、ポンプ・排水口・水門・前回の札、54面と自由作成の器の重なりを修整した。計算・出題・採点・保存・音は変更していない。[今回の範囲と点検記録](docs/reviews/2026-11-05-layout-audit.md)。以下のv0.14.14の表は前回の引き継ぎ時点の履歴であり、現在の機能の残作業を示すものではない。

| 段階 | 状態 |
|---|---|
| 構想 | 構想たたき台 v0.4 |
| 要件定義 | ドラフト v0.4（試行回数の禁止を見直し、2つのモード F-025・F-026 を追加（範囲は未定）、目盛りの音を C のメジャーペンタトニックに） |
| 基本設計 | v0.1 |
| 試作・実装 | 試作中（v0.14.14）。計算・出題の検査・1〜30面・グラスの音・練習面とチュートリアル・選択／連続プレイ・タイトルとメニュー・PWAを実装。器と土等の[見た目](docs/reviews/2026-11-01-visual-finish.md)、[虹の後の結果](docs/reviews/2026-11-01-result-after-rainbow.md)、[PC配置と案内](docs/reviews/2026-11-01-series-and-guide.md)を保持。発案者の実画面の指摘でタイトルの絵・ボタン・光・判定バッジ・分数・台座・開始合図を再調整し、[文字組みを全体点検](docs/reviews/2026-11-02-visual-readability.md)。続いて[開始待機・結果の余白・判定位置・重複文を調整](docs/reviews/2026-11-02-result-refinement.md)。[管の2段の札・凡例・練習の案内](docs/reviews/2026-11-02-pipe-legend.md)を追加。[スマホの盤面縮小を修正](docs/reviews/2026-11-02-mobile-board.md)。[高さの物差しと下部操作](docs/reviews/2026-11-02-height-and-actions.md)を反映。自由作成・初出説明の表示と既読記録・実機の受け入れは未完了 |
| 公開 | 試作を GitHub Pages で公開中（https://aqua.sikumilab.com/ 。2026-11-01 発案者が独自ドメインを設定。旧アドレス https://gerupon-lgtm.github.io/aqua/ は新しいアドレスへ転送される） |

v0.14.14で、実画面で採用したアイボリー・濃い奥線の金縁・金の葉模様と、少し厚い噴水盤を組み込み。説明図も同じ描画へ同期。公開・資材照合・スマホ相当とPCの表示確認済み。[点検](docs/reviews/2026-11-03-ivory-leaf-pan.md)。

v0.14.13で開始合図を700ms待機にし、合図中の操作と、同じ版への更新案内を修正。公開済み。[点検](docs/reviews/2026-11-03-cue-and-update.md)。

v0.14.12で採用した水庭の部品と、必要量が下の札を取り込み、公開済み。[変更・点検・公開](docs/reviews/2026-11-03-water-garden.md)。

v0.14.11では、配管の交差で縦管が切れて見える描画を修正。[変更・点検・公開](docs/reviews/2026-11-03-pipe-crossings.md)。

## 文書

**Claudeへの再開入口：[引き継ぎ資料](docs/handoff-to-claude.md)**（v0.14.14の採用済み表示・実装と残作業・検証・公開手順）。

v0.14.10では、出口の吹き出し口を計算上の高さへ合わせ、必要量・届いた量を「毎秒の量」として表示。器にたまる水位で流量を示す表現をやめた。[変更・点検・公開](docs/reviews/2026-11-03-flow-and-outlet.md)。

- [構想たたき台](構想たたき台_AQUA_NOTES.md)
- [要件定義書](要件定義書_AQUA_NOTES.md)
- [基本設計サマリ](基本設計サマリ.md)
- [AI実装指示](AGENTS.md)
- [処理設計](docs/logic-design.md)・[データ定義](docs/data-model.md)・[画面定義](docs/screens.md)・[タスクと要件対応](docs/tasks.md)・[絵の発注書](docs/assets.md)・[追加の発注書](docs/assets-addendum.md)

## 試作の動かし方

- `npm test`：計算・採点・全30面と出題・保存・描画のテスト
- `npm run check`：構文の確認
- `npm run dev`：開発用サーバー（http://localhost:5173/）
- `npm run build`：GitHub Pages 用の配信資材を `dist/` に作る（通信なし用の sw.js とマニフェストつき）
- `npm run build:artifact`：確認用に1つのページ（`artifact/aqua-notes.html`）へまとめる
- `npm run icons`：アイコン（`public/`）を作り直す

main に送ると、GitHub Actions がテストとビルドを行い、GitHub Pages（https://aqua.sikumilab.com/）へ公開する。
