import test from 'node:test';
import assert from 'node:assert/strict';
import { guideMessage } from '../src/ui/guide-copy.js';
import { LESSONS, PRACTICE_STEPS } from '../src/content/tutorial.js';

test('練習と6面の説明は元の文を保ち、端末に依存せず短い文節の間で折り返せる', () => {
  for (const text of [...PRACTICE_STEPS.map(s => s.text), ...Object.values(LESSONS).map(s => s.intro)]) {
    const markup = guideMessage(text);
    assert.ok(markup.includes('class="phrase"'), text);
    assert.equal(markup.replace(/<[^>]+>/g, ''), text);
    const phrases = markup.replace(/<span class="text-unit">([^<]*)<\/span>/g, '$1');
    const chunks = [...phrases.matchAll(/class="phrase">([^<]+)/g)];
    assert.ok(chunks.length > 0 && chunks.every(m => [...m[1]].length <= 17), text);
  }
});

test('動的な答え合わせでも精霊と本文は別の列で、文中のHTMLは実行させない', () => {
  const markup = guideMessage('届いた量は <2> でした。');
  assert.ok(markup.includes('class="guide-copy"'));
  assert.ok(markup.replace(/<[^>]+>/g, '').includes('&lt;2&gt;'));
});
