# 採用案の本体への組み込み

2026-11-03、v0.14.12。採用は「高さが上、必要量が下」。実際の本体をビルドして確認した記録。スマホ実機の受け入れとは区別する。公開状態の正本は[点検記録](../../docs/reviews/2026-11-03-water-garden.md)。

- `browser-audit.json`：tests/visual-garden.htmlで全199出題・600描画・1131個の札と口・754組の状態間の座標を確認。エラー0。
- `local-responsive.json`：配信用の実アプリを320×640・390×680・1280×800で表示し、ページのはみ出し0と操作の位置を記録。
- `local-result-layout.json`：実際の操作で1面を100点にしたときの盤面と演出を記録。
- `local-s1-mobile.jpg`、`local-t13-pc.jpg`：実アプリの表示画像。画像は手元のみ保持する。
- `local-dual-result.json`：13面の実操作で左右とも毎秒3・100点、噴水2つ・虹2つ・青の判定札2つ。編集と結果のPCの盤面外枠は一致。`local-t13-perfect-pc.jpg`・`local-t13-perfect-mobile.jpg`で表示を保持。
- `local-diagrams.json`：パーツの説明の5枚が960×360で読み込めることを確認。
- `local-performance.json`：3つの盤で100コマを測定したこのPCの描画時間。実アプリ全体やスマホ実機の性能を示すものではない。
- `geometry-equivalence.json`：グラス・配管の座標、管の道筋・交差、器の横位置、スマホ用の表示範囲の処理が旧版と同じであることを確認。

再検査は通常の開発サーバーで`/tests/visual-garden.html`を開き、「点検する」を押す。出題・計算・描画は本体を読み、比較用の複製は使わない。
