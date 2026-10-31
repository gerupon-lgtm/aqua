// 試作の画面のまとめ役：編集中 → 実行中 → 結果表示中 → 停止で編集中（要件5.3）
import { STAGES } from '../content/stages.js';
import { analyzeStage, evaluate, thinnessOf } from '../logic/play.js';
import { onScale, tickSide, tickDistance, frequencyForLevel, DEFAULT_SCALE } from '../logic/pitch.js';
import { displayScore } from '../logic/score.js';
import { explain, formatAmount } from '../logic/explain.js';
import { ScoreBook, scoreKey, buildRecord } from '../logic/records.js';
import { GlassAudio, DEFAULT_LATENCY_MS, TIMBRES } from './audio.js';
import { renderBoard, layoutFor, towerAt, pipeAt, VIEW_W, VIEW_H } from './board.js';

const APP_VERSION = '0.6.3';
// v2：ジングルの待ちをクリアとNGに分けた（2026-11-01）。初期値を新しい値にそろえるため、v1 の調整は引き継がない
const TIMING_KEY = 'aqua-notes.prototype-timing.v2';
// 結果の間合い（試作の仮の値）。秒数はグラスハープの余韻に合わせて試作で決める（要件NF-002・Q-04）。
// 出発点は前作 prism の関係：落ち着いた（最後の鐘が鳴った）時点から、クリアのジングル0.7秒、NGのジングル1.5秒、
// 結果カードはどちらも1.6秒（prism の audio.js SUCCESS_JINGLE_DELAY_SECONDS・FAILURE_BELL_DELAY_SECONDS、result-timing.js）
const DEFAULT_TIMING = Object.freeze({ riseMs: 1300, chordMs: 2600, jingleMs: 700, jingleNgMs: 1500, cardClearMs: 1600, cardNgMs: 1600, semitones: 5, latencyMs: DEFAULT_LATENCY_MS, timbre: 'fm2' });
const TIMING_FIELDS = [
  ['latencyMs', '音の準備の余裕（音が途切れるときは大きく）', 0, 300, 10],
  ['riseMs', '水面が上がる時間', 400, 3000, 100],
  ['chordMs', '落ち着いた音の長さ（余韻を含む）', 800, 6000, 100],
  ['jingleMs', '落ち着いてからジングルまで（クリア）', 0, 4000, 100],
  ['jingleNgMs', '落ち着いてからジングルまで（NG）', 0, 4000, 100],
  ['cardClearMs', '落ち着いてから結果まで（クリア）', 0, 5000, 100],
  ['cardNgMs', '落ち着いてから結果まで（NG）', 0, 5000, 100],
  ['semitones', '1目盛りあたりの半音の数', 1, 7, 1]
];
const GATE_HOLD_MS = 1500; // 水門の面：開いた状態で落ち着いてから、水門を閉じるまで（試作の仮の値）

const $ = id => document.getElementById(id);
const audio = new GlassAudio();
const scoreBook = new ScoreBook((() => { try { return window.localStorage; } catch { return null; } })());
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

function loadTiming() {
  try {
    const saved = JSON.parse(localStorage.getItem(TIMING_KEY) || 'null');
    if (!saved) return { ...DEFAULT_TIMING };
    const next = { ...DEFAULT_TIMING };
    for (const [key, , min, max] of TIMING_FIELDS) {
      if (Number.isFinite(saved[key]) && saved[key] >= min && saved[key] <= max) next[key] = saved[key];
    }
    if (TIMBRES.some(([id]) => id === saved.timbre)) next.timbre = saved.timbre;
    return next;
  } catch {
    return { ...DEFAULT_TIMING };
  }
}
function saveTiming(values) {
  try { localStorage.setItem(TIMING_KEY, JSON.stringify(values)); return true; } catch { return false; }
}

const emptyConfig = () => ({ connected: new Set(), thickness: {}, primed: new Set() });
const state = {
  stageIndex: 0,
  config: emptyConfig(),
  selected: null,
  phase: 'edit',
  analysis: null,
  layout: null,
  evaluation: null,
  run: null,
  prevLevels: new Map(),
  saveMessage: '',
  newBest: false,
  timing: loadTiming(),
  details: false,
  explain: false,
  highlight: null
};
audio.setLatency(state.timing.latencyMs);
audio.timbre = state.timing.timbre;

