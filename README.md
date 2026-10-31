# アクア・ノーツ（AQUA NOTES）

水路をつなぎ、水を出口へ届けるパズル。真横から見た断面で、塔の水位がグラスハープのように音になる。前作「プリズム・ノーツ」のシリーズ。SIKUMI LAB。

## 現在の状態（2026-11-01）

| 段階 | 状態 |
|---|---|
| 構想 | 構想たたき台 v0.4 |
| 要件定義 | ドラフト v0.3（【想定】はすべて承認済み。文書全体の確認は未実施） |
| 基本設計 | v0.1 |
| 試作・実装 | 試作中（v0.3.0：お試し3面、計算・盤面・音・結果の解説・FM合成の比較。サイフォン・水門・保存・PWAは未実装。スマホ確認用の非公開ページあり、実機は未確認） |
| 公開 | 未公開（予定：aqua.sikumilab.com） |

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
