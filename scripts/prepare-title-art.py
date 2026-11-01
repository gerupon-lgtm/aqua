"""タイトル用の採用原本を、絵を切らずに配信用の解像度へ縮める。
通常のbuildは変換済みPNGを使う。原本と指示は画面案/2026-11-02-title-art/。
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / '画面案' / '2026-11-02-title-art'
OUT = ROOT / 'public' / 'graphics'
for original, output, width in (
    ('title-glass-original.png', 'title-glass-v2.png', 384),
    ('title-fountain-original.png', 'title-fountain-v2.png', 384),
    ('spirit-adopted-original.png', 'spirit-detail-v2.png', 256),
):
    image = Image.open(SRC / original).convert('RGBA')
    image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    image.save(OUT / output, optimize=True)
    print(output, image.size, image.getchannel('A').getextrema(), (OUT / output).stat().st_size)
