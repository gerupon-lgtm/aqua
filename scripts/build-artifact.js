// スマホ確認用に、index.html・CSS・モジュールを1つのページへまとめる（追加のライブラリなし）。
// モジュールは読み込み順に並べ、import 行と export の語を外してつなぐ。名前はファイルをまたいで重ならないようにしてある。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));

const order = [];
const seen = new Set();
function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/^import .* from '(\.[^']+)';$/gm)) visit(resolve(dirname(file), m[1]));
  order.push(file);
}
visit(join(root, 'src/ui/app.js'));

const js = order.map(file => {
  const body = readFileSync(file, 'utf8')
    .replace(/^import .* from '\.[^']+';\r?\n/gm, '')
    .replace(/^export (?=(const|let|function|class|async function) )/gm, '');
  if (/^\s*(import|export)\b/m.test(body)) throw new Error(`${relative(root, file)} にまとめられない import/export があります。`);
  return `// ---- ${relative(root, file).replace(/\\/g, '/')} ----\n${body}`;
}).join('\n');

// 版の同値検査：正典は package.json の version。画面に出す版がずれていたら止める（AGENTS.md「版の管理」）
const shown = /^const APP_VERSION = '([^']+)';$/m.exec(read('src/ui/app.js'))?.[1];
if (shown !== pkg.version) throw new Error(`版がそろっていません：package.json ${pkg.version}、画面 ${shown}`);

const html = read('index.html');
const part = name => {
  const m = new RegExp(`<!-- app:${name}:start -->\\r?\\n([\\s\\S]*?)<!-- app:${name}:end -->`).exec(html);
  if (!m) throw new Error(`index.html に app:${name} の範囲がありません。`);
  return m[1];
};
const css = read('src/ui/style.css');
// 公開時に文書の外枠が付くので、中身だけを書き出す（Artifact の決まり）
const page = `${part('head')}<style>\n${css}</style>\n${part('body')}<script type="module">\n// AQUA NOTES 試作 v${pkg.version}（ビルドで1つにまとめたもの。元は src/）\n${js}</script>\n`;
mkdirSync(join(root, 'artifact'), { recursive: true });
writeFileSync(join(root, 'artifact/aqua-notes.html'), page);
console.log(`artifact/aqua-notes.html を作りました（${order.length} モジュール、${(page.length / 1024).toFixed(1)} KB、v${pkg.version}）`);
