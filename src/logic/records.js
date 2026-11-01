// 課題の成績の自動保存（F-015、D-06）と、実行記録のファイル（F-024、D-05・D-11）。
// 保存は端末の中だけ（C-05）。低い点数やNGで最高点を消さない。読めない保存は上書きしない（C-01）。
import { frac } from './fraction.js';
import { normalizeConfig } from './play.js';

export const SCORES_KEY = 'aqua-notes.scores.v1';
const SCORES_FORMAT = 1;
export const RECORD_FORMAT = 1;

// 成績のキー：面ID＋出題番号＋内容版（前作と同じく、内容版が変わったら別の成績として残す）
export const scoreKey = (stage, drawNumber = 1) => `${stage.id}#${drawNumber}@${stage.version ?? 1}`;

export class ScoreBook {
  constructor(storage) {
    this.storage = storage;
    this.scores = {};
    this.readable = true; // 読めない保存があるときは、書き込まずに元の内容を残す
    this.warning = '';
    try {
      const text = storage?.getItem(SCORES_KEY);
      if (text) {
        const saved = JSON.parse(text);
        if (saved?.format !== SCORES_FORMAT || typeof saved.scores !== 'object') throw new Error('unknown format');
        this.scores = saved.scores;
      }
    } catch {
      this.readable = false;
      this.warning = '保存した成績を読み取れませんでした。元の保存内容は消さずに残しています。';
    }
  }

  best(key) {
    const s = this.scores[key];
    return s ? frac(s.best) : null;
  }

  // 戻り値：{ saved, improved, message }
  offer(key, score) {
    const prev = this.best(key);
    if (prev && score.cmp(prev) <= 0) return { saved: false, improved: false, message: '' };
    if (!this.readable) return { saved: false, improved: true, message: this.warning };
    const next = { ...this.scores, [key]: { best: score.toString(), cleared: true } };
    try {
      this.storage.setItem(SCORES_KEY, JSON.stringify({ format: SCORES_FORMAT, scores: next }));
      this.scores = next;
      return { saved: true, improved: true, message: '' };
    } catch {
      this.scores = next; // 開いている間は表示に使う
      return { saved: false, improved: true, message: '成績をこの端末に保存できませんでした。ブラウザの保存設定や空き容量を確かめてください。' };
    }
  }
}

// 実行記録：回路の状態・面・計算結果・判定を1つのJSONにまとめる。端末には残さない
export function buildRecord({ stage, config, ev, appVersion, now = new Date() }) {
  const cfg = normalizeConfig(config);
  const r = ev.result;
  return {
    format: RECORD_FORMAT,
    app: { name: 'AQUA NOTES', version: appVersion },
    createdAt: now.toISOString(), // 世界標準時の ISO 8601（AGENTS.md「日時」）
    stage: { id: stage.id, version: stage.version ?? 1, draw: stage.draw?.number ?? 1, drawId: stage.draw?.id ?? null, family: stage.draw?.family ?? null, title: stage.title },
    circuit: {
      springHeight: stage.spring.height,
      connected: [...cfg.connected].sort(),
      thickness: cfg.thickness,
      primed: [...cfg.primed].filter(id => cfg.connected.has(id)).sort()
    },
    // 水門の面は、開いた状態と閉じた状態のそれぞれの届いた量と、切れたサイフォン
    states: (ev.states ?? []).map(s => ({
      name: s.name,
      outlets: Object.fromEntries(s.outlets.map(o => [o.id, { flow: o.flow.toString(), target: o.target.toString(), verdict: o.verdict }])),
      brokenSiphons: [...s.broken]
    })),
    towers: Object.fromEntries(Object.entries(r.towers).map(([id, t]) => [id, {
      state: t.state, level: t.level?.toString() ?? null, inflow: t.inflow.toString(), outflow: t.outflow.toString()
    }])),
    pipes: Object.fromEntries(Object.entries(r.pipes).map(([id, p]) => [id, {
      flow: p.flow.toString(), diff: p.diff.toString(), thinness: p.thinness.toString(), wet: p.wet
    }])),
    outlets: Object.fromEntries(ev.outlets.map(o => [o.id, { flow: o.flow.toString(), target: o.target.toString(), verdict: o.verdict }])),
    iterations: r.iterations,
    judge: { outcome: ev.outcome, score: ev.score.toString(), used: ev.used }
  };
}
