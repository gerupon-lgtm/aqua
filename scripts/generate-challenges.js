// 出題の生成と検査（logic-design 7章、`npm run generate:challenges`）。
// 面の定義の vary から出題を8つずつ作り、src/content/challenges.js に書き出す。手で書き換えない。
// `--check` を付けると、書き出さずに、今のファイルと生成結果が一致するかだけを確かめる（公開前の点検用）。
import { readFileSync, writeFileSync } from 'node:fs';
import { STAGES } from '../src/content/stages.js';
import { generateAll, GENERATOR_VERSION } from '../src/logic/generate.js';

const OUT = new URL('../src/content/challenges.js', import.meta.url);

export function renderChallenges(banks) {
  const lines = [
    '// 生成ファイル：scripts/generate-challenges.js が書き出す。手で書き換えない（logic-design 7章、D-02）。',
    `// 生成器の版 ${GENERATOR_VERSION}。各出題に、乱数の種・系統・検査結果（満点のつなぎ方・部分点のつなぎ方・期待水位）を持つ。`,
    `export const CHALLENGES = ${JSON.stringify(banks, null, 2)};`,
    ''
  ];
  return lines.join('\n');
}

const started = Date.now();
const text = renderChallenges(generateAll(STAGES));
if (process.argv.includes('--check')) {
  const current = readFileSync(OUT, 'utf8');
  if (current !== text) {
    console.error('src/content/challenges.js が生成結果と一致しません。npm run generate:challenges を実行してください。');
    process.exit(1);
  }
  console.log(`出題は最新です（${((Date.now() - started) / 1000).toFixed(1)}秒）。`);
} else {
  writeFileSync(OUT, text);
  console.log(`src/content/challenges.js を書き出しました（${((Date.now() - started) / 1000).toFixed(1)}秒）。`);
}
