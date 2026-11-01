"""採用した絵（候補 A、2026-11-01 発案者が全体の雰囲気 A を選択）を、配信用の大きさに変換して public/graphics/ に置く。

候補は public/graphics/candidates-20261101/ にあり、数MBある。通信なしで使う資材に入れるため、
表示の大きさに合わせて縮め、背景は WebP にする。何度実行しても同じ結果になる。
使い方：python scripts/prepare-art.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public' / 'graphics' / 'candidates-20261101'
OUT = ROOT / 'public' / 'graphics'


def fit(img, width):
    if img.width <= width:
        return img
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img, name, **opts):
    path = OUT / name
    img.save(path, **opts)
    print(f'{name}: {img.width}x{img.height} {path.stat().st_size // 1024}KB')


def main():
    # 背景（盤面の空・タイトル）：不透明なので WebP
    save(fit(Image.open(SRC / 'bg-trial' / 'bg-trial-a.png').convert('RGB'), 1024), 'bg-trial.webp', quality=80, method=6)
    save(fit(Image.open(SRC / 'title-portrait' / 'title-portrait-a.png').convert('RGB'), 768), 'title-portrait.webp', quality=80, method=6)
    save(fit(Image.open(SRC / 'title-landscape' / 'title-landscape-a.png').convert('RGB'), 1280), 'title-landscape.webp', quality=80, method=6)
    # 水の精霊：表示は 26×38 ほど。高解像度の画面でもにじまないよう 128 幅
    save(fit(Image.open(SRC / 'spirit' / 'spirit-a.png').convert('RGBA'), 128), 'spirit.png', optimize=True)
    # 部品（透過）：泉・グラスは上・中・下、噴水盤は1枚。表示の4倍で作られているので半分に縮める
    for part, pieces in (('part-spring', ('top', 'middle', 'bottom')), ('part-glass', ('top', 'middle', 'bottom'))):
        for p in pieces:
            img = Image.open(SRC / part / f'{part}-a-{p}.png').convert('RGBA')
            save(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), f'{part}-{p}.png', optimize=True)
    img = Image.open(SRC / 'part-basin' / 'part-basin-a.png').convert('RGBA')
    save(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), 'part-basin.png', optimize=True)
    # 口の高い噴水盤の台座：上と、縦に伸ばす中
    for piece in ('top', 'middle'):
        img = Image.open(SRC / 'part-basin' / f'part-basin-pedestal-a-{piece}.png').convert('RGBA')
        save(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), f'part-pedestal-{piece}.png', optimize=True)
    # 噴水（6コマ）と虹
    for n in range(1, 7):
        img = Image.open(SRC / 'fx-fountain' / f'fx-fountain-a-0{n}.png').convert('RGBA')
        save(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), f'fx-fountain-0{n}.png', optimize=True)
    img = Image.open(SRC / 'fx-rainbow' / 'fx-rainbow-a.png').convert('RGBA')
    save(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), 'fx-rainbow.png', optimize=True)


if __name__ == '__main__':
    main()
