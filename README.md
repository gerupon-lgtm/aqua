# アクア・ノーツ（AQUA NOTES）

水路をつなぎ、水を出口へ届けるパズル。真横から見た断面で、グラスの水位がグラスハープのように音になる。前作「プリズム・ノーツ」のシリーズ。SIKUMI LAB。

## 現在の状態（2026-11-01）

| 段階 | 状態 |
|---|---|
| 構想 | 構想たたき台 v0.4 |
| 要件定義 | ドラフト v0.3（【想定】はすべて承認済み。文書全体の確認は未実施） |
| 基本設計 | v0.1 |
| 試作・実装 | 試作中（v0.6.3：お試し1〜4・6、13面・25面の先行版。計算・盤面・音・解説、水門、太さを変えられる水路、サイフォンと桶、口の高い受け皿、選択肢のトースト、操作音とNGのジングル、成績の自動保存、実行記録の書き出し、通信なしの利用（PWA）。GitHub Pages に公開。実機は一部のみ発案者が確認。自由作成・チュートリアル・出題の生成（各面8つ）は未実装） |
| 公開 | 試作を GitHub Pages で公開中（https://gerupon-lgtm.github.io/aqua/）。独自ドメイン aqua.sikumilab.com は未設定 |

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

main に送ると、GitHub Actions がテストとビルドを行い、GitHub Pages（https://gerupon-lgtm.github.io/aqua/）へ公開する。
