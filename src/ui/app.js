// 試作の画面のまとめ役：編集中 → 実行中 → 結果表示中 → 停止で編集中（要件5.3）
import { STAGES } from '../content/stages.js';
import { CHALLENGES } from '../content/challenges.js';
import { drawChallenge } from '../content/challenge-draw.js';
import { analyzeStage, evaluate, thinnessOf } from '../logic/play.js';
import { onScale, tickSide, tickDistance, frequencyForLevel, DEFAULT_SCALE } from '../logic/pitch.js';
import { displayScore } from '../logic/score.js';
import { explain, formatAmount } from '../logic/explain.js';
import { ScoreBook, scoreKey, buildRecord } from '../logic/records.js';
import { GlassAudio, DEFAULT_LATENCY_MS, TIMBRES } from './audio.js';
import { lessonFor, buildQuestion, answerLine, TutorialBook, PRACTICE, PRACTICE_STEPS, practiceResultText } from '../content/tutorial.js';
import { guideMessage } from './guide-copy.js';
import { renderBoard, layoutFor, towerAt, pipeAt, VIEW_W, VIEW_H } from './board.js';
import { LEVELS, ContinuousRun, ModeBook } from '../logic/modes.js';
import { resultCardDelay, STAGE_CUE_MS, stageCueOpacity } from './visual-timing.js';

const APP_VERSION = '0.14.4';
// v3：結果の間合いをグラスの和音の減衰に合わせて置き直した（2026-11-01）。初期値を新しい値にそろえるため、それまでの調整は引き継がない
const TIMING_KEY = 'aqua-notes.prototype-timing.v3';
// 結果の間合い（試作の仮の値）。秒数はグラスハープの余韻に合わせて試作で決める（要件NF-002・Q-04）。
// 前作 prism の間合いは「鐘の主な響きが引いてから（鐘は0.6秒で約6分の1）クリアのジングル0.7秒、NGのジングル1.5秒、
// カードはどちらも1.6秒」。鐘は打った瞬間が最大ですぐ引くが、グラスの和音は約1秒伸びてから引く。
// そこで、和音が約6分の1まで下がる1.4秒を前作の0.7秒にあたる点とし、前作の間隔をそのまま当てはめた：
// クリアのジングル1.4秒・カード2.3秒、NGのジングル2.2秒・カード2.3秒（和音の長さ2.6秒のとき。2026-11-01 発案者が選択）
const DEFAULT_TIMING = Object.freeze({ riseMs: 1300, chordMs: 2600, jingleMs: 1400, jingleNgMs: 2200, cardClearMs: 2300, cardNgMs: 2300, latencyMs: DEFAULT_LATENCY_MS, timbre: 'fm2' });
const TIMING_FIELDS = [
  ['latencyMs', '音の準備の余裕（音が途切れるときは大きく）', 0, 300, 10],
  ['riseMs', '水面が上がる時間', 400, 3000, 100],
  ['chordMs', '落ち着いた音の長さ（余韻を含む）', 800, 6000, 100],
  ['jingleMs', '落ち着いてからジングルまで（クリア）', 0, 4000, 100],
  ['jingleNgMs', '落ち着いてからジングルまで（NG）', 0, 4000, 100],
  ['cardClearMs', '落ち着いてから結果まで（クリア）', 0, 5000, 100],
  ['cardNgMs', '落ち着いてから結果まで（NG）', 0, 5000, 100]
];
const GATE_HOLD_MS = 1500; // 水門の面：開いた状態で落ち着いてから、水門を閉じるまで（試作の仮の値）

const $ = id => document.getElementById(id);
const audio = new GlassAudio();
const scoreBook = new ScoreBook((() => { try { return window.localStorage; } catch { return null; } })());
const tutorial = new TutorialBook((() => { try { return window.localStorage; } catch { return null; } })());
const modeBook = new ModeBook((() => { try { return window.localStorage; } catch { return null; } })());
// 今の面で精霊の案内を出しているか（チュートリアル、選択プレイで初めての面、または「ふりかえり」で開き直したとき）。
// 連続プレイでは出さない（Q-16）
const guiding = () => state.mode !== 'continuous' && tutorial.active(stage(), state.review);
// 練習面（番号 -1 で選ぶ）と、今の案内の手順
const isPractice = () => stage()?.id === PRACTICE.id;
const practiceStep = () => (isPractice() && state.phase === 'edit' ? PRACTICE_STEPS[state.practiceStep] ?? null : null);
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
  current: null, // 遊んでいる面（出題の数値を当てはめたもの）
  loadError: '', // 出題を出せない理由（C-04）
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
  highlight: null,
  stageCueUntil: 0,
  mode: 'select', // tutorial・continuous・select
  continuous: null, // 連続プレイの進み具合（ContinuousRun）
  contAction: null, // 連続プレイで、結果のあとにすること（next・retry・gameover・complete）
  trials: 0, // 選択プレイ：この面を開いてから「水を流す」を押した回数（F-025）
  newFewest: false,
  titleOpen: true,
  played: false
};
audio.setLatency(state.timing.latencyMs);
audio.timbre = state.timing.timbre;

function fieldText(key, value) {
  if (key === 'latencyMs') return `${value} ミリ秒`;
  return `${(value / 1000).toFixed(1)} 秒`;
}

const scaleNow = () => DEFAULT_SCALE;
const stage = () => state.current;
const candidate = id => stage().candidates.find(c => c.id === id);
const bucketsLeft = () => (stage().buckets ?? 0) - [...state.config.primed].filter(id => state.config.connected.has(id)).length;
const targetText = t => (typeof t === 'object' ? `開 ${t.open}・閉 ${t.closed}` : t);

// 直前の出題（面IDごと）。アプリを開いている間だけ覚え、端末には保存しない（logic-design 7.4）
const lastDrawn = new Map();

