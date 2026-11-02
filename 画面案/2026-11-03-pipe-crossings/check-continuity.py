from pathlib import Path
from PIL import Image
import json

folder = Path(__file__).resolve().parent
point = json.loads((folder / 'probe.json').read_text(encoding='utf-8'))
report = {'point': point, 'colors': {}}
for name in ['before.jpg', 'after.jpg']:
    image = Image.open(folder / name).convert('RGB')
    rgb = image.getpixel((round(point['x']), round(point['y'])))
    report['colors'][name] = {'rgb': rgb, 'pipeVisible': min(rgb) > 210}
(folder / 'continuity-pixels.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report))
assert not report['colors']['before.jpg']['pipeVisible']
assert report['colors']['after.jpg']['pipeVisible']
