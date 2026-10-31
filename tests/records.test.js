import test from 'node:test';
import assert from 'node:assert/strict';
import { frac } from '../src/logic/fraction.js';
import { ScoreBook, SCORES_KEY, scoreKey, buildRecord } from '../src/logic/records.js';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate } from '../src/logic/play.js';

const memory = (initial = {}) => {
  const data = { ...initial };
  return { data, getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v; } };
};

test('最高点だけを残し、低い点数では上書きしない（C-01）', () => {
  const s = memory();
  const book = new ScoreBook(s);
  assert.equal(book.offer('T1#1@1', frac('75')).saved, true);
  assert.equal(book.offer('T1#1@1', frac('60')).saved, false);
  assert.equal(book.offer('T1#1@1', frac('100')).saved, true);
  assert.equal(new ScoreBook(s).best('T1#1@1').toString(), '100');
});

test('読めない保存は上書きせず、元の内容を残す', () => {
  const s = memory({ [SCORES_KEY]: '{壊れた' });
  const book = new ScoreBook(s);
  const r = book.offer('T1#1@1', frac('100'));
  assert.equal(r.saved, false);
  assert.match(r.message, /消さずに残しています/);
  assert.equal(s.data[SCORES_KEY], '{壊れた');
});

test('保存に失敗しても止まらず、理由を返す', () => {
  const book = new ScoreBook({ getItem: () => null, setItem: () => { throw new Error('quota'); } });
  const r = book.offer('T1#1@1', frac('100'));
  assert.equal(r.saved, false);
  assert.match(r.message, /保存できませんでした/);
  assert.equal(book.best('T1#1@1').toString(), '100');
});

test('実行記録：面・回路・計算結果・判定がそろい、日時は世界標準時', () => {
  const stage = STAGES[0];
  const a = analyzeStage(stage);
  const ev = evaluate(stage, ['SA', 'AB'], a);
  const rec = buildRecord({ stage, config: ['SA', 'AB'], ev, appVersion: '0.4.0', now: new Date(Date.UTC(2026, 10, 1, 3, 4, 5)) });
  assert.equal(rec.createdAt, '2026-11-01T03:04:05.000Z');
  assert.deepEqual(rec.circuit.connected, ['AB', 'SA']);
  assert.equal(rec.towers.A.level, '4');
  assert.equal(rec.pipes.SA.flow, '2');
  assert.equal(rec.judge.outcome, 'clear');
  assert.equal(scoreKey(stage), 'T1#1@1');
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(rec)));
});
