import { BASES, getCase, modelFor, freeVisualCases, freeModelFor } from './visual-fixtures.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { renderBoard, layoutFor } from '../src/ui/board.js';
import { renderedLabels, labelConflicts, partConflicts } from './fixtures/board-layout-audit.js';

const stage = document.querySelector('#stage'), question = document.querySelector('#question'), state = document.querySelector('#state');
const preview = document.querySelector('#preview'), auditBoard = document.querySelector('#audit-board'), report = document.querySelector('#report');
const frees = freeVisualCases(), states = ['empty', 'perfect', 'all', 'previous-low', 'previous-high'];
stage.innerHTML = BASES.map(s => `<option value="${s.id}">${s.number} ${s.title}</option>`).join('') + frees.map(s => `<option value="FREE/${s.id}">自由：${s.id}</option>`).join('');
const params = new URLSearchParams(location.search);
if ([...stage.options].some(o => o.value === params.get('stage'))) stage.value = params.get('stage');
if (states.includes(params.get('state'))) state.value = params.get('state');
function makeModel(item, name, index = 0) {
  const { model } = modelFor(item, name.startsWith('previous') ? 'empty' : name, index);
  if (name.startsWith('previous')) model.prevLevels = new Map(item.stage.towers.map(t => [t.id, name === 'previous-low' ? 0 : model.layout.H]));
  return model;
}
function redraw() {
  if (stage.value.startsWith('FREE/')) renderBoard(preview, freeModelFor(frees.find(s => `FREE/${s.id}` === stage.value), state.value === 'empty' ? 'edit' : 'result'));
  else renderBoard(preview, makeModel(getCase(BASES.find(s => s.id === stage.value), +question.value), state.value));
}
function changeStage() {
  question.innerHTML = Array.from({ length: CHALLENGES[stage.value]?.length ?? 1 }, (_, i) => `<option value="${i}">${i + 1}</option>`).join('');
  redraw();
}
stage.addEventListener('change', changeStage); question.addEventListener('change', redraw); state.addEventListener('change', redraw); changeStage();

document.querySelector('#audit').addEventListener('click', async event => {
  event.currentTarget.disabled = true;
  await document.fonts.ready;
  const errors = []; let questions = 0, drawings = 0, labels = 0, textChecks = 0;
  // SVG getBBox は日本語フォントの行の余白も含む。実際の字形の上下はCanvasの字形寸法で調べる。
  const textCanvas = document.createElement('canvas').getContext('2d');
  const inkBox = text => {
    const style = getComputedStyle(text), x = +text.getAttribute('x'), y = +text.getAttribute('y');
    textCanvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    textCanvas.textAlign = text.getAttribute('text-anchor') === 'middle' ? 'center' : text.getAttribute('text-anchor') === 'end' ? 'right' : 'left';
    const m = textCanvas.measureText(text.textContent);
    return { x:x-m.actualBoundingBoxLeft, y:y-m.actualBoundingBoxAscent,
      width:m.actualBoundingBoxLeft+m.actualBoundingBoxRight, height:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent };
  };
  const check = (model, tag) => {
    renderBoard(auditBoard, model); drawings++;
    const parts = renderedLabels(auditBoard.innerHTML); labels += parts.length;
    for (const pair of labelConflicts(parts)) errors.push({ ...tag, kind: '札同士', pair });
    for (const issue of partConflicts(model.layout, model.stage, parts)) errors.push({ ...tag, ...issue });
    for (const p of parts) if (p.l < 0 || p.r > 360 || p.t < 0 || p.b > 470) errors.push({ ...tag, kind: '札が盤外', p });
    if (auditBoard.lastElementChild?.classList.contains('badge-foreground') !== true) errors.push({ ...tag, kind: '札が最前面にない' });
    for (const group of auditBoard.querySelectorAll('.board-badge,.pipe-label,.pump-caption')) {
      if (group.closest('.badge-foreground') !== auditBoard.lastElementChild) errors.push({ ...tag, kind: '個別の札が最前面にない', text: group.textContent });
      const r = group.querySelector('rect')?.getBBox();
      for (const text of group.querySelectorAll('text')) {
        const b = inkBox(text); textChecks++;
        if (r && (b.x < r.x + .5 || b.x + b.width > r.x + r.width - .5 || b.y < r.y - .3 || b.y + b.height > r.y + r.height + .3)) errors.push({ ...tag, kind: '文字が札外', text: text.textContent, textBox: { x:b.x,y:b.y,w:b.width,h:b.height }, rect:{x:r.x,y:r.y,w:r.width,h:r.height} });
      }
    }
  };
  for (const base of BASES) for (let q = 0; q < (CHALLENGES[base.id]?.length ?? 1); q++) {
    const item = getCase(base, q), layout = layoutFor(item.stage); questions++;
    for (const name of states) {
      const count = modelFor(item, name.startsWith('previous') ? 'empty' : name).ev.states.length;
      for (let vi = 0; vi < count; vi++) {
        const model = makeModel(item, name, vi); model.layout = layout;
        check(model, { stage:base.id, question:q+1, state:name, view:model.view.name });
      }
    }
    if (questions % 4 === 0) { report.textContent = `${questions}問・${drawings}描画を点検中`; await new Promise(requestAnimationFrame); }
  }
  for (const item of frees) for (const phase of ['edit', 'result']) {
    const count = freeModelFor(item, phase).view ? freeModelFor(item, phase).stage.candidates.some(c => c.gate) ? 2 : 1 : 1;
    for (let vi = 0; vi < count; vi++) check(freeModelFor(item, phase, vi), { stage:`FREE/${item.id}`, state:phase, view:vi });
  }
  report.textContent = JSON.stringify({ version:'0.26.1', questions, freeCases:frees.length, drawings, labels, textChecks, errors }, null, 2);
  document.querySelector('#audit').disabled = false;
});
