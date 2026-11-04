import test from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICE } from '../src/content/tutorial.js';
import { STAGES } from '../src/content/stages.js';
import { layoutFor, basinPlacement, outletLabelPositions, renderBoard, pipePath } from '../src/ui/board.js';
import { getCase, modelFor, freeVisualCases, freeModelFor } from './visual-fixtures.js';
import { renderedLabels, labelConflicts, partConflicts } from './fixtures/board-layout-audit.js';
import { equipmentAnnotations } from '../src/ui/board-label-geometry.js';

test('練習と1面は空いている右側へ出口管の札を置き、グラスの縁を覆わない', () => {
  for (const stage of [PRACTICE, STAGES[0]]) {
    const layout = layoutFor(stage);
    const outlet = stage.outlets[0];
    const pan = basinPlacement(layout, outlet);
    const label = outletLabelPositions(layout, stage).get(outlet.id);
    assert.ok(label.x > pan.cx && label.x - 13.65 > layout.nodes.get(outlet.tower).cx + 21.5,
      `${stage.id}: 右の空きではなくグラス側に札がある (${label.x}, ${label.y})`);
  }
});

test('追加部品の札・前回の札・器が、別の札や別のグラスを覆わない', () => {
  for (const base of [PRACTICE, ...STAGES]) {
    const item = getCase(base);
    for (const state of ['empty', 'perfect', 'all', 'previous']) {
      const { model } = modelFor(item, state === 'previous' ? 'empty' : state);
      if (state === 'previous') model.prevLevels = new Map(base.towers.map(t => [t.id, 0]));
      const svg = { innerHTML: '' }; renderBoard(svg, model);
      const labels = renderedLabels(svg.innerHTML), conflicts = [...labelConflicts(labels), ...partConflicts(model.layout, model.stage, labels)];
      assert.equal(conflicts.length, 0, `${base.id}/${state}: ${JSON.stringify(conflicts[0])}`);
      if (state === 'previous') assert.ok(svg.innerHTML.lastIndexOf('>前回</text>') > svg.innerHTML.indexOf('<g class="badge-foreground">'));
    }
  }
});

test('ポンプの案内は入口の高さを保ち、排水口の札はグラスの底を空ける', () => {
  for (const stage of STAGES) {
    const layout = layoutFor(stage), labels = equipmentAnnotations(layout, stage, pipePath);
    for (const [id, p] of labels.pumps) assert.equal(p.anchor.y, layout.yOf(Number(stage.candidates.find(c => c.id === id).siphon.inlet)));
    for (const p of labels.drains.values()) assert.ok(p.b < 340, `${stage.id}: 排水口の札が低い水位を覆う`);
    for (const p of labels.gateBodies) assert.ok(p.b <= 470, `${stage.id}: 水門が盤外に切れる`);
  }
});

test('点検用の満点配置は、ポンプと排水口を含めて現在の出題と一致する', () => {
  for (const index of [30, 36, 48, 53]) assert.equal(modelFor(getCase(STAGES[index]), 'perfect').ev.outcome, 'perfect');
});

test('自由作成の空の配置・見本・高い器・持ち上げた管も点検する', () => {
  for (const item of freeVisualCases()) for (const phase of ['edit', 'result']) {
    const model = freeModelFor(item, phase), svg = { innerHTML: '' }; renderBoard(svg, model);
    const labels = renderedLabels(svg.innerHTML), conflicts = [...labelConflicts(labels), ...partConflicts(model.layout, model.stage, labels)];
    assert.equal(conflicts.length, 0, `自由/${item.id}/${phase}: ${JSON.stringify(conflicts[0])}`);
  }
});
