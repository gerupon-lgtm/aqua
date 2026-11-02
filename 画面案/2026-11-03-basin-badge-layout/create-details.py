from pathlib import Path
import re

folder = Path(__file__).resolve().parent
sections = []
for key, label in [('a', 'A｜高さを器のすぐ上へ'), ('b', 'B｜高さを器の左下へ')]:
    svg = (folder / f'board-{key}.svg').read_text(encoding='utf-8')
    svg = re.sub(r'viewBox="[^"]+"', 'viewBox="110 178 145 124"', svg, count=1)
    svg = svg.replace('id="board"', f'id="detail-{key}"').replace('http://localhost:5187/public/', '../../public/')
    sections.append('<section><h2>' + label + '</h2>' + svg + '</section>')
head = '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>噴水盤の札 配置拡大</title><link rel="stylesheet" href="../../src/ui/style.css"><style>body{height:auto;padding:20px;box-sizing:border-box;background:#e5eef7}h1{font-size:21px;margin:0 0 6px}p{margin:0 0 14px;font-size:14px}main{display:flex;gap:24px}section{width:390px}h2{font-size:17px;margin:0 0 10px}svg{display:block;width:390px;height:334px;background:#eef5fb;border:1px solid #bbcedf;border-radius:10px}</style><h1>水が流れた状態｜札の配置を拡大</h1><p>同じ盤面の拡大です。水位・吹き出し口・配管の接続は共通です。</p><main>'
(folder / 'details.html').write_text(head + ''.join(sections) + '</main></html>', encoding='utf-8')
