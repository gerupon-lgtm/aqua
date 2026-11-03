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
