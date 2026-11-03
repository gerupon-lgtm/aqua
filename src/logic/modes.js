// 遊び方（モード）の決まり（要件 F-025・F-026、Q-16。2026-11-01 確定）。
// - 選択プレイ：面ごとに、1回のプレイでクリアまでに「水を流す」を押した回数を数え、最少の回数を記録する（F-025）
// - 連続プレイ：お試し1面から30面まで順に進む。レベルごとに、クリアできなかった回（NG）の上限がある。
//   上限を超えるとゲームオーバー。部分点のクリアでも次へ進める。上限の中でクリアした面数をレベルごとに記録する（F-026）
// 記録は端末の保存領域に置き、消さない（C-01）。保存できない端末でも遊べるよう、失敗は無視する

export const MODES_KEY = 'aqua-modes-v1';

// レベル。ノーマル10回・エキスパート5回は 2026-11-03 発案者が決定（Q-16 の残り）
export const LEVELS = Object.freeze([
  Object.freeze({ id: 'free', name: 'フリー', limit: null, note: '上限なし' }),
  Object.freeze({ id: 'beginner', name: 'ビギナー', limit: 20, note: 'NG 20回まで' }),
  Object.freeze({ id: 'normal', name: 'ノーマル', limit: 10, note: 'NG 10回まで' }),
  Object.freeze({ id: 'expert', name: 'エキスパート', limit: 5, note: 'NG 5回まで' })
]);
export const levelOf = id => LEVELS.find(l => l.id === id) ?? null;

// 連続プレイの1回分。stageCount は進む面の数（1〜30面なら30）
export class ContinuousRun {
  constructor(levelId, stageCount) {
    const level = levelOf(levelId);
    if (!level) throw new Error(`レベル ${levelId} がありません。`);
    this.level = level;
    this.stageCount = stageCount;
    this.position = 0; // 今の面（0始まり）
    this.cleared = 0; // クリアした面数
    this.ng = 0; // 数えたNGの回数
    this.over = false;
    this.complete = false;
  }
  // 上限を超えた回（ゲームオーバー）も、残りは0と見せる
  get left() { return this.level.limit === null ? null : Math.max(0, this.level.limit - this.ng); }
  // 結果を受け取り、次にすることを返す：next（次の面へ）、retry（同じ面をやり直す）、gameover、complete（全面クリア）
  record(outcome) {
    if (this.over || this.complete) throw new Error('この連続プレイは終わっています。');
    if (outcome === 'ng') {
      this.ng++;
      if (this.level.limit !== null && this.ng > this.level.limit) { this.over = true; return 'gameover'; }
      return 'retry';
    }
    this.cleared++;
    if (this.position + 1 >= this.stageCount) { this.complete = true; return 'complete'; }
    return 'next';
  }
  advance() { this.position++; }
}

// 記録：選択プレイの最少試行回数（面ID → 回数）と、連続プレイのレベルごとの最高（クリアした面数）。
// 全面クリアした回は、NGの少なさでも比べる（allClearNg：レベル → 全面クリアしたときの最少NG）。
// 連続プレイの記録は面をクリアするたびに保存し、途中でアプリを閉じても残す（2026-11-03 発案者）
export class ModeBook {
  constructor(storage) {
    this.storage = storage;
    this.data = { fewest: {}, continuous: {}, allClearNg: {} };
    try {
      const saved = JSON.parse(storage?.getItem(MODES_KEY) || 'null');
      if (saved && typeof saved === 'object') this.data = { fewest: { ...(saved.fewest ?? {}) }, continuous: { ...(saved.continuous ?? {}) }, allClearNg: { ...(saved.allClearNg ?? {}) } };
    } catch { /* 読めないときは記録なしの扱い */ }
  }
  #save() { try { this.storage?.setItem(MODES_KEY, JSON.stringify(this.data)); return true; } catch { return false; } }
  fewest(stageId) { return this.data.fewest[stageId] ?? null; }
  // 少ない回数のときだけ置き換える。戻り値：記録を更新したか
  offerTrials(stageId, trials) {
    if (!Number.isInteger(trials) || trials < 1) return false;
    const old = this.fewest(stageId);
    if (old !== null && old <= trials) return false;
    this.data.fewest[stageId] = trials;
    this.#save();
    return true;
  }
  bestContinuous(levelId) { return this.data.continuous[levelId] ?? null; }
  allClearNg(levelId) { return this.data.allClearNg[levelId] ?? null; }
  // 多い面数のときだけ置き換える。戻り値：記録を更新したか
  offerContinuous(levelId, cleared) {
    if (!Number.isInteger(cleared) || cleared < 1) return false;
    const old = this.bestContinuous(levelId);
    if (old !== null && old >= cleared) return false;
    this.data.continuous[levelId] = cleared;
    this.#save();
    return true;
  }
  // 全面クリアしたときのNG。少ないときだけ置き換える
  offerAllClear(levelId, ng) {
    if (!Number.isInteger(ng) || ng < 0) return false;
    const old = this.allClearNg(levelId);
    if (old !== null && old <= ng) return false;
    this.data.allClearNg[levelId] = ng;
    this.#save();
    return true;
  }
}

// 連続プレイの記録の更新を、遊び始めの記録と比べて判定する（終わったときにまとめて見せるため）。
// start：{ best, allClearNg }（始めたときの記録）。戻り値：更新していなければ null
export function continuousRecordChange(start, run) {
  if (run.complete && (start.best === null || start.best < run.stageCount || start.allClearNg === null || run.ng < start.allClearNg)) {
    return { from: start.best, to: run.cleared, fromNg: start.allClearNg, toNg: run.ng };
  }
  if (run.cleared > 0 && (start.best === null || run.cleared > start.best)) return { from: start.best, to: run.cleared, fromNg: null, toNg: null };
  return null;
}
