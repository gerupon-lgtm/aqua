from pathlib import Path
import re

folder = Path(__file__).resolve().parent
root = folder.parents[1]
source = (root / 'src/ui/board.js').read_text(encoding='utf-8')
helpers = source[source.index('const BADGE_TONE ='):source.index('// 採用した絵')]
(folder / 'badge.js').write_text('// v0.14.10本番のバッジ描画をそのまま使う比較用の複製。\nconst VIEW_W = 360;\n' + helpers + '\nexport { badge };\n', encoding='utf-8')
shell = (folder / 'app-shell.html').read_text(encoding='utf-8')
shell = re.sub(r'(<svg\b[^>]*\bid="board"[^>]*>)[\s\S]*?</svg>', r'\1</svg>', shell, count=1)
shell = shell.replace('v0.14.10', 'v0.14.10 配置案')
(folder / 'screen.html').write_text('<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>噴水盤の高さバッジ配置案</title><link rel="stylesheet" href="../../src/ui/style.css"><body>' + shell + '<script type="module" src="./preview.js"></script></body></html>', encoding='utf-8')
