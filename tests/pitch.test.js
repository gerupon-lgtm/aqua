import test from 'node:test';
import assert from 'node:assert/strict';
import { midiForLevel } from '../src/logic/pitch.js';

// 目盛りの音は C のメジャーペンタトニックの下行（2026-11-01 発案者）
test('目盛りの音：C7・A6・G6・E6・D6・C6・A5…と下がる', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => midiForLevel(n)), [96, 93, 91, 88, 86, 84, 81, 79, 76, 74, 72]);
});

test('どの目盛りの組み合わせでも、短2度（長7度）と増4度が出ない', () => {
  for (let a = 0; a <= 15; a++) {
    for (let b = a + 1; b <= 15; b++) {
      const pc = (midiForLevel(a) - midiForLevel(b)) % 12;
      assert.ok(![1, 6, 11].includes(pc), `目盛り${a}と${b}で${pc}半音`);
    }
  }
});

test('目盛りの間の水位は、隣の目盛りの間の高さになる（音階からずれた音）', () => {
  const mid = midiForLevel('1/2');
  assert.ok(mid < 96 && mid > 93);
  assert.equal(mid, 94.5);
});
