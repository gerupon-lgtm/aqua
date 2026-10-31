// アプリのアイコン（PNG）を作る。追加のライブラリなしで、node:zlib だけで書き出す。
// 図柄：明るい青の地に、白い泉と、水位の違う3つの塔（試作の仮。見た目の確定は T-13）
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function draw(size) {
  const px = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b]) => { const i = (y * size + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255; };
  const sky = [42, 109, 181];
  const glass = [235, 244, 252];
  const water = [140, 205, 243];
  const deep = [29, 79, 136];
  const u = size / 16;
  const towers = [[3.2, 9.5, deep], [7.0, 6.5, water], [10.8, 4.0, water]]; // [左端, 水位, 色]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let c = sky;
      const gx = x / u;
      const gy = (size - y) / u; // 下からの高さ
      if (gy < 3) c = [236, 229, 214];
      for (const [left, level, color] of towers) {
        if (gx >= left && gx <= left + 2.2 && gy >= 3 && gy <= 12.5) c = gy <= 3 + level ? color : glass;
      }
      set(x, y, c);
    }
  }
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8bit RGBA
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(join(root, 'public'), { recursive: true });
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(join(root, 'public', name), draw(size));
}
console.log('public/ にアイコンを作りました');
