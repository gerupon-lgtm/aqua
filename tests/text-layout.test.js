import test from 'node:test';
import assert from 'node:assert/strict';
import { frac } from '../src/logic/fraction.js';
import { textMarkup, amountMarkup, deliveryMarkup } from '../src/ui/text-layout.js';
import { STAGES } from '../src/content/stages.js';
import { analyzeStage, evaluate } from '../src/logic/play.js';

test('5/2と約2.50は、大きな分数と小さい補足に分かれ、数値そのものを改変しない', () => {
  const html = amountMarkup(frac('5/2'));
  assert.match(html, /class="amount-exact">5\/2<\/span>/);
  assert.match(html, /class="amount-approx">（約2\.50）<\/span>/);
  assert.equal(html.replace(/<[^>]+>/g, ''), '5/2（約2.50）');
  assert.ok(!amountMarkup(frac(3)).includes('amount-approx'));
});

test('実際に足りない4面の結果は、判定バッジと分数を同じ行の中に混ぜない', () => {
  const stage = STAGES[3], ev = evaluate(stage, { connected: new Set(['SA']), primed: new Set(), thickness: {} }, analyzeStage(stage));
  assert.equal(ev.outlets[0].flow.toString(), '5/2');
  assert.equal(ev.outlets[0].verdict, 'short');
  const html = deliveryMarkup('高い受け皿', ev.outlets[0]);
  assert.match(html, /class="verdict-badge short"/);
  assert.ok(html.includes('足りない'));
  assert.match(html, /class="amount-unit">毎秒<\/small>5\/2/);
});

test('毎秒の値と小さな札の /秒 を数値と離して折り返さない', () => {
  const html = textMarkup('毎秒5/2（約2.50） 必要量2/秒');
  assert.ok(html.includes('class="text-unit">毎秒5/2（約2.50）'));
  assert.ok(html.includes('class="text-unit">2/秒'));
});

test('案内と解説の分数・近似値、ゲームの語は一まとまりで、元の文を保つ', () => {
  const text = '予想どおり！ 高い受け皿に 5/2（約2.50） 届きました。';
  const html = textMarkup(text);
  assert.equal(html.replace(/<[^>]+>/g, ''), text);
  assert.match(html, /class="text-unit">5\/2（約2\.50）/);
  assert.match(html, /class="text-unit">高い受け皿に/);
});

test('グラスの名前、数字の範囲、空白付きの本数も途中で分けない', () => {
  const html = textMarkup('グラスA 1〜6面 2 本');
  for (const unit of ['グラスA', '1〜6面', '2 本']) assert.ok(html.includes(`class="text-unit">${unit}</span>`));
});

test('かっこの必要量と計算記号・細さを、切れ端にしない', () => {
  const text = '（必要量 4）。差 24/5（約4.80） ÷ 細さ 1 ＝ 24/5（約4.80）';
  const html = textMarkup(text);
  assert.equal(html.replace(/<[^>]+>/g, ''), text);
  for (const unit of ['（必要量 4）。', '差 24/5（約4.80）', '÷ 細さ 1', '＝ 24/5（約4.80）']) assert.ok(html.includes(`class="text-unit">${unit}</span>`), unit);
});