function fieldText(key, value) {
  if (key === 'semitones') return String(value);
  if (key === 'latencyMs') return `${value} ミリ秒`;
  return `${(value / 1000).toFixed(1)} 秒`;
}

const scaleNow = () => ({ ...DEFAULT_SCALE, semitonesPerStep: state.run?.timing.semitones ?? state.timing.semitones });
const stage = () => STAGES[state.stageIndex];
const candidate = id => stage().candidates.find(c => c.id === id);
const bucketsLeft = () => (stage().buckets ?? 0) - [...state.config.primed].filter(id => state.config.connected.has(id)).length;
const targetText = t => (typeof t === 'object' ? `開 ${t.open}・閉 ${t.closed}` : t);

function selectStage(index) {
  stopRun();
  state.stageIndex = index;
  state.config = emptyConfig();
  state.selected = null;
  state.prevLevels = new Map();
  state.analysis = analyzeStage(stage());
  state.layout = layoutFor(stage());
  state.evaluation = null;
  state.details = false;
  state.explain = false;
  renderAll();
}

// ---- 編集：水路をつなぐ・外す・太さ・呼び水（F-002、F-005、F-008） ----
function tapPipe(id) {
  const c = candidate(id);
  const cfg = state.config;
  audio.unlock();
  audio.cue(cfg.connected.has(id) ? 'tap' : 'wire'); // つなぐときは前作の結線と同じ2音、それ以外は操作音
  if (!cfg.connected.has(id)) {
    cfg.connected.add(id);
    if (c.adjustable) cfg.thickness[id] = c.thinness;
    state.selected = c.adjustable || c.siphon ? id : null;
  } else if (c.adjustable || c.siphon) {
    state.selected = state.selected === id ? null : id;
  } else {
    cfg.connected.delete(id);
    state.selected = null;
  }
  renderAll();
}

function removePipe(id) {
  const cfg = state.config;
  cfg.connected.delete(id);
  cfg.primed.delete(id); // 管を外すと桶は手元に戻る（要件5.2）
  delete cfg.thickness[id];
  state.selected = null;
}

