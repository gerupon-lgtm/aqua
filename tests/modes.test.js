import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, ContinuousRun, ModeBook, MODES_KEY, continuousRecordChange } from '../src/logic/modes.js';

test('レベル：フリーは上限なし、ビギナー20回・ノーマル10回・エキスパート5回まで', () => {
  assert.deepEqual(LEVELS.map(l => [l.id, l.limit]), [['free', null], ['beginner', 20], ['normal', 10], ['expert', 5]]);
});

test('連続プレイの記録：全面クリアのNGは少ないときだけ置き換え、古い形の記録も読める', () => {
  const store = new Map([[MODES_KEY, JSON.stringify({ fewest: { S7: 2 }, continuous: { beginner: 30 } })]]);
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const book = new ModeBook(storage);
  assert.equal(book.bestContinuous('beginner'), 30);
  assert.equal(book.allClearNg('beginner'), null);
  assert.equal(book.offerContinuous('expert', 0), false);
  assert.equal(book.offerAllClear('beginner', 4), true);
  assert.equal(book.offerAllClear('beginner', 4), false);
  assert.equal(book.offerAllClear('beginner', 2), true);
  assert.equal(new ModeBook(storage).allClearNg('beginner'), 2);
  assert.equal(new ModeBook(storage).fewest('S7'), 2);
});

test('連続プレイの記録更新：遊び始めの記録と比べ、面数が増えたか、全面クリアでNGが減ったときだけ', () => {
  const run = (cleared, ng, complete = false) => ({ cleared, ng, complete, stageCount: 30 });
  assert.equal(continuousRecordChange({ best: null, allClearNg: null }, run(0, 21)), null);
  assert.deepEqual(continuousRecordChange({ best: null, allClearNg: null }, run(3, 21)), { from: null, to: 3, fromNg: null, toNg: null });
  assert.deepEqual(continuousRecordChange({ best: 8, allClearNg: null }, run(12, 21)), { from: 8, to: 12, fromNg: null, toNg: null });
  assert.equal(continuousRecordChange({ best: 12, allClearNg: null }, run(12, 21)), null);
  assert.deepEqual(continuousRecordChange({ best: 12, allClearNg: null }, run(30, 4, true)), { from: 12, to: 30, fromNg: null, toNg: 4 });
  assert.deepEqual(continuousRecordChange({ best: 30, allClearNg: 4 }, run(30, 2, true)), { from: 30, to: 30, fromNg: 4, toNg: 2 });
  assert.equal(continuousRecordChange({ best: 30, allClearNg: 2 }, run(30, 2, true)), null);
});

test('連続プレイ：NGだけを数え、上限を超えるとゲームオーバー。部分点のクリアでも次へ', () => {
  const run = new ContinuousRun('beginner', 30);
  assert.equal(run.record('clear'), 'next');
  run.advance();
  assert.equal(run.record('perfect'), 'next');
  run.advance();
  for (let i = 0; i < 20; i++) assert.equal(run.record('ng'), 'retry');
  assert.equal(run.left, 0);
  assert.equal(run.record('ng'), 'gameover');
  assert.equal(run.cleared, 2);
  assert.throws(() => run.record('clear'));
});

test('連続プレイ：最後の面をクリアすると全面クリア。フリーはNGで終わらない', () => {
  const run = new ContinuousRun('free', 3);
  for (let i = 0; i < 50; i++) assert.equal(run.record('ng'), 'retry');
  assert.equal(run.left, null);
  assert.equal(run.record('clear'), 'next'); run.advance();
  assert.equal(run.record('clear'), 'next'); run.advance();
  assert.equal(run.record('perfect'), 'complete');
  assert.equal(run.cleared, 3);
});

test('記録：最少の試行回数と、連続プレイの最高を、よいときだけ置き換えて保存する。保存できなくても動く', () => {
  const store = new Map();
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const book = new ModeBook(storage);
  assert.equal(book.offerTrials('S7', 3), true);
  assert.equal(book.offerTrials('S7', 5), false);
  assert.equal(book.offerTrials('S7', 2), true);
  assert.equal(book.offerTrials('S7', 0), false);
  assert.equal(book.offerContinuous('beginner', 12), true);
  assert.equal(book.offerContinuous('beginner', 10), false);
  const again = new ModeBook(storage);
  assert.equal(again.fewest('S7'), 2);
  assert.equal(again.bestContinuous('beginner'), 12);
  assert.ok(JSON.parse(store.get(MODES_KEY)).fewest);
  const broken = new ModeBook({ getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } });
  assert.equal(broken.offerTrials('S7', 4), true);
  assert.equal(broken.fewest('S7'), 4);
});
