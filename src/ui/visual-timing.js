// 虹の描画と結果カードで同じ時間を使う。音・判定・保存形式は変えない。
export const RAINBOW_AFTER_MS = 800;
export const RAINBOW_FADE_MS = 700;
export const RAINBOW_HOLD_MS = 500;
// 開始の合図は2回光る（2026-11-03 発案者）。1回700ms（明るくなる120ms・保つ300ms・消える280ms）、間に350ms暗い（v0.15.2で200msから広げた）
export const STAGE_CUE_FLASH_MS = 700;
export const STAGE_CUE_GAP_MS = 350;
export const STAGE_CUE_MS = STAGE_CUE_FLASH_MS * 2 + STAGE_CUE_GAP_MS;
// 画面を移ったあと、視線が条件へ向く時間を置く。
export const STAGE_CUE_WAIT_MS = 700;

export function stageCueOpacity(until, now, still = false) {
  const left = until - now;
  if (left <= 0 || left > STAGE_CUE_MS) return 0;
  if (still) return 1;
  // 1回ごとに明るくなり、読める時間を保ってから消える。薄い縁だけの合図にしない。
  const elapsed = (STAGE_CUE_MS - left) % (STAGE_CUE_FLASH_MS + STAGE_CUE_GAP_MS);
  if (elapsed >= STAGE_CUE_FLASH_MS) return 0;
  return elapsed < 120 ? elapsed / 120 : elapsed < 420 ? 1 : (STAGE_CUE_FLASH_MS - elapsed) / 280;
}

export function guideGlowOpacity(time, still = false) {
  return still ? 1 : .45 + .55 * (Math.sin(time / 1200 * Math.PI * 2) + 1) / 2;
}

export function resultCardDelay(outcome, timing) {
  if (outcome === 'ng') return timing.cardNgMs;
  if (outcome !== 'perfect') return timing.cardClearMs;
  // 100点は、虹が出そろった後に少し眺める。長めの保存設定も短縮しない。
  return Math.max(timing.cardClearMs,
    timing.jingleMs + RAINBOW_AFTER_MS + RAINBOW_FADE_MS + RAINBOW_HOLD_MS);
}

// 再生（水面が上がる・水門を閉じる演出）の時間割り（要件5.4、logic-design 6.2）。
// グラスは給水塔から配管を1本多くたどるごとに HOP_DELAY_MS 遅れて上がり始め、riseMs かけて水位まで上がる。
// 水門の面は、落ち着いてから GATE_HOLD_MS 待って閉じ、riseMs かけて水位が動く。
// 全体が PLAYBACK_LIMIT_MS を超えるときは、すべての時間を同じ割合で縮めて収める。和音とジングルは対象外。
// 上限は全面共通の5秒（2026-11-04 発案者。既定の速さで1〜30面の最長は6面の4.52秒）
export const PLAYBACK_LIMIT_MS = 5000;
export const HOP_DELAY_MS = 420;
export const DEFAULT_RISE_MS = 1300; // 水面が上がる時間の既定（調整用の設定で変えられる）
export const GATE_HOLD_MS = 1500; // 開いた状態で落ち着いてから、水門を閉じるまで（試作の仮の値）
const MIN_SETTLE_MS = 500; // 水の入るグラスがないときも、少し待ってから落ち着く

// 給水塔から、水の通っている配管を何本たどって届くか
export function hopDistances(st, result) {
  const dist = new Map([[st.spring.id, 0]]);
  const queue = [st.spring.id];
  while (queue.length) {
    const here = queue.shift();
    for (const [id, p] of Object.entries(result.pipes)) {
      if (!p.wet) continue;
      const c = st.candidates.find(x => x.id === id);
      const next = c.a === here ? c.b : c.b === here ? c.a : null;
      if (next && !dist.has(next)) { dist.set(next, dist.get(here) + 1); queue.push(next); }
    }
  }
  return dist;
}

// st：面、result：最初の状態の計算結果、gated：水門を閉じる演出があるか。
// 戻り値の時刻はすべて「水を流す」からのミリ秒。scale は縮めた割合（1なら既定の速さ）
export function playbackPlan(st, result, gated, riseMs, limitMs = PLAYBACK_LIMIT_MS) {
  const hops = hopDistances(st, result);
  const raw = st.towers.map(t => {
    const r = result.towers[t.id];
    const water = r.state === 'water';
    return { id: t.id, delay: water ? ((hops.get(t.id) ?? 1) - 1) * HOP_DELAY_MS : 0, duration: riseMs, target: water ? r.level.toNumber() : null };
  });
  const rawSettle = Math.max(MIN_SETTLE_MS, ...raw.filter(t => t.target !== null).map(t => t.delay + t.duration));
  const rawTotal = gated ? rawSettle + GATE_HOLD_MS + riseMs : rawSettle;
  const scale = rawTotal > limitMs ? limitMs / rawTotal : 1;
  const towers = raw.map(t => ({ ...t, delay: t.delay * scale, duration: t.duration * scale }));
  const settle1 = rawSettle * scale;
  const closeMs = riseMs * scale;
  const closeAt = gated ? settle1 + GATE_HOLD_MS * scale : Infinity;
  const settleAt = gated ? closeAt + closeMs : settle1;
  return { towers, settle1, closeAt, closeMs, settleAt, scale };
}
