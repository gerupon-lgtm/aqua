import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { PRACTICE } from '../src/content/tutorial.js';
import { layoutFor, pipePath, pipeAt, pipeLabelPositions, outletLabelPositions, basinPlacement, VIEW_W } from '../src/ui/board.js';

// 盤面の配置の点検：盤内に収まる。器とグラスの軽い重なりは発案者が許可。
// サイフォンの脚が同じ位置に重ならない。地面の下の同じ段の管は、横に重ならない（つなぎ目の短い重なりは除く）
const GLASS_HALF = 17;
const SPRING_HALF = 23;
const BASIN_OFFSET = 26; // 接続元の前面へ重ね、グラス左12pxを底まで見せる
const BASIN_HALF = 31;
const WALL_HALF = 8;

test('全198出題の2段の丸札が盤内に収まり、互いに重ならない', () => {
  for (const base of [PRACTICE, ...STAGES]) for (const stage of CHALLENGES[base.id]?.map(q => applyValues(base, q.values)) ?? [base]) {
    const layout = layoutFor(stage);
    const labels = [...pipeLabelPositions(layout, stage).values(), ...outletLabelPositions(layout, stage).values()];
    for (const p of labels) assert.ok(p.x >= 14 && p.x <= VIEW_W - 14 && p.y >= 14 && p.y <= 470 - 14, `${stage.number}: 札が盤外`);
    for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
      assert.ok(Math.hypot(labels[i].x - labels[j].x, labels[i].y - labels[j].y) >= 29.3, `${stage.number}: 2段の札同士が重なる`);
    }
  }
});

test('全198出題で、出口管の太さバッジが高い器の必要量・高さの札を隠さない', () => {
  for (const base of STAGES) {
    const variants = CHALLENGES[base.id]?.map(q => applyValues(base, q.values)) ?? [base];
    for (const stage of variants) {
      const layout = layoutFor(stage), labels = outletLabelPositions(layout, stage);
      for (const p of labels.values()) for (const o of stage.outlets) {
        const cx = basinPlacement(layout, o).cx;
        const dy = layout.yOf(Number(o.height)) - 370;
        if (Math.abs(p.y - (318 + dy)) < 17) assert.ok(Math.abs(p.x - cx) >= 40, `${stage.number}面の必要量の札と重なる`);
        if (Number(o.height) > 0 && Math.abs(p.y - (298 + dy)) < 16) assert.ok(Math.abs(p.x - cx) >= 29, `${stage.number}面の高さの札と重なる`);
      }
    }
  }
});

for (const stage of STAGES) {
  test(`${stage.number}面の配置が重ならない`, () => {
    const layout = layoutFor(stage);
    const boxes = [];
    for (const node of layout.nodes.values()) {
      const half = node.kind === 'spring' ? SPRING_HALF : GLASS_HALF;
      boxes.push({ name: node.id, kind: node.kind, l: node.cx - half, r: node.cx + half });
    }
    for (const o of stage.outlets) {
      const node = layout.nodes.get(o.tower);
      const vessel = basinPlacement(layout, o);
      assert.equal(vessel.width, 62, '器は全ての面で同じ幅');
      assert.ok(vessel.left - (node.cx - GLASS_HALF) >= 12 - 1e-8, '低い水位を見る左12pxが隠れる');
      const cx = node.cx + BASIN_OFFSET;
      boxes.push({ name: `噴水盤${o.id}`, kind: 'basin', l: cx - BASIN_HALF, r: cx + BASIN_HALF });
    }
    for (const [i, w] of (stage.walls ?? []).entries()) {
      const x = 18 + w.x * 32.4;
      boxes.push({ name: `壁${i + 1}`, l: x - WALL_HALF, r: x + WALL_HALF });
    }
    for (const b of boxes) assert.ok(b.l >= 0 && b.r <= VIEW_W, `${b.name} が盤面からはみ出す`);
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        if ((a.kind === 'basin' && b.kind === 'tower') || (b.kind === 'basin' && a.kind === 'tower')) continue;
        assert.ok(a.r <= b.l || b.r <= a.l, `${a.name} と ${b.name} が重なる`);
      }
    }
    // サイフォンの脚：左の脚は左端の部品の中心+7、右の脚は右端の部品の中心−7
    const legs = new Set();
    for (const c of stage.candidates.filter(x => x.siphon)) {
      const [left, right] = [layout.nodes.get(c.a), layout.nodes.get(c.b)].sort((p, q) => p.cx - q.cx);
      for (const leg of [`${left.id}+`, `${right.id}-`]) {
        assert.ok(!legs.has(leg), `${c.id} のサイフォンの脚がほかのサイフォンと重なる`);
        legs.add(leg);
      }
    }
    // 地面の下の同じ段：横の範囲が、つなぎ目の短い重なり（20未満）を超えて重ならない
    const under = stage.candidates.filter(x => !x.siphon).map(c => {
      const xs = [layout.nodes.get(c.a).cx, layout.nodes.get(c.b).cx].sort((p, q) => p - q);
      return { id: c.id, depth: c.depth, l: xs[0], r: xs[1] };
    });
    for (let i = 0; i < under.length; i++) {
      for (let j = i + 1; j < under.length; j++) {
        const a = under[i], b = under[j];
        if (a.depth !== b.depth) continue;
        const overlap = Math.min(a.r, b.r) - Math.max(a.l, b.l);
        assert.ok(overlap < 20, `${a.id} と ${b.id} が同じ段で重なる`);
      }
    }
  });
  test(`${stage.number}面の管が縦に隠れず、札が別の管を指さない`, () => {
    const layout = layoutFor(stage);
    const routes = stage.candidates.map(c => ({ c, p: pipePath(layout, c) }));
    const legs = routes.filter(r => !r.c.siphon).flatMap(({ c, p }) => [
      { id: c.id, x: p.pts[0][0] }, { id: c.id, x: p.pts[3][0] }
    ]);
    for (let i = 0; i < legs.length; i++) for (let j = i + 1; j < legs.length; j++) {
      if (legs[i].id !== legs[j].id) assert.ok(Math.abs(legs[i].x - legs[j].x) >= 14 - 1e-8, `${legs[i].id} と ${legs[j].id} の縦部分が重なる`);
    }
    const labels = pipeLabelPositions(layout, stage);
    for (const { c } of routes) {
      const { x, y } = labels.get(c.id);
      assert.equal(pipeAt(layout, stage, x, y), c.id, `${c.id} の札の中心が別の管を選ぶ`);
      assert.ok(x >= 9 && x <= VIEW_W - 9, `${c.id} の札が盤外に出る`);
      for (const { c: other, p } of routes) {
        if (other.id === c.id) continue;
        for (const [a, b] of [[p.pts[0], p.pts[1]], [p.pts[2], p.pts[3]]]) {
          if (y < Math.min(a[1], b[1]) - 7 || y > Math.max(a[1], b[1]) + 7) continue;
          assert.ok(Math.abs(x - a[0]) >= 15, `${c.id} の札が ${other.id} の縦部分を隠す`);
        }
      }
    }
  });
}