// 面を選ぶたびに、直前と違う系統から出題を抽選する。お試しは固定。
// 「つなぎ直す」「配管クリア」では呼ばないので、同じ出題を保つ
function selectStage(index) {
  stopRun();
  state.stageIndex = index;
  const base = index < 0 ? PRACTICE : STAGES[index];
  state.practiceStep = 0;
  state.loadError = '';
  try {
    state.current = drawChallenge(base, CHALLENGES[base.id], { previousId: lastDrawn.get(base.id) });
    if (state.current.draw) lastDrawn.set(base.id, state.current.draw.id);
  } catch (error) {
    state.current = structuredClone(base);
    state.loadError = error.message;
  }
  state.config = emptyConfig();
  state.selected = null;
  state.prevLevels = new Map();
  state.analysis = analyzeStage(stage());
  // 出題データの検査結果と、端末での計算が一致しない出題は遊ばせない（C-04）
  if (!state.loadError && stage().expected && state.analysis.perfectKey !== stage().expected.perfectKey) {
    state.loadError = 'この出題は、検査の結果と計算が一致しないため遊べません。別の出題を選んでください。';
  }
  state.layout = layoutFor(stage());
  state.evaluation = null;
  state.details = false;
  state.explain = false;
  state.resultClosed = false;
  // チュートリアルでは、お試し面の案内と予想の問いを毎回出す
  state.review = state.mode === 'tutorial' && Boolean(lessonFor(base));
  state.asking = null;
  state.prediction = null;
  state.trials = 0;
  state.contAction = null;
  state.newFewest = false;
  if (state.mode === 'select') lastSelectIndex = index;
  state.stageCueUntil = !state.titleOpen && index >= 0 && !state.loadError ? performance.now() + STAGE_CUE_MS : 0;
  renderAll();
  if (state.stageCueUntil) loop();
}

// ---- 編集：配管をつなぐ・外す・太さ・呼び水（F-002、F-005、F-008） ----
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
  if (practiceStep()?.until === `connect:${id}` && cfg.connected.has(id)) state.practiceStep++;
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
  state.trials++;
  const st = stage();
  const timing = { ...state.timing };
  const scale = DEFAULT_SCALE;
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
  later(settleAt + resultCardDelay(evaluation.outcome, timing), showResult);
  renderAll();
  loop();
}

// 案内中の面では、流す前に「届く量」を予想してもらう（F-019）。届かないつなぎ方では聞かずに流す
function askOrRun() {
  if (practiceStep()?.until === 'run') state.practiceStep++;
  if (guiding()) {
    const q = buildQuestion(stage(), evaluate(stage(), state.config, state.analysis, scaleNow()));
    if (q) { state.selected = null; state.asking = q; renderAll(); return; }
  }
  startRun();
}

function showResult() {
  if (!state.run) return;
  state.phase = 'result';
  const ev = state.evaluation;
  state.saveMessage = '';
  state.newBest = false;
  if (ev.outcome !== 'ng') {
    const r = scoreBook.offer(scoreKey(stage(), stage().draw?.number ?? 1), ev.score);
    state.saveMessage = r.message;
    state.newBest = r.improved;
  }
  state.resultClosed = false;
  state.newFewest = false;
  // 選択プレイ：クリアまでの試行回数の最少を記録（F-025）。連続プレイ：NGを数え、次にすることを決める（F-026）
  if (state.mode === 'select' && ev.outcome !== 'ng' && !isPractice()) state.newFewest = modeBook.offerTrials(stage().id, state.trials);
  if (state.mode === 'continuous' && state.continuous) {
    state.contAction = state.continuous.record(ev.outcome);
    if (state.contAction === 'gameover' || state.contAction === 'complete') modeBook.offerContinuous(state.continuous.level.id, state.continuous.cleared);
  }
  if (isPractice() && ev.outcome !== 'ng') tutorial.complete(PRACTICE);
  if (state.prediction) {
    state.explain = true;
    tutorial.complete(stage());
    state.review = false;
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
  state.prediction = null;
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
    const done = state.phase === 'edit' && now >= state.stageCueUntil;
    // 最後は32msの間隔を待たず描く。薄い合図が残ったまま停止することを防ぐ。
    if (now - lastDraw >= 32 || done) { lastDraw = now; drawBoard(); }
    if (!done) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

function drawBoard() {
  const now = performance.now();
  const startCue = stageCueOpacity(state.stageCueUntil, now, reducedMotionQuery.matches);
  $('cond').style.setProperty('--stage-cue', startCue.toFixed(3));
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
    // 噴水が噴き始める時刻：クリアのジングルの鳴り始めと同じ（2026-11-01 発案者。NGは噴かない）
    fountainAt: state.run ? state.run.start + state.run.settleAt + state.run.timing.jingleMs : null,
    outcome: state.evaluation?.outcome ?? null,
    prevLevels: state.prevLevels,
    time: now,
    reducedMotion: reducedMotionQuery.matches,
    highlight: state.highlight,
    guide: practiceStep() && practiceStep().target !== 'run' ? practiceStep().target : null,
    startCue,
    onScale: level => onScale(level, scale),
    tickDistance: level => tickDistance(level, scale)
  });
}

// 面の印には、その面（今の内容版）のどの出題かを問わず、いちばん良い成績を使う
function bestOfStage(s) {
  const count = CHALLENGES[s.id]?.length ?? 1;
  let best = null;
  for (let n = 1; n <= count; n++) {
    const b = scoreBook.best(scoreKey(s, n));
    if (b && (!best || b.cmp(best) > 0)) best = b;
  }
  return best;
}