// ---- 実行と再生 ----
function hopDistances(st, result) {
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

const levelsOf = result => new Map(Object.entries(result.towers).map(([id, t]) => [id, t.level ? t.level.toNumber() : null]));

function startRun() {
  audio.unlock();
  const st = stage();
  const timing = { ...state.timing };
  const scale = { ...DEFAULT_SCALE, semitonesPerStep: timing.semitones };
  const evaluation = evaluate(st, state.config, state.analysis, scale);
  state.evaluation = evaluation;
  state.selected = null;
  const first = evaluation.states[0].result;
  const last = evaluation.states[evaluation.states.length - 1].result;
  const gated = evaluation.states.length > 1 && st.candidates.some(c => c.gate && state.config.connected.has(c.id));
  const hops = hopDistances(st, first);
  const towers = st.towers.map(t => {
    const r = first.towers[t.id];
    const delay = r.state === 'water' ? ((hops.get(t.id) ?? 1) - 1) * 420 : 0;
    return { id: t.id, delay, duration: timing.riseMs, target: r.state === 'water' ? r.level.toNumber() : null };
  });
  const settle1 = Math.max(500, ...towers.filter(t => t.target !== null).map(t => t.delay + t.duration));
  const closeAt = gated ? settle1 + GATE_HOLD_MS : Infinity;
  const settleAt = gated ? closeAt + timing.riseMs : settle1;
  state.run = { start: performance.now(), towers, settle1, closeAt, settleAt, gated, open: levelsOf(first), closed: levelsOf(last), timing, timers: [] };
  state.phase = 'running';

  const top = frequencyForLevel(0, scale);
  const t0 = audio.now;
  for (const t of towers) {
    if (t.target === null) continue;
    audio.glide(top, frequencyForLevel(first.towers[t.id].level, scale), { at: t0 + t.delay / 1000, duration: t.duration / 1000 });
  }
  // 落ち着いた音。同じ高さのグラスは1つの音として鳴らす（重ねると音量だけが増えるため）
  const settleSound = result => {
    const levels = [...new Set(st.towers.map(t => result.towers[t.id]).filter(r => r.state === 'water').map(r => r.level.toString()))];
    const freqs = levels.map(l => frequencyForLevel(l, scale));
    if (freqs.length) audio.chord(freqs, { length: timing.chordMs / 1000 });
  };
  const later = (ms, fn) => state.run.timers.push(setTimeout(fn, ms));
  later(settle1, () => settleSound(first));
  if (gated) {
    // 水門を閉じると、水位が動いて音も動く（要件5.3 手順5）
    later(closeAt, () => {
      for (const t of st.towers) {
        const a = first.towers[t.id];
        const b = last.towers[t.id];
        if (a.state === 'water' && b.state === 'water' && !a.level.eq(b.level)) {
          audio.glide(frequencyForLevel(a.level, scale), frequencyForLevel(b.level, scale), { duration: timing.riseMs / 1000 });
        }
      }
    });
    later(settleAt, () => settleSound(last));
  }
  later(settleAt + (evaluation.outcome === 'ng' ? timing.jingleNgMs : timing.jingleMs), () => audio.jingle(evaluation.outcome));
  later(settleAt + (evaluation.outcome === 'ng' ? timing.cardNgMs : timing.cardClearMs), showResult);
  renderAll();
  loop();
}

function showResult() {
  if (!state.run) return;
  state.phase = 'result';
  const ev = state.evaluation;
  state.saveMessage = '';
  state.newBest = false;
  if (ev.outcome !== 'ng') {
    const r = scoreBook.offer(scoreKey(stage()), ev.score);
    state.saveMessage = r.message;
    state.newBest = r.improved;
  }
  renderAll();
}

function stopRun() {
  if (state.run && state.evaluation) {
    for (const id of state.run.timers) clearTimeout(id);
    const last = state.evaluation.states[state.evaluation.states.length - 1];
    state.prevLevels = levelsOf(last.result);
    // 切れたサイフォンの桶は手元に戻る（要件5.2）
    for (const s of state.evaluation.states) for (const id of s.broken) state.config.primed.delete(id);
  }
  audio.stopAll();
  state.run = null;
  state.phase = 'edit';
  state.details = false;
  state.explain = false;
}

// 今見せている状態：水門の面では、閉じ始めたら閉じた状態の計算結果を見せる
function viewAt(now) {
  const run = state.run;
  const elapsed = now - run.start;
  const closing = run.gated && elapsed >= run.closeAt;
  const index = closing ? state.evaluation.states.length - 1 : 0;
  const settled = elapsed >= run.settle1 && (!run.gated || elapsed < run.closeAt || elapsed >= run.settleAt);
  return { elapsed, index, settled, gateClosed: closing };
}

function currentLevels(now) {
  const levels = new Map();
  for (const t of stage().towers) levels.set(t.id, null);
  const run = state.run;
  if (!run) return levels;
  const { elapsed } = viewAt(now);
  const ease = p => 1 - (1 - Math.max(0, Math.min(1, p))) ** 3;
  for (const t of run.towers) {
    if (elapsed < run.settle1) {
      if (t.target !== null) levels.set(t.id, t.target * ease((elapsed - t.delay) / t.duration));
    } else if (!run.gated || elapsed < run.closeAt) {
      levels.set(t.id, run.open.get(t.id));
    } else {
      const a = run.open.get(t.id) ?? 0;
      const b = run.closed.get(t.id);
      const p = ease((elapsed - run.closeAt) / run.timing.riseMs);
      const v = a + ((b ?? 0) - a) * p;
      levels.set(t.id, b === null && p >= 1 ? null : v);
    }
  }
  return levels;
}

// ---- 描画 ----
// 描き直しは1秒に約30回までにして、音の処理に余裕を残す
let frame = 0;
let lastDraw = 0;
function loop() {
  cancelAnimationFrame(frame);
  const tick = now => {
    if (now - lastDraw >= 32) { lastDraw = now; drawBoard(); }
    if (state.phase !== 'edit') frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

function drawBoard() {
  const now = performance.now();
  const scale = scaleNow();
  const v = state.run ? viewAt(now) : { index: 0, settled: false, gateClosed: false };
  const view = state.phase === 'edit' || !state.evaluation ? null : state.evaluation.states[v.index];
  renderBoard($('board'), {
    stage: stage(),
    layout: state.layout,
    connected: state.config.connected,
    primed: state.config.primed,
    thinness: c => thinnessOf(c, state.config),
    selected: state.selected,
    phase: state.phase,
    levels: currentLevels(now),
    settled: v.settled,
    view,
    gateClosed: v.gateClosed,
    prevLevels: state.prevLevels,
    time: now,
    reducedMotion: reducedMotionQuery.matches,
    highlight: state.highlight,
    onScale: level => onScale(level, scale),
    tickDistance: level => tickDistance(level, scale)
  });
}

function renderTabs() {
  $('stage-tabs').innerHTML = STAGES.map((s, i) => {
    const best = scoreBook.best(scoreKey(s));
    const mark = best ? (displayScore(best) === '100.00' ? '★' : '●') : '';
    return `<button type="button" class="tab${i === state.stageIndex ? ' current' : ''}" data-stage="${i}" aria-label="${s.set}${s.number}${best ? ` 最高${displayScore(best)}点` : ''}" ${state.phase === 'running' ? 'disabled' : ''}>${s.number}<span class="mark">${mark}</span></button>`;
  }).join('');
}

function renderCondition() {
  const st = stage();
  const targets = st.outlets.map(o => `<span class="target"><span class="dot"></span>${o.label}に <b>${targetText(o.target)}</b></span>`).join('');
  const buckets = st.buckets ? `<span class="count">桶 残り <b>${bucketsLeft()}</b> / ${st.buckets}</span>` : '';
  $('cond').innerHTML = `
    <div class="cond-title"><span class="eyebrow">${st.set} ${st.number}</span><span class="name">${st.title}</span></div>
    <div class="cond-row">${targets}${buckets}<span class="count">つないだ水路 <b>${state.config.connected.size}</b> 本</span></div>`;
}

const fmt = formatAmount;
const verdictText = { exact: 'ちょうど', short: '足りない', over: '多い' };
const sideText = { on: '目盛りに乗っている', above: '目盛りより少し上', below: '目盛りより少し下' };
const stateTitle = { open: '水門が開いているとき', closed: '水門を閉じたとき' };
const THICK_NAME = { 3: '細', 2: '中', 1: '太' };

// 太さ・呼び水を選ぶ（S-04 部品の設定にあたる）
function chooserHtml() {
  const c = candidate(state.selected);
  if (!c) return '';
  const cfg = state.config;
  const parts = [];
  if (c.adjustable) {
    parts.push(`<div class="chooser-row"><span>太さ</span>${c.adjustable.map(t => `<button type="button" class="chip${cfg.thickness[c.id] === t ? ' on' : ''}" data-thick="${t}" aria-pressed="${cfg.thickness[c.id] === t}">${THICK_NAME[t]}</button>`).join('')}</div>`);
  }
  if (c.siphon) {
    const primed = cfg.primed.has(c.id);
    parts.push(`<div class="chooser-row"><span>サイフォン</span>${primed
      ? '<button type="button" class="chip on" data-prime="off">呼び水を取り消す</button>'
      : `<button type="button" class="chip" data-prime="on" ${bucketsLeft() > 0 ? '' : 'disabled'}>桶で呼び水をする</button>${bucketsLeft() > 0 ? '' : '<span class="note-inline">桶が残っていません</span>'}`}</div>`);
  }
  return `<div class="chooser">${parts.join('')}<div class="chooser-row"><button type="button" class="chip" data-remove="1">この水路を外す</button><button type="button" class="chip" data-close="1">閉じる</button></div></div>`;
}

function outletsHtml(st, outlets) {
  return outlets.map(o => {
    const label = st.outlets.find(x => x.id === o.id).label;
    return `<li class="${o.verdict}"><span>${label}</span><span class="v">${verdictText[o.verdict]}</span><span class="amount">届いた <b>${fmt(o.flow)}</b>・指定 ${o.target}</span></li>`;
  }).join('');
}

function renderPanel() {
  const panel = $('panel');
  const st = stage();
  if (state.phase === 'edit') {
    const n = state.config.connected.size;
    panel.innerHTML = `
      <p class="hint">${st.hint}</p>
      <div class="actions">
        <button type="button" class="ghost" id="clear-wires" ${n ? '' : 'disabled'}>配線クリア</button>
        <button type="button" class="primary" id="run" ${n ? '' : 'disabled'}>水を流す</button>
      </div>`;
    return;
  }
  if (state.phase === 'running') {
    panel.innerHTML = `
      <p class="hint running">${state.run?.gated ? '水が流れています。落ち着いたら水門を閉じます…' : '水が流れています…'}</p>
      <div class="actions"><button type="button" class="ghost" id="stop">停止</button></div>`;
    return;
  }
  const ev = state.evaluation;
  const gated = ev.states.length > 1;
  const head = ev.outcome === 'perfect' ? '100点' : ev.outcome === 'clear' ? 'クリア' : 'NG';
  const outlets = gated
    ? ev.states.map(s => `<li class="state-head">${stateTitle[s.name]}</li>${outletsHtml(st, s.outlets)}`).join('')
    : outletsHtml(st, ev.outlets);
  const scale = scaleNow();
  const shown = ev.states[ev.states.length - 1];
  const towerRows = st.towers.map(t => {
    const r = shown.result.towers[t.id];
    if (r.state === 'empty') return `<tr><td>グラス${t.id}</td><td colspan="3">空（泉につながっていない）</td></tr>`;
    return `<tr><td>グラス${t.id}</td><td>${fmt(r.level)}</td><td>${sideText[tickSide(r.level, scale)]}</td><td>入る ${fmt(r.inflow)} ／ 出る ${fmt(r.outflow)}</td></tr>`;
  }).join('');
  const pipeRows = st.candidates.filter(c => state.config.connected.has(c.id)).map(c => {
    const p = shown.result.pipes[c.id];
    const thin = thinnessOf(c, state.config);
    if (!p) return `<tr><td>${c.a}–${c.b}</td><td colspan="2">${c.gate ? '水門が閉じている' : shown.broken.has(c.id) ? 'サイフォンが切れた' : '呼び水なし'}</td><td>${thin}</td></tr>`;
    return `<tr><td>${c.a}–${c.b}</td><td>${fmt(p.flow)}</td><td>${fmt(p.diff)}</td><td>${thin}</td></tr>`;
  }).join('');
  const swipeVerb = coarsePointer ? '指でなぞる' : 'マウスでなぞる';
  const li = items => items.map(t => `<li>${t}</li>`).join('');
  let explainHtml = '';
  if (state.explain) {
    const adviceTitle = ev.outcome === 'ng' ? '見直すところ' : ev.outcome === 'clear' ? '100点をめざすには' : '';
    explainHtml = ev.states.map((s, i) => {
      const e = explain(st, state.config, ev, state.analysis, scale, i);
      return `
      <section class="explain" aria-label="解説${gated ? `（${stateTitle[s.name]}）` : ''}">
        ${gated ? `<h4>${stateTitle[s.name]}</h4>` : ''}
        <h3>${e.summary}</h3>
        ${e.advice.length ? `${adviceTitle ? `<h4>${adviceTitle}</h4>` : ''}<ul>${li(e.advice)}</ul>` : ''}
        <details><summary>計算を見る</summary>
          <h4>流れる量 ＝ 高さの差 ÷ 細さ</h4><ul class="calc">${li(e.steps)}</ul>
          ${e.balances.length ? `<h4>グラスでは、入る量 ＝ 出る量</h4><ul class="calc">${li(e.balances)}</ul>` : ''}
        </details>
      </section>`;
    }).join('');
  }
  const usedText = st.theme === 'buckets' ? `桶 ${ev.buckets}・水路 ${ev.used} 本` : `水路 ${ev.used} 本`;
  panel.innerHTML = `
    <div class="result ${ev.outcome}" role="status">
      <div class="result-head"><span class="badge">${head}</span><span class="score">${ev.outcome === 'ng' ? '' : `${displayScore(ev.score)} 点`}</span>
        <span class="used">${usedText}${ev.outcome === 'clear' ? `（満点は ${st.theme === 'buckets' ? `桶 ${state.analysis.perfectConfig.primed.length}・` : ''}${state.analysis.perfectCount} 本）` : ''}</span>
        ${state.newBest ? '<span class="newbest">最高点</span>' : ''}</div>
      ${state.saveMessage ? `<p class="warn">${state.saveMessage}</p>` : ''}
      <ul class="outlets">${outlets}</ul>
      <p class="swipe">グラスを${swipeVerb}と、そのグラスの音を聞き直せます。</p>
      ${explainHtml}
      <details id="detail" ${state.details ? 'open' : ''}><summary>くわしい記録${gated ? '（水門を閉じたとき）' : ''}</summary>
        <div class="table-wrap"><table><thead><tr><th>グラス</th><th>水位</th><th>目盛り</th><th>流れ</th></tr></thead><tbody>${towerRows}</tbody></table></div>
        <div class="table-wrap"><table><thead><tr><th>水路</th><th>流れる量</th><th>水位の差</th><th>細さ</th></tr></thead><tbody>${pipeRows}</tbody></table></div>
        <div class="actions"><button type="button" class="ghost" id="export-record">記録をファイルに書き出す</button></div>
      </details>
    </div>
    <div class="actions">
      <button type="button" class="ghost" id="explain" aria-expanded="${state.explain}">${state.explain ? '解説を閉じる' : '解説'}</button>
      <button type="button" class="ghost" id="stop">停止してつなぎ直す</button>
      ${ev.outcome !== 'ng' && state.stageIndex < STAGES.length - 1 ? '<button type="button" class="primary" id="next">次の面へ</button>' : ''}
    </div>`;
}

// 選択肢のトースト（前作 prism の配線削除のトーストに合わせる）。
// 画面の上と下のうち、選んだ管と重なりが少ない側に置く
function renderToast() {
  const toast = $('toast');
  const c = state.phase === 'edit' && state.selected ? candidate(state.selected) : null;
  if (!c) { if (toast.open) toast.close(); toast.innerHTML = ''; return; }
  toast.innerHTML = chooserHtml();
  if (!toast.open) toast.showModal();
  const rect = toast.getBoundingClientRect();
  const pipe = $('board').querySelector(`[data-pipe="${CSS.escape(c.id)}"]`)?.getBoundingClientRect();
  const gap = 8;
  const bottom = Math.max(gap, innerHeight - rect.height - gap);
  const overlap = top => pipe ? Math.max(0, Math.min(top + rect.height, pipe.bottom) - Math.max(top, pipe.top)) : 0;
  toast.style.top = `${overlap(bottom) <= overlap(gap) ? bottom : gap}px`;
  toast.style.left = `${Math.max(gap, (innerWidth - rect.width) / 2)}px`;
}

function closeToast() {
  if (!state.selected) return;
  state.selected = null;
  renderAll();
}

function renderAll() {
  renderTabs();
  renderCondition();
  renderPanel();
  renderToast();
  drawBoard();
  $('board').classList.toggle('swipeable', state.phase === 'result');
  $('board').classList.toggle('editable', state.phase === 'edit');
}

// ---- 調整用の設定（試作） ----
function openTuning() {
  const sheet = $('sheet');
  const v = state.timing;
  sheet.innerHTML = `
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="tune-title">
      <h2 id="tune-title">タイミングの調整（試作用）</h2>
      <p class="note">グラスハープの余韻に合わせて決めるための仮の設定です。この端末にだけ保存し、次に水を流したときから使います。</p>
      <form id="tune-form">
        ${TIMING_FIELDS.map(([key, label, min, max, step]) => `
          <label class="field" for="tune-${key}"><span>${label}</span>
            <span class="val" id="tune-${key}-val">${fieldText(key, v[key])}</span>
            <input type="range" id="tune-${key}" name="${key}" min="${min}" max="${max}" step="${step}" value="${v[key]}">
          </label>`).join('')}
        <label class="field" for="tune-timbre"><span>音色（比べる用）</span>
          <select id="tune-timbre" name="timbre">${TIMBRES.map(([id, label]) => `<option value="${id}" ${id === v.timbre ? 'selected' : ''}>${label}</option>`).join('')}</select>
        </label>
        <div class="actions"><button type="button" class="ghost" id="tune-try">選んだ音色で試しに鳴らす</button></div>
        <p class="note" id="tune-status" role="status"></p>
        <div class="actions">
          <button type="button" class="ghost" id="tune-reset">初期値に戻す</button>
          <button type="button" class="ghost" id="tune-close">閉じる</button>
          <button type="submit" class="primary">保存</button>
        </div>
      </form>
    </div>`;
  sheet.hidden = false;
  const form = $('tune-form');
  form.addEventListener('input', e => {
    const key = e.target.name;
    if (!key || key === 'timbre') return;
    const val = Number(e.target.value);
    $(`tune-${key}-val`).textContent = fieldText(key, val);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const next = { ...state.timing };
    for (const [key] of TIMING_FIELDS) next[key] = Number(form.elements[key].value);
    next.timbre = form.elements.timbre.value;
    state.timing = next;
    audio.setLatency(next.latencyMs);
    audio.timbre = next.timbre;
    $('tune-status').textContent = saveTiming(next) ? '保存しました。次に水を流したときから使います。' : 'この端末には保存できませんでした。開いている間だけ使います。';
  });
  $('tune-reset').addEventListener('click', () => {
    state.timing = { ...DEFAULT_TIMING };
    saveTiming(state.timing);
    audio.setLatency(state.timing.latencyMs);
    audio.timbre = state.timing.timbre;
    openTuning();
    $('tune-status').textContent = '初期値に戻しました。';
  });
  $('tune-close').addEventListener('click', () => { sheet.hidden = true; });
  // 保存せずに、選んだ音色で2つのグラスの和音と単音を鳴らして比べる
  $('tune-try').addEventListener('click', () => {
    audio.unlock();
    const saved = audio.timbre;
    audio.timbre = form.elements.timbre.value;
    const scale = { ...DEFAULT_SCALE, semitonesPerStep: Number(form.elements.semitones.value) };
    audio.tone(frequencyForLevel(2, scale), { gain: 0.2, attack: 0.08, hold: 0.35, release: 1.8 });
    audio.chord([frequencyForLevel(4, scale), frequencyForLevel(2, scale)], { at: audio.now + 1.6, length: Number(form.elements.chordMs.value) / 1000 });
    audio.timbre = saved;
  });
}

// ---- 操作 ----
function boardPoint(evt) {
  const svg = $('board');
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const m = svg.getScreenCTM();
  return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
}


let swipeTower = null;
function swipeAt(evt) {
  if (state.phase !== 'result') return;
  const p = boardPoint(evt);
  const id = towerAt(state.layout, stage(), p.x, p.y);
  if (id === swipeTower) return;
  swipeTower = id;
  if (!id) return;
  const states = state.evaluation.states;
  const r = states[states.length - 1].result.towers[id];
  state.highlight = { id, until: performance.now() + 450 };
  if (r.state !== 'water') return;
  audio.unlock();
  audio.towerTone(frequencyForLevel(r.level, scaleNow()), { gain: 0.2, attack: 0.08, hold: 0.35, release: 1.8 });
}

function bind() {
  // 音の準備は、触れた瞬間と離した瞬間の両方で行う（スマホは、離したときの操作でしか音を始められない機種がある）
  document.addEventListener('pointerdown', () => audio.unlock(), true);
  document.addEventListener('pointerup', () => audio.unlock(), true);
  // ボタンの操作音（前作と同じく、音のオン・オフのボタン以外）。ボタンの処理より先に鳴らし、
  // その処理で音が止まっても操作音は残す
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.disabled || b.id === 'sound') return;
    audio.unlock();
    audio.cue('tap');
  }, true);
  $('stage-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-stage]');
    if (b && !b.disabled) selectStage(Number(b.dataset.stage));
  });
  $('panel').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    const id = btn.id;
    if (id === 'run') startRun();
    else if (id === 'stop') { stopRun(); renderAll(); }
    else if (id === 'clear-wires') { state.config = emptyConfig(); state.selected = null; renderAll(); }
    else if (id === 'next') selectStage(state.stageIndex + 1);
    else if (id === 'export-record') exportRecord();
    else if (id === 'explain') {
      state.explain = !state.explain;
      renderPanel();
      if (state.explain) document.querySelector('.explain')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  // トーストで選んだら、設定して閉じる（もう一度管をタップすると開き直す）
  $('toast').addEventListener('click', e => {
    const toast = $('toast');
    const r = toast.getBoundingClientRect();
    if (e.target === toast && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) {
      // 外のタップは閉じるだけにして、下にある管やボタンを押さない
      e.preventDefault();
      closeToast();
      return;
    }
    const btn = e.target.closest('button');
    if (!btn || btn.disabled || !state.selected) return;
    if (btn.dataset.thick) state.config.thickness[state.selected] = btn.dataset.thick;
    else if (btn.dataset.prime === 'on' && bucketsLeft() > 0) state.config.primed.add(state.selected);
    else if (btn.dataset.prime === 'off') state.config.primed.delete(state.selected);
    else if (btn.dataset.remove) removePipe(state.selected);
    else if (!btn.dataset.close) return;
    state.selected = null;
    renderAll();
  });
  $('toast').addEventListener('cancel', e => { e.preventDefault(); closeToast(); }); // Esc
  $('panel').addEventListener('toggle', e => { if (e.target.id === 'detail') state.details = e.target.open; }, true);
  const svg = $('board');
  // 管のタップ：指を離した時点で、触れた点にいちばん近い管を選ぶ。
  // 管は端で7ほどの間隔で並ぶので、重なったタップ領域の上下関係で選ぶと、隣の管を拾ってしまう
  let press = null;
  svg.addEventListener('pointerdown', e => {
    if (state.phase === 'edit') press = { id: e.pointerId, x: e.clientX, y: e.clientY };
  });
  svg.addEventListener('pointerup', e => {
    const p = press;
    press = null;
    if (state.phase !== 'edit' || !p || p.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 12) return; // なぞった・ずれたときは押していない扱い
    const p2 = boardPoint(e);
    const pipe = pipeAt(state.layout, stage(), p2.x, p2.y);
    if (pipe) tapPipe(pipe);
  });
  svg.addEventListener('pointercancel', () => { press = null; });
  svg.addEventListener('pointerdown', e => {
    if (state.phase !== 'result') return;
    swipeTower = null;
    svg.setPointerCapture?.(e.pointerId);
    swipeAt(e);
  });
  svg.addEventListener('pointermove', e => {
    if (state.phase === 'result' && (e.buttons || e.pointerType === 'touch' || e.pointerType === 'mouse')) swipeAt(e);
  });
  svg.addEventListener('pointerleave', () => { swipeTower = null; });
  svg.addEventListener('pointerup', () => { swipeTower = null; });
  $('sound').addEventListener('click', () => {
    audio.unlock();
    audio.setMuted(!audio.muted);
    if (!audio.muted) audio.cue('tap'); // 音をオンにしたときだけ、確かめの操作音（前作と同じ）
    $('sound').textContent = audio.muted ? '音 オフ' : '音 オン';
    $('sound').setAttribute('aria-pressed', String(!audio.muted));
  });
  $('tune').addEventListener('click', openTuning);
  $('version').textContent = `v${APP_VERSION}`;
  $('board').setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
}

