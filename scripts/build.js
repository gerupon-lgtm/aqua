// GitHub Pages 用の配信資材を dist/ に作る（前作 prism の scripts/build.js と同じ形）。
// 資材は版ごとのフォルダ（v0.3.0/ など）に置き、通信なしで使うための sw.js とマニフェストを添える。
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, posix, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');
const version = JSON.parse(read('package.json')).version;
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('版番号は x.y.z の形にしてください。');
// 版の同値検査：正典は package.json。画面に出す版がずれていたら止める（AGENTS.md「版の管理」）
const shown = /^const APP_VERSION = '([^']+)';$/m.exec(read('src/ui/app.js'))?.[1];
if (shown !== version) throw new Error(`版がそろっていません：package.json ${version}、画面 ${shown}`);

const output = join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const prefix = `v${version}`;
const assets = [];
function copyTree(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const source = posix.join(dir, entry.name);
    if (entry.isDirectory()) { if (source !== 'src/pwa') copyTree(source); continue; }
    if (!/\.(js|css|png|svg|webp|ttf)$/.test(entry.name)) continue;
    const target = posix.join(prefix, source);
    mkdirSync(join(output, posix.dirname(target)), { recursive: true });
    copyFileSync(join(root, source), join(output, target));
    // 絵の候補（public/graphics/candidates-*）は見比べのために配信するが、通信なしで使う資材には入れない。
    // 候補は数十MBあり、保存すると最初の読み込みが重くなるため（2026-11-01）
    if (source.includes('/candidates-')) continue;
    assets.push(`./${target}`);
  }
}
copyTree('src');
copyTree('public');
// 同梱するMontserratの利用条件も、配信するファイルに添える。
mkdirSync(join(output, prefix, 'public/fonts'), { recursive: true });
copyFileSync(join(root, 'public/fonts/OFL.txt'), join(output, prefix, 'public/fonts/OFL.txt'));

let index = read('index.html');
if (!index.includes('<!-- OFFLINE_METADATA -->')) throw new Error('index.html に OFFLINE_METADATA の印がありません。');
index = index
  .replaceAll('./src/', `./${prefix}/src/`)
  .replace('<!-- OFFLINE_METADATA -->', `<meta name="aqua-offline" content="enabled"><link rel="manifest" href="./manifest.webmanifest"><link rel="icon" href="./${prefix}/public/icon-192.png"><link rel="apple-touch-icon" href="./${prefix}/public/apple-touch-icon.png"><meta name="theme-color" content="#eef5fb">`);
writeFileSync(join(output, 'index.html'), index);

const manifest = {
  id: './', name: 'アクア・ノーツ', short_name: 'AQUA NOTES', lang: 'ja', start_url: './', scope: './',
  display: 'standalone', background_color: '#eef5fb', theme_color: '#eef5fb',
  icons: [192, 512].map(size => ({ src: `./${prefix}/public/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' }))
};
writeFileSync(join(output, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

const all = ['./index.html', './manifest.webmanifest', ...assets];
const hashes = Object.fromEntries(all.map(a => [a, createHash('sha256').update(readFileSync(join(output, a))).digest('hex')]));
writeFileSync(join(output, 'build-info.json'), JSON.stringify({ version, commit: process.env.GITHUB_SHA ?? null, assets: all, hashes }, null, 2));
const worker = read('src/pwa/worker.js').replace('__AQUA_VERSION__', version).replace('__AQUA_ASSETS__', JSON.stringify(all));
writeFileSync(join(output, 'sw.js'), worker);
writeFileSync(join(output, '.nojekyll'), '');
console.log(`dist/ に v${version} を作りました（通信なし用の資材 ${all.length} 件）`);
