import { writeFileSync } from 'node:fs';
import { BASES, getCase, modelFor } from '../tests/visual-fixtures.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { renderBoard } from '../src/ui/board.js';
import { renderedLabels, labelConflicts, partConflicts } from '../tests/fixtures/board-layout-audit.js';
import { layoutFor } from '../src/ui/board.js';

const cases = [], issues = [];
for (const base of BASES) for (let q = 0; q < (CHALLENGES[base.id]?.length ?? 1); q++) {
  const item = getCase(base, q), layout = layoutFor(item.stage);
  for (const state of process.argv.includes('--states') ? ['empty', 'perfect', 'all', 'previous-low', 'previous-high'] : ['empty']) {
    const result = modelFor(item, state.startsWith('previous') ? 'empty' : state);
    for (let vi = 0; vi < result.ev.states.length; vi++) {
      const { model } = modelFor(item, state.startsWith('previous') ? 'empty' : state, vi);
      model.layout = layout;
      if (state.startsWith('previous')) model.prevLevels = new Map(item.stage.towers.map(t => [t.id, state === 'previous-low' ? 0 : layout.H]));
      const svg = { id: 'audit', innerHTML: '' };
      renderBoard(svg, model);
      const labels = renderedLabels(svg.innerHTML), pairs = labelConflicts(labels);
      const tag = { stage: base.id, question: q + 1, state, view: model.view.name };
      cases.push({ ...tag, labels: labels.length });
      for (const pair of pairs) issues.push({ ...tag, kind: 'label-label', pair });
      for (const issue of partConflicts(layout, item.stage, labels)) issues.push({ ...tag, ...issue });
      for (const label of labels) if (label.l < 0 || label.r > 360 || label.t < 0 || label.b > 470) issues.push({ ...tag, kind: 'bounds', label });
    }
  }
}
const report = { questions: new Set(cases.map(c => `${c.stage}/${c.question}`)).size, drawings: cases.length, labels: cases.reduce((n, c) => n + c.labels, 0), issues };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 2));
const groups = new Map();
for (const issue of issues) {
  const key = issue.kind === 'label-label' ? issue.pair.map(p => p.text).join(' / ') : `${issue.kind}: ${issue.label?.text ?? issue.pan?.id ?? issue.pedestal?.id} / ${issue.body?.id ?? ''}`;
  if (!groups.has(key)) groups.set(key, { pair: key, count: 0, stages: new Set(), example: issue });
  const row = groups.get(key); row.count++; row.stages.add(issue.stage);
}
console.log(JSON.stringify({ questions: report.questions, drawings: report.drawings, labels: report.labels, issues: issues.length,
  groups: [...groups.values()].map(g => ({ ...g, stages: [...g.stages] })) }, null, 2));
