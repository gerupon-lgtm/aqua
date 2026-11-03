import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate } from '../src/logic/play.js';
import { frac } from '../src/logic/fraction.js';
import { LESSONS, lessonFor, buildQuestion, answerLine, TutorialBook, TUTORIAL_KEY } from '../src/content/tutorial.js';

const config = ids => ({ connected: new Set(ids), primed: new Set(), thickness: {} });
const evalOf = (stage, ids) => evaluate(stage, config(ids), analyzeStage(stage));

test('お試し1〜6面すべてに教えがあり、それ以外の面にはない', () => {
  for (const s of STAGES.slice(0, 6)) assert.ok(lessonFor(s)?.intro, `${s.number}面の教えがない`);
  for (const s of STAGES.slice(6)) assert.equal(lessonFor(s), null);
  // 下の欄の案内（3行）に収まる長さ
  for (const [id, l] of Object.entries(LESSONS)) assert.ok(l.intro.length <= 52, `${id} の教えが長い（${l.intro.length}字）`);
});

test('1面：太1を2本縦につなぐと、届く量は 6÷(1+1+口1)＝2。正解を含む3つの選択肢を小さい順に出す', () => {
  const stage = STAGES[0];
  for (let i = 0; i < 20; i++) {
    let seed = i / 20;
    const q = buildQuestion(stage, evalOf(stage, ['SA', 'AB']), () => { seed = (seed + 0.37) % 1; return seed; });
    assert.equal(q.answer.toString(), '2');
    assert.equal(q.choices.length, 3);
    assert.ok(q.choices.some(c => c.value === '2'));
    const values = q.choices.map(c => frac(c.value));
    for (let k = 1; k < values.length; k++) assert.ok(values[k - 1].lt(values[k]), '小さい順で重なりがない');
    assert.ok(values.every(v => v.sign() > 0));
  }
});

test('正解の位置が毎回同じにならない', () => {
  const stage = STAGES[0];
  const ev = evalOf(stage, ['SA', 'AB']);
  const places = new Set();
  for (let i = 0; i < 30; i++) {
    let x = (i * 0.137) % 1;
    const q = buildQuestion(stage, ev, () => { x = (x + 0.61) % 1; return x; });
    places.add(q.choices.findIndex(c => c.value === '2'));
  }
  assert.ok(places.size >= 2);
});

test('届かないつなぎ方では問いを出さない。水門の面は開いているときを聞く', () => {
  assert.equal(buildQuestion(STAGES[0], evalOf(STAGES[0], ['SA'])), null);
  const gate = STAGES[5];
  const q = buildQuestion(gate, evalOf(gate, ['SB']));
  assert.ok(q.text.startsWith('水門が開いているとき'));
});

test('答え合わせの文：当たりとはずれ', () => {
  const q = buildQuestion(STAGES[0], evalOf(STAGES[0], ['SA', 'AB']));
  assert.match(answerLine(q, '2'), /^予想どおり/);
  assert.match(answerLine(q, '4'), /^予想は毎秒4、実際は毎秒2/);
});

test('記録：初めての面だけ案内し、完了・スキップを覚える。ふりかえりでは出す。保存できなくても動く', () => {
  const store = new Map();
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const [s1, s2] = STAGES;
  let book = new TutorialBook(storage);
  assert.ok(book.active(s1));
  book.complete(s1);
  assert.ok(!book.active(s1));
  assert.ok(book.active(s1, true), 'ふりかえり');
  book = new TutorialBook(storage);
  assert.ok(!book.active(s1), '完了を覚えている');
  assert.ok(book.active(s2));
  book.skip();
  assert.ok(!new TutorialBook(storage).active(s2), 'スキップを覚えている');
  assert.ok(!book.active(STAGES[6]), 'お試し以外は案内しない');
  const broken = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
  const b2 = new TutorialBook(broken);
  assert.ok(b2.active(s1));
  b2.complete(s1);
  assert.ok(!b2.active(s1));
  assert.ok(JSON.parse(store.get(TUTORIAL_KEY)).skipped);
});

test('練習面：太1を1本つなぐと 4÷(1＋口1)＝2 で100点。手順の光らせる配管が実在する', async () => {
  const { PRACTICE, PRACTICE_STEPS, practiceResultText } = await import('../src/content/tutorial.js');
  const ev = evaluate(PRACTICE, config(['P1']), analyzeStage(PRACTICE));
  assert.equal(ev.outlets[0].flow.toString(), '2');
  assert.equal(ev.outcome, 'perfect');
  assert.notEqual(evaluate(PRACTICE, config(['P2']), analyzeStage(PRACTICE)).outcome, 'perfect');
  for (const step of PRACTICE_STEPS) {
    assert.ok(step.text.length <= 52, `手順の文が長い：${step.text}`);
    for (const ref of [step.target, step.until]) {
      const id = ref.split(':')[1];
      if (id) assert.ok(PRACTICE.candidates.some(c => c.id === id), `${ref} の配管がない`);
    }
  }
  assert.ok(practiceResultText('ng').length <= 52 && practiceResultText('perfect').length <= 52);
  assert.equal(lessonFor(PRACTICE), null, '練習面にはお試し面の予想の問いを出さない');
});

test('新しいパーツの初出説明は6・7・13・19・25面に1つずつあり、挿絵がある', async () => {
  const { PART_INTROS, partIntroFor } = await import('../src/content/tutorial.js');
  const { STAGES } = await import('../src/content/stages.js');
  const { existsSync } = await import('node:fs');
  assert.deepEqual(Object.keys(PART_INTROS).map(id => STAGES.find(s => s.id === id).number), [6, 7, 13, 19, 25]);
  for (const intro of Object.values(PART_INTROS)) {
    assert.ok(existsSync(new URL(`../public/graphics/intro-${intro.part}.svg`, import.meta.url)));
    assert.ok(intro.title && intro.alt && intro.lines.length >= 2);
  }
  assert.equal(partIntroFor(STAGES[0]), null);
});

test('パーツの既読は保存され、チュートリアルのスキップとは別。古い形の記録も読める', async () => {
  const { TutorialBook, TUTORIAL_KEY } = await import('../src/content/tutorial.js');
  const store = new Map([[TUTORIAL_KEY, JSON.stringify({ done: { T1: true }, skipped: true })]]);
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const book = new TutorialBook(storage);
  assert.equal(book.partSeen('gate'), false);
  book.seePart('gate');
  const again = new TutorialBook(storage);
  assert.equal(again.partSeen('gate'), true);
  assert.equal(again.partSeen('siphon'), false);
  assert.equal(again.data.skipped, true);
  assert.equal(again.data.done.T1, true);
});
