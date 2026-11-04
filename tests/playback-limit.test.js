// 再生の上限時間（AC-03、要件5.4）：どの面・出題・つなぎ方でも、水面が上がる・水門を閉じる演出が上限に収まる
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { judge, allConfigs } from '../src/logic/play.js';
import { playbackPlan, PLAYBACK_LIMIT_MS, DEFAULT_RISE_MS, GATE_HOLD_MS } from '../src/ui/visual-timing.js';

const planFor = (st, config, riseMs) => {
  const ev = judge(st, config);
  const gated = ev.states.length > 1 && st.candidates.some(c => c.gate && ev.config.connected.has(c.id));
  return playbackPlan(st, ev.states[0].result, gated, riseMs);
};

test('全面・全出題・全つなぎ方で、既定の速さの演出が5秒以内に収まり、縮めずに済む', () => {
  assert.equal(PLAYBACK_LIMIT_MS, 5000);
  let longest = 0;
  for (const base of STAGES) {
    const variants = CHALLENGES[base.id]?.length ? CHALLENGES[base.id].map(v => applyValues(base, v.values)) : [base];
    for (const st of variants) for (const config of allConfigs(st)) {
      const plan = planFor(st, config, DEFAULT_RISE_MS);
      assert.ok(plan.settleAt <= PLAYBACK_LIMIT_MS, `${st.number}面 ${JSON.stringify(config)}：${plan.settleAt}ms`);
      assert.equal(plan.scale, 1, `${st.number}面は既定の速さのまま収まる`);
      longest = Math.max(longest, plan.settleAt);
    }
  }
  // 最長は50面（水門、グラス3つが一列）：3つ目のグラスの待ち420×2＋上がる1300＋閉じるまで1500＋動く1300＝4.94秒。
  // 49面より前では6面（水門）の4.52秒が最長だった
  assert.equal(longest, 420 * 2 + DEFAULT_RISE_MS + GATE_HOLD_MS + DEFAULT_RISE_MS);
});

test('上限を超える時間割りは、すべての時間を同じ割合で縮めて上限ちょうどに収める', () => {
  const gateStage = STAGES.find(s => s.number === 6);
  const config = allConfigs(gateStage).find(c => {
    const ev = judge(gateStage, c);
    return ev.states.length > 1 && gateStage.candidates.some(x => x.gate && ev.config.connected.has(x.id)) && Object.values(ev.states[0].result.towers).filter(t => t.state === 'water').length === 2;
  });
  const slow = planFor(gateStage, config, 3000); // 調整用の設定の上限
  assert.ok(slow.scale < 1);
  assert.ok(Math.abs(slow.settleAt - PLAYBACK_LIMIT_MS) < 1e-6);
  assert.ok(Math.abs(slow.closeMs - 3000 * slow.scale) < 1e-6);
  assert.ok(Math.abs((slow.closeAt - slow.settle1) - GATE_HOLD_MS * slow.scale) < 1e-6);
  for (const t of slow.towers) if (t.target !== null) assert.ok(t.delay + t.duration <= slow.settle1 + 1e-6);
});