// 面の切り替えと条件カード（前作 prism に合わせる。docs/reference/prism-v0.100.0-q3-layout.png）。
// 1行目：‹ 面の名前と所属 ∨ ›（前後の移動は選択プレイだけ。名前を押すと面の一覧）。
// 条件カード：「クリア条件」と、出題・別の出題などの小さなボタン／条件の一文／資源の行（桶・配管・連続プレイのNGの残り）
const MODE_NAME = { tutorial: 'チュートリアル', continuous: '連続プレイ', select: '選択プレイ' };
function condHtml(st, { left = st.buckets ?? 0, connected = 0, phase = 'edit', review = false, mode = 'select', cont = null } = {}) {
  const isPrac = st.id === PRACTICE.id;
  const nav = mode === 'select' && phase !== 'running';
  const sub = mode === 'continuous' && cont ? `連続プレイ（${cont.level.name}）・${st.set}` : `${MODE_NAME[mode]}・${st.set}`;
  const goal = `${st.outlets.map(o => `<span class="nw">${o.label}に <b>${targetText(o.target)}</b></span>`).join('・')} 届ける`;
  const res = [
    st.buckets ? `<span class="nw">桶 残り <b>${left}</b> / ${st.buckets}</span>` : '',
    `<span class="nw">配管 <b>${connected}</b> 本</span>`,
    mode === 'continuous' && cont ? `<span class="nw ng-left">${cont.level.limit === null ? `NG <b>${cont.ng}</b> 回` : `NG 残り <b>${cont.left}</b> 回`}</span>` : ''
  ].filter(Boolean).join('');
  const tools = isPrac ? `<button type="button" class="mini" id="practice-restart" ${phase === 'edit' ? '' : 'disabled'}>最初から</button>`
    : mode === 'select' && lessonFor(st) && !st.draw ? `<button type="button" class="mini" id="review" ${review ? '' : 'disabled'}>ふりかえり</button>`
    : mode === 'select' && st.draw ? `<span class="draw-no">出題 ${st.draw.number} / ${st.draw.total}</span><button type="button" class="mini" id="redraw" ${phase === 'edit' ? '' : 'disabled'}>別の出題</button>`
    : '';
  return `
    <div class="switcher">
      <button type="button" class="nav" id="stage-prev" aria-label="前の面" ${nav && state.stageIndex > -1 ? '' : 'disabled'} ${mode === 'select' ? '' : 'hidden'}>‹</button>
      <button type="button" class="stage-name" id="stage-list" ${mode === 'select' && phase !== 'running' ? '' : 'disabled'}>
        <span class="name">${isPrac ? '' : `${st.number} `}${st.title}</span><span class="sub">${sub}</span>${mode === 'select' ? '<span class="caret" aria-hidden="true">∨</span>' : ''}</button>
      <button type="button" class="nav" id="stage-next" aria-label="次の面" ${nav && state.stageIndex < STAGES.length - 1 ? '' : 'disabled'} ${mode === 'select' ? '' : 'hidden'}>›</button>
    </div>
    <div class="cond-card">
      <div class="cond-head"><span class="cond-label">クリア条件</span><span class="cond-tools">${tools}</span></div>
      <div class="cond-goal">${goal}</div>
      <div class="cond-res">${res}</div>
    </div>`;
}

function renderCondition() {
  $('cond').innerHTML = condHtml(stage(), {
    left: bucketsLeft(), connected: state.config.connected.size, phase: state.phase,
    review: state.phase === 'edit' && !guiding(), mode: state.mode, cont: state.continuous
  });
}

