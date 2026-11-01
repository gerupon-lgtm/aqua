# アクア・ノーツ（AQUA NOTES）

配管をつなぎ、水を出口へ届けるパズル。真横から見た断面で、グラスの水位がグラスハープのように音になる。前作「プリズム・ノーツ」のシリーズ。SIKUMI LAB。

## 現在の状態（2026-11-01）

| 段階 | 状態 |
|---|---|
| 構想 | 構想たたき台 v0.4 |
| 要件定義 | ドラフト v0.3（【想定】はすべて承認済み。文書全体の確認は未実施） |
| 基本設計 | v0.1 |
| 試作・実装 | 試作中（v0.9.0：1〜30面。お試し1〜6は固定、7〜30面は検査済みの出題を各8つ用意し、面を選ぶたびに抽選（npm run generate:challenges）。計算・盤面・音・解説、水門、太さを変えられる配管、サイフォンと桶、口の高い受け皿、選択肢のトースト、操作音とNGのジングル、クリアの噴水と100点の虹、成績の自動保存、実行記録の書き出し、通信なしの利用（PWA）。GitHub Pages に公開。実機は一部のみ発案者が確認。自由作成・チュートリアルは未実装。面の難しさは試遊で確認する） |
| 公開 | 試作を GitHub Pages で公開中（https://aqua.sikumilab.com/ 。2026-11-01 発案者が独自ドメインを設定。旧アドレス https://gerupon-lgtm.github.io/aqua/ は新しいアドレスへ転送される） |

## 文書

- [構想たたき台](構想たたき台_AQUA_NOTES.md)
- [要件定義書](要件定義書_AQUA_NOTES.md)
- [基本設計サマリ](基本設計サマリ.md)
- [AI実装指示](AGENTS.md)
- [処理設計](docs/logic-design.md)・[データ定義](docs/data-model.md)・[画面定義](docs/screens.md)・[タスクと要件対応](docs/tasks.md)

## 試作の動かし方

- `npm test`：計算・採点・お試し3面のテスト
- `npm run check`：構文の確認
- `npm run dev`：開発用サーバー（http://localhost:5173/）
- `npm run build`：GitHub Pages 用の配信資材を `dist/` に作る（通信なし用の sw.js とマニフェストつき）
- `npm run build:artifact`：確認用に1つのページ（`artifact/aqua-notes.html`）へまとめる
- `npm run icons`：アイコン（`public/`）を作り直す

main に送ると、GitHub Actions がテストとビルドを行い、GitHub Pages（https://aqua.sikumilab.com/）へ公開する。
