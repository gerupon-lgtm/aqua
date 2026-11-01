import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { layoutFor, VIEW_W } from '../src/ui/board.js';

// 盤面の配置の点検：グラス・泉・噴水盤・壁が重ならず、盤面の幅に収まる。
// サイフォンの脚が同じ位置に重ならない。地面の下の同じ段の管は、横に重ならない（つなぎ目の短い重なりは除く）
const GLASS_HALF = 17;
const SPRING_HALF = 23;
const BASIN_OFFSET = 45; // グラスの中心から噴水盤の中心まで
const BASIN_HALF = 24;
const WALL_HALF = 8;

for (const stage of STAGES) {
  test(`${stage.number}面の配置が重ならない`, () => {
    const layout = layoutFor(stage);
    const boxes = [];
    for (const node of layout.nodes.values()) {
      const half = node.kind === 'spring' ? SPRING_HALF : GLASS_HALF;
      boxes.push({ name: node.id, l: node.cx - half, r: node.cx + half });
    }
    for (const o of stage.outlets) {
      const cx = layout.nodes.get(o.tower).cx + BASIN_OFFSET;
      boxes.push({ name: `噴水盤${o.id}`, l: cx - BASIN_HALF, r: cx + BASIN_HALF });
    }
    for (const [i, w] of (stage.walls ?? []).entries()) {
      const x = 18 + w.x * 32.4;
      boxes.push({ name: `壁${i + 1}`, l: x - WALL_HALF, r: x + WALL_HALF });
    }
    for (const b of boxes) assert.ok(b.l >= 0 && b.r <= VIEW_W, `${b.name} が盤面からはみ出す`);
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
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
}