// 条件の欄の高さを、全部の面・全部のモードで一番高いものにそろえる。面の名前・噴水盤の数・桶の有無で折り返しの行数が変わり、
// 盤面の大きさが面ごとに変わっていたため（2026-11-01 発案者、iPhone で確認）。
// 文字の幅は端末の書体で変わるので、その端末・その画面幅で実際に測る。画面幅が変わったら測り直す
function fitConditionHeight() {
  const cond = $('cond');
  if (!cond.clientWidth) return;
  const probe = cond.cloneNode(false);
  probe.removeAttribute('id');
  probe.removeAttribute('aria-live');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;min-height:0;width:${cond.clientWidth}px`;
  cond.parentElement.append(probe);
  const cont = new ContinuousRun('beginner', STAGES.length);
  let max = 0;
  for (const st of [PRACTICE, ...STAGES]) {
    const shown = CHALLENGES[st.id]?.length ? { ...st, draw: { number: 8, total: 8 } } : st;
    for (const mode of ['select', 'continuous', 'tutorial']) {
      probe.innerHTML = condHtml(shown, { left: 10, connected: 10, mode, cont });
      max = Math.max(max, probe.getBoundingClientRect().height);
    }
  }
  probe.remove();
  cond.style.minHeight = `${Math.ceil(max)}px`;
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
  // 見出しと簡単な説明（何を選ぶのか、選ぶとどうなるか）。桶の残りはバッジで目立たせる
  if (c.siphon) {
    const left = bucketsLeft();
    parts.push(`<div class="chooser-head"><h3>サイフォン</h3><span class="bucket-badge${left ? '' : ' empty'}" aria-label="桶の残り ${left}個（全部で${stage().buckets}個）">桶 残り <b>${left}</b> / ${stage().buckets}</span></div>`);
    parts.push('<p class="chooser-note">壁を越える管は、中に空気がたまっていて流れません。桶の水で満たす（呼び水）と流れ始めます。</p>');
  } else if (c.adjustable) {
    parts.push('<div class="chooser-head"><h3>太さを選ぶ</h3></div>');
    parts.push('<p class="chooser-note">太いほど水が流れやすく、たくさん運びます。</p>');
  }
  if (c.adjustable) {
    parts.push(`<div class="chooser-row"><span>太さ</span>${c.adjustable.map(t => `<button type="button" class="chip${cfg.thickness[c.id] === t ? ' on' : ''}" data-thick="${t}" aria-pressed="${cfg.thickness[c.id] === t}">${THICK_NAME[t]}</button>`).join('')}</div>`);
  }
  if (c.siphon) {
    const primed = cfg.primed.has(c.id);
    parts.push(`<div class="chooser-row">${primed
      ? '<button type="button" class="chip on" data-prime="off">呼び水を取り消す</button>'
      : `<button type="button" class="chip" data-prime="on" ${bucketsLeft() > 0 ? '' : 'disabled'}>桶で呼び水をする</button>${bucketsLeft() > 0 ? '' : '<span class="note-inline">桶が残っていません</span>'}`}</div>`);
  }
  return `<div class="chooser">${parts.join('')}<div class="chooser-row chooser-actions"><button type="button" class="chip" data-remove="1">この配管を外す</button><button type="button" class="chip" data-close="1">閉じる</button></div></div>`;
}

// かっこ書き（前に付く数値ごと）を1かたまりにして、途中で折り返さない。
// 文の折り返しは CSS の word-break: auto-phrase で文節ごとにするが、対応していないブラウザでもかっこは崩さない
function keepTogether(text) {
  return String(text).replace(/[0-9A-Za-z./−-]*（[^（）]{1,20}）/g, m => `<span class="nw">${m}</span>`);
}

function outletsHtml(st, outlets) {
  return outlets.map(o => {
    const label = st.outlets.find(x => x.id === o.id).label;
    return `<li class="${o.verdict}"><div class="delivery-head"><span>${label}</span><span class="v">${verdictText[o.verdict]}</span></div><div class="delivery-values"><div><span>必要量</span><b>${o.target}</b></div><div><span>届いた量</span><b>${fmt(o.flow)}</b></div></div></li>`;
  }).join('');
}

function renderPanel() {
  const panel = $('panel');
  const st = stage();
  $('board-aux').replaceChildren();
  if (state.phase === 'edit') {
    const n = state.config.connected.size;
    panel.innerHTML = `
      ${state.loadError ? `<p class="warn" role="alert">${state.loadError}</p>` : practiceStep() ? `<p class="hint guide">${guideMessage(practiceStep().text)}</p>` : guiding() ? `<p class="hint guide">${guideMessage(lessonFor(st).intro)}</p>` : `<p class="hint">${st.hint}</p>`}
      <div class="actions">${practiceStep()?.until === 'next'
        ? '<button type="button" class="primary" id="guide-next">次へ</button>'
        : `<button type="button" class="ghost" id="clear-pipes" ${n ? '' : 'disabled'}>配管クリア</button>
        <button type="button" class="primary${practiceStep()?.target === 'run' ? ' guide-target' : ''}" id="run" ${n && !state.loadError ? '' : 'disabled'}>水を流す</button>`}
      </div>`;
    // PCだけ補助操作を盤面の下へ置く。同じボタンを移すので、無効条件も同じ。
    if (matchMedia('(min-width: 1024px) and (min-height: 600px)').matches) {
      const clear = panel.querySelector('#clear-pipes');
      if (clear) $('board-aux').append(clear);
    }
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
    if (r.state === 'empty') return `<tr><td>グラス${t.id}</td><td colspan="3">空（給水塔につながっていない）</td></tr>`;
    return `<tr><td>グラス${t.id}</td><td>${fmt(r.level)}</td><td>${sideText[tickSide(r.level, scale)]}</td><td>入る ${fmt(r.inflow)} ／ 出る ${fmt(r.outflow)}</td></tr>`;
  }).join('');
  const pipeRows = st.candidates.filter(c => state.config.connected.has(c.id)).map(c => {
    const p = shown.result.pipes[c.id];
    const thin = thinnessOf(c, state.config);
    if (!p) return `<tr><td>${c.a}–${c.b}</td><td colspan="2">${c.gate ? '水門が閉じている' : shown.broken.has(c.id) ? 'サイフォンが切れた' : '呼び水なし'}</td><td>${thin}</td></tr>`;
    return `<tr><td>${c.a}–${c.b}</td><td>${fmt(p.flow)}</td><td>${fmt(p.diff)}</td><td>${thin}</td></tr>`;
  }).join('');
  const swipeVerb = coarsePointer ? '指でなぞる' : 'マウスでなぞる';
  const li = items => items.map(t => `<li>${keepTogether(t)}</li>`).join('');
  let explainHtml = '';
  if (state.explain) {
    const adviceTitle = ev.outcome === 'ng' ? '見直すところ' : ev.outcome === 'clear' ? '100点をめざすには' : '';
    explainHtml = ev.states.map((s, i) => {
      const e = explain(st, state.config, ev, state.analysis, scale, i);
      return `
      <section class="explain" aria-label="解説${gated ? `（${stateTitle[s.name]}）` : ''}">
        ${gated ? `<h4>${stateTitle[s.name]}</h4>` : ''}
        <h3>${keepTogether(e.summary)}</h3>
        ${e.advice.length ? `${adviceTitle ? `<h4>${adviceTitle}</h4>` : ''}<ul>${li(e.advice)}</ul>` : ''}
        <details${state.prediction ? ' open' : ''}><summary>計算を見る</summary>
          <h4>流れる量 ＝ 高さの差 ÷ 細さ</h4><ul class="calc">${li(e.steps)}</ul>
          ${e.balances.length ? `<h4>グラスでは、入る量 ＝ 出る量</h4><ul class="calc">${li(e.balances)}</ul>` : ''}
        </details>
      </section>`;
    }).join('');
  }
  const usedText = st.theme === 'buckets' ? `桶 ${ev.buckets}・配管 ${ev.used} 本` : `配管 ${ev.used} 本`;
  // ボタンの位置はクリアとNGでそろえる：左から 解説（結果）・もう一度／配管を見直す・次へ。
  // 「次へ」がないとき（NG・最後の面）も同じ幅の見えない場所を残し、「もう一度」が右端へずれないようにする。
  // 「もう一度」のつもりで「次へ」を押してしまうのを防ぐ（2026-11-01 発案者）。
  // 連続プレイ：クリアは「次へ」だけ（同じ面のやり直しはしない）、NGは「配管を見直す」。ゲームオーバー・全面クリアは「もう一度挑戦」「タイトルへ」
  const slot = (cls, label) => `<button type="button" class="${cls} slot" tabindex="-1" aria-hidden="true" disabled>${label}</button>`;
  const act = state.mode === 'continuous' ? state.contAction : null;
  const finished = act === 'gameover' || act === 'complete';
  const retryButton = finished ? '<button type="button" class="ghost retry" id="cont-restart">もう一度挑戦</button>'
    : act === 'next' ? slot('ghost retry', 'もう一度')
    : `<button type="button" class="ghost retry" id="stop">${ev.outcome === 'ng' ? '配管を見直す' : 'もう一度'}</button>`;
  const tutorialEnd = state.mode === 'tutorial' && state.stageIndex === TUTORIAL_LAST && ev.outcome !== 'ng';
  const hasNext = act ? act === 'next' : ev.outcome !== 'ng' && state.stageIndex < STAGES.length - 1;
  const nextButton = finished || tutorialEnd ? `<button type="button" class="primary next" id="to-title">${tutorialEnd ? '完了' : 'タイトルへ'}</button>`
    : hasNext ? '<button type="button" class="primary next" id="next">次へ</button>'
    : slot('primary next', '次へ');
  // モードのひとこと：選択プレイは試行回数、連続プレイはNGの残りと結果
  const cont = state.continuous;
  const modeLine = state.mode === 'select' && ev.outcome !== 'ng' && !isPractice()
    ? `試行 ${state.trials} 回（この面の最少 ${modeBook.fewest(stage().id) ?? state.trials} 回）${state.newFewest ? '<span class="newbest">最少</span>' : ''}`
    : state.mode === 'continuous' && cont
      ? act === 'gameover' ? `ゲームオーバー：${cont.cleared} 面クリア（${cont.level.name}の最高 ${modeBook.bestContinuous(cont.level.id) ?? cont.cleared} 面）`
      : act === 'complete' ? `全 ${cont.stageCount} 面クリア！（NG ${cont.ng} 回）`
      : cont.level.limit === null ? `連続プレイ（${cont.level.name}）：${cont.cleared} 面クリア・NG ${cont.ng} 回`
      : `連続プレイ（${cont.level.name}）：${cont.cleared} 面クリア・NG 残り ${cont.left} 回`
      : '';
  // 結果は下の欄に重ねるトーストで出し、下の欄は編集中と同じ高さ（案内＋ボタン1行）に保つ。
  // 欄が伸びると盤面が縮むため（2026-11-01 発案者）。閉じたトーストは「結果」で開き直す
  panel.innerHTML = `
    <p class="hint">グラスを${swipeVerb}と、そのグラスの音を聞き直せます。</p>
    <div class="actions">
      <button type="button" class="ghost" id="show-result" aria-expanded="${!state.resultClosed}">結果</button>
      ${retryButton}
      ${nextButton}
    </div>`;
  state.resultHtml = `
    <div class="result ${ev.outcome}">
      <div class="result-head">
        <span class="badge" role="status">${ev.outcome === 'perfect' ? 'PERFECT' : ev.outcome === 'ng' ? '結果' : head}</span>
        <button type="button" class="close" id="result-close" aria-label="結果を閉じる">×</button>
        <div class="result-hero">
          ${ev.outcome === 'perfect' ? '<svg class="laurels" viewBox="0 0 200 76" aria-hidden="true"><defs><g id="laurel"><path d="M48 68 Q17 50 29 12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M29 15 Q15 3 25 0 Q34 2 29 15 M26 28 Q8 20 13 12 Q24 11 26 28 M28 41 Q8 39 10 28 Q23 26 28 41 M35 54 Q13 58 12 46 Q24 39 35 54 M48 66 Q24 74 23 62 Q35 53 48 66 M29 18 Q46 6 42 21 Q37 29 29 30 M28 33 Q46 22 44 35 Q40 43 31 44 M34 48 Q51 38 50 51 Q46 59 40 59" fill="currentColor"/></g></defs><use href="#laurel"/><use href="#laurel" transform="translate(200 0) scale(-1 1)"/></svg>' : ''}
          <span class="score">${ev.outcome === 'ng' ? '<span class="result-ng-word">NG</span>' : `${displayScore(ev.score).replace(/\.00$/, '')}<small>点</small>`}</span>
        </div>
        ${state.newBest ? '<span class="newbest"><svg viewBox="0 0 20 15" width="16" height="12" aria-hidden="true"><path d="M2 12 L1 3 6 6 10 0 14 6 19 3 18 12 Z M2 14 H18" fill="currentColor"/></svg> 最高点</span>' : ''}
        <span class="used">${usedText}</span>
      </div>
      ${isPractice() ? `<p class="guide-answer">${guideMessage(practiceResultText(ev.outcome))}</p>` : ''}
      ${state.prediction ? `<p class="guide-answer">${guideMessage(answerLine(state.prediction.question, state.prediction.picked))}</p>` : ''}
      ${modeLine ? `<p class="mode-line">${modeLine}</p>` : ''}
      ${state.saveMessage ? `<p class="warn">${state.saveMessage}</p>` : ''}
      <div class="result-metrics"><ul class="outlets">${outlets}</ul><div class="minimum"><span>満点の本数</span><b>${state.analysis.perfectCount}<small>本</small></b>${st.theme === 'buckets' ? `<span>桶 ${state.analysis.perfectConfig.primed.length}</span>` : ''}</div></div>
      <p class="swipe-note">グラスを${swipeVerb}と、そのグラスの音を聞き直せます。</p>
      ${explainHtml}
      <details id="detail" ${state.details ? 'open' : ''}><summary>くわしい記録${gated ? '（水門を閉じたとき）' : ''}</summary>
        <div class="table-wrap"><table><thead><tr><th>グラス</th><th>水位</th><th>目盛り</th><th>流れ</th></tr></thead><tbody>${towerRows}</tbody></table></div>
        <div class="table-wrap"><table><thead><tr><th>配管</th><th>流れる量</th><th>水位の差</th><th>細さ</th></tr></thead><tbody>${pipeRows}</tbody></table></div>
        <div class="actions"><button type="button" class="ghost" id="export-record">記録をファイルに書き出す</button></div>
      </details>
      <div class="result-actions">
        <button type="button" class="ghost" id="explain" aria-expanded="${state.explain}">解説</button>
        ${retryButton}
        ${nextButton}
      </div>
    </div>`;
}

// 結果のトースト（前作 prism のクリア・未達成のトーストに合わせる）。クリアもNGも同じ。
// 画面の下、下の欄（案内とボタン）に重ねて置く。トーストに同じボタンがあるので欄は隠れてよい。
// 解説・くわしい記録を開くとトーストを上へ広げ、盤面の上端までの高さでスクロールする（2026-11-01 発案者）
function renderResultToast() {
  const toast = $('result-toast');
  const show = state.phase === 'result' && !state.resultClosed;
  toast.hidden = !show;
  if (!show) { toast.innerHTML = ''; delete toast.dataset.html; return; }
  if (toast.dataset.html !== state.resultHtml) { toast.innerHTML = state.resultHtml; toast.dataset.html = state.resultHtml; }
  const panel = $('panel').getBoundingClientRect();
  const boardTop = $('board').parentElement.getBoundingClientRect().top;
  const width = Math.min(420, panel.width);
  toast.style.width = `${width}px`;
  toast.style.left = `${panel.right - width}px`;
  toast.style.bottom = `${Math.max(0, innerHeight - panel.bottom)}px`;
  toast.style.maxHeight = `${panel.bottom - boardTop}px`;
}

function closeResult() {
  if (state.phase !== 'result' || state.resultClosed) return;
  state.resultClosed = true;
  renderPanel();
  renderResultToast();
}

// 選択肢のトースト（前作 prism の配線削除のトーストに合わせる）。
// 画面の上と下のうち、選んだ管と重なりが少ない側に置く
function questionHtml() {
  const q = state.asking;
  return `<div class="chooser">
    <div class="chooser-head"><h3><span class="spirit" aria-label="水の精霊"></span>予想してから流そう</h3></div>
    <p class="chooser-note">${q.text}<br>選んでから水が流れます。</p>
    <div class="chooser-row">${q.choices.map(c => `<button type="button" class="chip" data-predict="${c.value}">${c.text} 届く</button>`).join('')}</div>
    <div class="chooser-row chooser-actions"><button type="button" class="chip" data-skip="1">案内をスキップ</button><button type="button" class="chip" data-close="1">やめる</button></div>
  </div>`;
}

function renderToast() {
  const toast = $('toast');
  const asking = state.phase === 'edit' && state.asking;
  const c = !asking && state.phase === 'edit' && state.selected ? candidate(state.selected) : null;
  if (!c && !asking) { if (toast.open) toast.close(); toast.innerHTML = ''; return; }
  toast.innerHTML = asking ? questionHtml() : chooserHtml();
  if (!toast.open) { toast.showModal(); toastFresh = true; }
  const rect = toast.getBoundingClientRect();
  const pipe = c ? $('board').querySelector(`[data-pipe="${CSS.escape(c.id)}"]`)?.getBoundingClientRect() : null;
  const gap = 8;
  const bottom = Math.max(gap, innerHeight - rect.height - gap);
  const overlap = top => pipe ? Math.max(0, Math.min(top + rect.height, pipe.bottom) - Math.max(top, pipe.top)) : 0;
  toast.style.top = `${overlap(bottom) <= overlap(gap) ? bottom : gap}px`;
  toast.style.left = `${Math.max(gap, (innerWidth - rect.width) / 2)}px`;
}

let toastFresh = false; // トーストが開いてから、まだ新しく押されていない
function closeToast() {
  if (!state.selected && !state.asking) return;
  state.selected = null;
  state.asking = null;
  renderAll();
}

function clearPipes() {
  state.config = emptyConfig();
  state.selected = null;
  renderAll();
}

function renderAll() {
  renderCondition();
  renderPanel();
  renderToast();
  drawBoard();
  renderResultToast();
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
      <p class="note">グラスハープの余韻に合わせて決めるための仮の設定です。この端末にだけ保存し、次に水を流したときから使います。100点では、虹を見せてから結果を出す時間を優先します。</p>
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
    const scale = DEFAULT_SCALE;
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
  // 別の出題：同じ面を選び直したのと同じ扱い（直前と違う系統から抽選）
  $('cond').addEventListener('click', e => {
    if (e.target.closest('#redraw') && state.phase === 'edit') selectStage(state.stageIndex);
    // ふりかえり：この面の案内と予想の問いを、もう一度出す
    if (e.target.closest('#review') && state.phase === 'edit') { state.review = true; renderAll(); }
    if (e.target.closest('#practice-restart') && state.phase === 'edit') selectStage(-1);
    // 面の切り替え（選択プレイだけ）：‹ › で前後、名前で一覧
    if (state.mode === 'select' && state.phase !== 'running') {
      if (e.target.closest('#stage-prev:not(:disabled)')) selectStage(state.stageIndex - 1);
      else if (e.target.closest('#stage-next:not(:disabled)')) selectStage(state.stageIndex + 1);
      else if (e.target.closest('#stage-list:not(:disabled)')) openStageList();
    }
  });
  $('panel').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    const id = btn.id;
    if (id === 'run') askOrRun();
    else if (id === 'guide-next') { state.practiceStep++; renderAll(); }
    else if (id === 'stop') { stopRun(); renderAll(); }
    else if (id === 'clear-pipes') clearPipes();
    else if (id === 'next') goNext();
    else if (id === 'to-title') openTitle(state.mode === 'tutorial' ? 'チュートリアルを終えました。連続プレイか選択プレイで遊びましょう。' : '');
    else if (id === 'cont-restart') startMode('continuous', { level: state.continuous.level.id });
    else if (id === 'show-result') { state.resultClosed = !state.resultClosed; renderPanel(); renderResultToast(); }
  });
  // トーストで選んだら、設定して閉じる（もう一度管をタップすると開き直す）
  // 管をタップしてトーストが開いた直後、同じ指の「クリック」がトーストの外に届いて閉じてしまうのを防ぐ。
  // トーストが開いてから、新しく押し始めた操作だけを受け付ける（前作の配線削除のトーストと同じ考え方）
  $('toast').addEventListener('pointerdown', () => { toastFresh = false; }, true);
  $('toast').addEventListener('click', e => {
    if (toastFresh) { e.preventDefault(); e.stopPropagation(); return; }
    const toast = $('toast');
    const r = toast.getBoundingClientRect();
    if (e.target === toast && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) {
      // 外のタップは閉じるだけにして、下にある管やボタンを押さない
      e.preventDefault();
      closeToast();
      return;
    }
    const btn = e.target.closest('button');
    if (btn && !btn.disabled && state.asking) {
      // 予想を選んだら、その予想を覚えて流す。スキップは以後の案内を出さずに流す
      const q = state.asking;
      if (btn.dataset.predict) state.prediction = { question: q, picked: btn.dataset.predict };
      else if (btn.dataset.skip) tutorial.skip();
      else if (!btn.dataset.close) return;
      state.asking = null;
      renderAll();
      if (!btn.dataset.close) startRun();
      return;
    }
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
  // 結果のトースト：たたむと見出しの1行だけにして、盤面を広く見せる
  $('result-toast').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'export-record') exportRecord();
    else if (btn.id === 'result-close') closeResult();
    else if (btn.id === 'stop') { stopRun(); renderAll(); }
    else if (btn.id === 'next') goNext();
    else if (btn.id === 'to-title') openTitle(state.mode === 'tutorial' ? 'チュートリアルを終えました。連続プレイか選択プレイで遊びましょう。' : '');
    else if (btn.id === 'cont-restart') startMode('continuous', { level: state.continuous.level.id });
    else if (btn.id === 'explain') {
      state.explain = !state.explain;
      renderPanel();
      renderResultToast();
      if (state.explain) $('result-toast').querySelector('.explain')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  // 結果のトースト以外に触れると閉じる（前作と同じ）。触れた操作そのもの（グラスのなぞり・ボタン）はそのまま行う
  document.addEventListener('pointerdown', e => {
    if (e.target.closest('#result-toast, #show-result')) return;
    closeResult();
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeResult(); });
  let layoutFrame = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      // 高さだけの変更でもPCの詰め方が変わるので、条件を測り直す。
      fitConditionHeight();
      renderPanel();
      renderResultToast();
    });
  });
  $('board-aux').addEventListener('click', e => {
    if (state.phase === 'edit' && e.target.closest('#clear-pipes:not(:disabled)')) clearPipes();
  });
  $('result-toast').addEventListener('toggle', e => {
    if (e.target.id !== 'detail') return;
    state.details = e.target.open;
    renderResultToast();
  }, true);
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
    // 丸い札と交差のまたぎは、見えている管そのものを選ぶ。ほかは従来どおり近い管。
    const tagged = e.target.closest('[data-pipe-label], [data-pipe-bridge]');
    const taggedId = tagged?.dataset.pipeLabel ?? tagged?.dataset.pipeBridge;
    const pipe = stage().candidates.some(c => c.id === taggedId) ? taggedId : pipeAt(state.layout, stage(), p2.x, p2.y);
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
  bindScreens();
  $('version').textContent = `v${APP_VERSION}`;
  $('title-version').textContent = `v${APP_VERSION} 試作`;
  $('board').setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
}

// ---- タイトル画面・モード・メニュー（前作 prism に合わせる。要件 F-025・F-026、2026-11-01 確定） ----
// タイトル：チュートリアル／連続プレイ／選択プレイ／自由作成（準備中）／パーツの説明／遊び方と概要／プレイ画面へ／更新
const TUTORIAL_LAST = 5; // チュートリアルはお試し6面（番号5）まで
let lastSelectIndex = 0; // 選択プレイで最後に開いていた面（アプリを開いている間だけ）

function openTitle(message = '') {
  stopRun();
  state.stageCueUntil = 0;
  state.titleOpen = true;
  closeSheet();
  renderTitle(message);
}
function renderTitle(message = '') {
  const title = $('title');
  title.hidden = !state.titleOpen;
  $('app').inert = state.titleOpen;
  if (!state.titleOpen) return;
  const firstTime = !tutorial.data.done[PRACTICE.id] && !tutorial.data.skipped;
  title.querySelector('[data-title="tutorial"]').classList.toggle('primary', firstTime);
  title.querySelector('[data-title="continuous"]').classList.toggle('primary', !firstTime);
  title.querySelector('[data-title="resume"]').disabled = !state.played;
  $('title-message').textContent = message;
}
function closeTitle() {
  state.titleOpen = false;
  renderTitle();
  fitConditionHeight();
  renderAll();
}

function startMode(mode, { level = null, index = null } = {}) {
  state.mode = mode;
  state.played = true;
  state.continuous = mode === 'continuous' ? new ContinuousRun(level, STAGES.length) : null;
  closeTitle();
  selectStage(mode === 'tutorial' ? -1 : mode === 'continuous' ? 0 : (index ?? lastSelectIndex));
}

// 結果の「次へ」：連続プレイは記録を進め、チュートリアルはお試し6面のあとタイトルへ戻る
function goNext() {
  if (state.mode === 'continuous') state.continuous.advance();
  if (state.mode === 'tutorial' && state.stageIndex >= TUTORIAL_LAST) { openTitle('チュートリアルを終えました。連続プレイか選択プレイで遊びましょう。'); return; }
  selectStage(state.stageIndex + 1);
}

// 下から出るシート（メニュー・記録・説明・レベル・面の一覧）。調整のシートと同じ置き場所を使う
function openSheet(title, body, actions = '<button type="button" class="ghost" data-sheet="close">閉じる</button>') {
  const sheet = $('sheet');
  sheet.innerHTML = `<div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
    <h2 id="sheet-title">${title}</h2>${body}<div class="actions">${actions}</div></div>`;
  sheet.hidden = false;
}
function closeSheet() { $('sheet').hidden = true; }

function openMenu() {
  openSheet('メニュー', `<div class="menu-grid">
    <button type="button" class="ghost" data-sheet="title">タイトルへ</button>
    <button type="button" class="ghost" data-sheet="records">記録</button>
    <button type="button" class="ghost" data-sheet="parts">パーツの説明</button>
    <button type="button" class="ghost" data-sheet="howto">遊び方と概要</button>
    <button type="button" class="ghost" data-sheet="tune">調整（試作用）</button>
  </div>`);
}

function openRecords() {
  const rows = [PRACTICE, ...STAGES].map(s => {
    const best = bestOfStage(s);
    const few = modeBook.fewest(s.id);
    return `<tr><td>${s.id === PRACTICE.id ? '練習' : s.number}</td><td>${s.title}</td><td>${best ? `${displayScore(best)} 点` : '―'}</td><td>${few ? `${few} 回` : '―'}</td></tr>`;
  }).join('');
  const cont = LEVELS.map(l => `<li>${l.name}（${l.note}）：${modeBook.bestContinuous(l.id) === null ? 'まだ記録がありません' : `最高 ${modeBook.bestContinuous(l.id)} 面クリア`}</li>`).join('');
  openSheet('記録', `<h3 class="sheet-sub">連続プレイ</h3><ul class="plain">${cont}</ul>
    <h3 class="sheet-sub">面ごと（最高点・クリアまでの最少の試行回数）</h3>
    <div class="table-wrap"><table><thead><tr><th>面</th><th>名前</th><th>最高点</th><th>最少試行</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

function openLevels() {
  const items = LEVELS.map(l => {
    const best = modeBook.bestContinuous(l.id);
    return `<button type="button" class="ghost level" data-level="${l.id}"><b>${l.name}</b><span>${l.note}${best === null ? '' : `・最高 ${best} 面`}</span></button>`;
  }).join('');
  openSheet('連続プレイ', `<p class="note">お試し1面から30面まで順に進みます。クリアできなかった回（NG）が上限を超えるとゲームオーバー。部分点のクリアでも次へ進めます。</p><div class="level-list">${items}</div>`,
    '<button type="button" class="ghost" data-sheet="close">やめる</button>');
}

function openStageList() {
  const groups = new Map();
  for (const [i, s] of STAGES.entries()) {
    if (!groups.has(s.set)) groups.set(s.set, []);
    groups.get(s.set).push([i, s]);
  }
  const item = (i, s, label) => {
    const best = bestOfStage(s);
    const mark = best ? (displayScore(best) === '100.00' ? '★' : '●') : '';
    return `<button type="button" class="stage-item${i === state.stageIndex ? ' current' : ''}" data-pick="${i}"><span class="no">${label}</span><span class="t">${s.title}</span><span class="m">${mark}</span></button>`;
  };
  const body = `<div class="stage-list">${item(-1, PRACTICE, '練習')}${[...groups].map(([set, list]) => `<h3 class="sheet-sub">${set}</h3>${list.map(([i, s]) => item(i, s, s.number)).join('')}`).join('')}</div>`;
  openSheet('面を選ぶ', body);
}

const partPicture = (id, alt) => `<img class="part-illustration" src="${new URL(`../../public/graphics/intro-${id}.svg`, import.meta.url).href}" alt="${alt}" width="960" height="360">`;
const PARTS_HTML = `<dl class="parts">
  <dt>給水塔</dt><dd>水が出るところ。給水塔の水の高さが、流れのもとになります。</dd>
  <dt>グラス</dt><dd>水がたまります。水位で音が決まり、水が多いほど低い音。目盛りに乗ると澄んだ和音になります。</dd>
  <dt>配管</dt><dd>給水塔とグラスをつなぎます。丸い札は「太・中・細」です。計算で使う細さは、太＝1・中＝2・細＝3。流れる量＝高さの差÷細さ。縦につなぐと細さは足し算、並べると流れやすくなります。</dd>
  <dt>噴水盤</dt><dd>${partPicture('outlets', '給水塔から分かれた水が2つの噴水盤へ届く様子')}必要量の水を受けます。白い陶器の枠とガラスの内器で、水位と薄い金色の目印を見比べます。出口の管の太さは引き出し線の先の丸い札で示します。</dd>
  <dt>高さの違う出口</dt><dd>${partPicture('height', '出口より高い水位の分だけ、水が流れる様子')}口が高い受け皿は、その高さより上の分だけ流れます。高さの差は口の高さから測ります。</dd>
  <dt>太さを選べる配管</dt><dd>${partPicture('adjustable', '配管をタップして3段階の太さを選ぶ様子')}タップして「太・中・細」から選びます。</dd>
  <dt>サイフォンと桶</dt><dd>${partPicture('siphon', '桶で壁を越える管の空気を水に置き換え、流れるようにする様子')}壁を越える配管です。桶で呼び水をすると流れます。桶の数には限りがあります。</dd>
  <dt>水門</dt><dd>${partPicture('gate', '水門が開いているときと閉じたあとで、水の通り道が変わる様子')}流したあと自動で閉じます。開いたときと閉じたときの両方で、必要量を届けます。</dd>
</dl>`;
const HOWTO_HTML = `<div class="howto">
  <p>配管をタップしてつなぎ、「水を流す」を押します。噴水盤に必要量が届けばクリア。使った配管が少ないほど高い点で、いちばん少ない答えが100点です（桶を使う面は、桶の少なさが先）。</p>
  <p>流れたあと、グラスを指でなぞると、そのグラスの音を聞き直せます。結果の「解説」で、なぜその量になったかを確かめられます。</p>
  <h3 class="sheet-sub">遊び方</h3>
  <ul class="plain"><li>チュートリアル：画面の見方と、お試し1〜6面で流れの決まりを学びます。</li>
  <li>連続プレイ：1面から順に進みます。レベルごとに、NGの回数に上限があります。</li>
  <li>選択プレイ：好きな面を選んで遊びます。面ごとに最高点と、クリアまでの最少の試行回数を記録します。</li>
  <li>自由作成：準備中です。</li></ul>
</div>`;

// 「更新」：新しい版を探す。見つかれば画面下に「更新する」の案内が出る（F-022）
async function checkUpdate() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (!reg) { renderTitle('この画面では更新を確かめられません（開発用の画面です）。'); return; }
    await reg.update();
    renderTitle(reg.waiting || reg.installing ? '新しい版があります。画面下の「更新する」を押してください。' : `いまの版 v${APP_VERSION} が最新です。`);
  } catch {
    renderTitle('更新を確かめられませんでした。通信できる場所でもう一度お試しください。');
  }
}

