import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, ContinuousRun, ModeBook, MODES_KEY } from '../src/logic/modes.js';

test('レベル：フリーは上限なし、ビギナーはNG20回まで', () => {
  assert.equal(LEVELS.find(l => l.id === 'free').limit, null);
  assert.equal(LEVELS.find(l => l.id === 'beginner').limit, 20);
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
