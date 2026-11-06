import test from 'node:test';
import assert from 'node:assert/strict';
import { guideMessage } from '../src/ui/guide-copy.js';
import { LESSONS, PRACTICE_STEPS } from '../src/content/tutorial.js';

test('練習と6面の説明は元の文を保ち、端末に依存せず短い文節の間で折り返せる', () => {
  for (const text of [...PRACTICE_STEPS.map(s => s.text), ...Object.values(LESSONS).map(s => s.intro)]) {
    const markup = guideMessage(text);
    assert.ok(markup.includes('class="phrase"'), text);
    assert.equal(markup.replace(/<strong class="guide-caption">[\s\S]*?<\/strong>/, '').replace(/<[^>]+>/g, ''), text);
    const phrases = markup.replace(/<span class="text-unit">([^<]*)<\/span>/g, '$1');
    const chunks = [...phrases.matchAll(/class="phrase">([^<]+)/g)];
    assert.ok(chunks.length > 0 && chunks.every(m => [...m[1]].length <= 17), text);
  }
});

test('案内の見出し・手順と妖精の名前を本文とは別に示す', () => {
  const markup = guideMessage(PRACTICE_STEPS[0].text, { title: PRACTICE_STEPS[0].title, progress: '1 / 6' });
  assert.match(markup, /aria-label="水の妖精"/);
  assert.equal(markup.match(/<small>([\s\S]*?)<\/small>/)[1].replace(/<[^>]+>/g, ''), '1 / 6');
  assert.ok(markup.includes(PRACTICE_STEPS[0].title));
  for (const s of [...PRACTICE_STEPS, ...Object.values(LESSONS)]) {
    assert.equal(s.phrases.join(''), s.text ?? s.intro);
  }
});

test('動的な答え合わせでも精霊と本文は別の列で、文中のHTMLは実行させない', () => {
  const markup = guideMessage('届いた量は <2> でした。');
  assert.ok(markup.includes('class="guide-copy"'));
  assert.ok(markup.replace(/<[^>]+>/g, '').includes('&lt;2&gt;'));
});