function bindScreens() {
  $('title').addEventListener('click', e => {
    const b = e.target.closest('[data-title]');
    if (!b || b.disabled) return;
    const k = b.dataset.title;
    if (k === 'tutorial') startMode('tutorial');
    else if (k === 'continuous') openLevels();
    else if (k === 'select') startMode('select');
    else if (k === 'parts') openSheet('パーツの説明', PARTS_HTML);
    else if (k === 'howto') openSheet('遊び方と概要', HOWTO_HTML);
    else if (k === 'resume') closeTitle();
    else if (k === 'update') checkUpdate();
  });
  $('sheet').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) { if (e.target === $('sheet')) closeSheet(); return; }
    if (b.dataset.level) { closeSheet(); startMode('continuous', { level: b.dataset.level }); return; }
    if (b.dataset.pick !== undefined) { closeSheet(); state.played = true; selectStage(Number(b.dataset.pick)); return; }
    const k = b.dataset.sheet;
    if (k === 'close') closeSheet();
    else if (k === 'title') openTitle();
    else if (k === 'records') openRecords();
    else if (k === 'parts') openSheet('パーツの説明', PARTS_HTML);
    else if (k === 'howto') openSheet('遊び方と概要', HOWTO_HTML);
    else if (k === 'tune') openTuning();
  });
  $('menu').addEventListener('click', openMenu);
  $('records').addEventListener('click', openRecords);
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
// 起動はタイトル画面から（前作と同じ）。初めての人には「チュートリアル」を目立たせる
selectStage(0);
renderTitle();
// 書体の読み込みで文字の幅が変わるので、読み込み後にも測り直す
document.fonts?.ready.then(() => { fitConditionHeight(); renderResultToast(); });
setupOffline();