// ---- 実行記録の書き出し（F-024、D-11）。端末には残さず、ファイルとして渡す ----
function exportRecord() {
  if (!state.evaluation) return;
  const record = buildRecord({ stage: stage(), config: state.config, ev: state.evaluation, appVersion: APP_VERSION });
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aqua-notes-record-${stage().id}-${record.createdAt.replace(/[:.]/g, '-')}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---- 通信なしで使う仕組みと、新しい版の案内（F-022、S-11） ----
// 配信用のビルドだけが印（aqua-offline）を入れる。開発中と確認用ページでは登録しない
function setupOffline() {
  if (!document.querySelector('meta[name="aqua-offline"]') || !('serviceWorker' in navigator)) return;
  const notice = $('update-notice');
  const offer = worker => {
    notice.hidden = false;
    $('update-apply').onclick = () => {
      if (state.phase === 'running') return; // 水が流れている間は切り替えない
      worker.postMessage('activate-update');
    };
  };
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
  navigator.serviceWorker.register('./sw.js').then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const next = reg.installing;
      next?.addEventListener('statechange', () => {
        if (next.state === 'installed' && navigator.serviceWorker.controller) offer(next);
      });
    });
  }).catch(() => { /* 登録できない環境では、通信ありでそのまま遊べる */ });
}

bind();
selectStage(0);
setupOffline();
