// 虹の描画と結果カードで同じ時間を使う。音・判定・保存形式は変えない。
export const RAINBOW_AFTER_MS = 800;
export const RAINBOW_FADE_MS = 700;
export const RAINBOW_HOLD_MS = 500;

export function resultCardDelay(outcome, timing) {
  if (outcome === 'ng') return timing.cardNgMs;
  if (outcome !== 'perfect') return timing.cardClearMs;
  // 100点は、虹が出そろった後に少し眺める。長めの保存設定も短縮しない。
  return Math.max(timing.cardClearMs,
    timing.jingleMs + RAINBOW_AFTER_MS + RAINBOW_FADE_MS + RAINBOW_HOLD_MS);
}
