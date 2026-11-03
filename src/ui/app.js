// 試作の画面のまとめ役：編集中 → 実行中 → 結果表示中 → 停止で編集中（要件5.3）
import { STAGES } from '../content/stages.js';
import { CHALLENGES } from '../content/challenges.js';
import { drawChallenge } from '../content/challenge-draw.js';
import { analyzeStage, evaluate, thinnessOf, pumpCheck } from '../logic/play.js';
import { onScale, tickSide, tickDistance, frequencyForLevel, DEFAULT_SCALE } from '../logic/pitch.js';
import { displayScore } from '../logic/score.js';
import { explain, formatAmount } from '../logic/explain.js';
import { ScoreBook, scoreKey, buildRecord } from '../logic/records.js';
import { GlassAudio, DEFAULT_LATENCY_MS, TIMBRES } from './audio.js';
import { lessonFor, buildQuestion, answerLine, TutorialBook, PRACTICE, PRACTICE_STEPS, practiceResultText, partIntroFor } from '../content/tutorial.js';
import { guideMessage } from './guide-copy.js';
import { textMarkup, phraseMarkup, deliveryMarkup } from './text-layout.js';
import { PARTS_HTML, HOWTO_HTML, partPicture } from './info-copy.js';
import { renderBoard, layoutFor, towerAt, pipeAt, boardViewBox, VIEW_W, VIEW_H } from './board.js';
import { LEVELS, ContinuousRun, ModeBook, continuousRecordChange } from '../logic/modes.js';
import { resultCardDelay, STAGE_CUE_MS, STAGE_CUE_WAIT_MS, stageCueOpacity, playbackPlan, DEFAULT_RISE_MS } from './visual-timing.js';
import { createUpdateManager } from './update-manager.js';

const APP_VERSION = '0.18.0';
// v3：結果の間合いをグラスの和音の減衰に合わせて置き直した（2026-11-01）。初期値を新しい値にそろえるため、それまでの調整は引き継がない
const TIMING_KEY = 'aqua-notes.prototype-timing.v3';
// 結果の間合い（試作の仮の値）。秒数はグラスハープの余韻に合わせて試作で決める（要件NF-002・Q-04）。
// 前作 prism の間合いは「鐘の主な響きが引いてから（鐘は0.6秒で約6分の1）クリアのジングル0.7秒、NGのジングル1.5秒、
// カードはどちらも1.6秒」。鐘は打った瞬間が最大ですぐ引くが、グラスの和音は約1秒伸びてから引く。
// そこで、和音が約6分の1まで下がる1.4秒を前作の0.7秒にあたる点とし、前作の間隔をそのまま当てはめた：
// クリアのジングル1.4秒・カード2.3秒、NGのジングル2.2秒・カード2.3秒（和音の長さ2.6秒のとき。2026-11-01 発案者が選択）
const DEFAULT_TIMING = Object.freeze({ riseMs: DEFAULT_RISE_MS, chordMs: 2600, jingleMs: 1400, jingleNgMs: 2200, cardClearMs: 2300, cardNgMs: 2300, latencyMs: DEFAULT_LATENCY_MS, timbre: 'fm2' });
const TIMING_FIELDS = [
  ['latencyMs', '音の準備の余裕（音が途切れるときは大きく）', 0, 300, 10],
  ['riseMs', '水面が上がる時間', 400, 3000, 100],
  ['chordMs', '落ち着いた音の長さ（余韻を含む）', 800, 6000, 100],
  ['jingleMs', '落ち着いてからジングルまで（クリア）', 0, 4000, 100],
  ['jingleNgMs', '落ち着いてからジングルまで（NG）', 0, 4000, 100],
  ['cardClearMs', '落ち着いてから結果まで（クリア）', 0, 5000, 100],
  ['cardNgMs', '落ち着いてから結果まで（NG）', 0, 5000, 100]
];

// 連続プレイで進む面の数。要件どおり1〜30面（初期版の範囲）。31面以降（T-14）を入れるかは発案者が決める（2026-11-04）
const CONTINUOUS_STAGES = STAGES.filter(s => s.number <= 30).length;

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

const emptyConfig = () => ({ connected: new Set(), thickness: {}, primed: new Set(), pumped: new Set() });
const state = {
  stageIndex: 0,
  current: null, // 遊んでいる面（出題の数値を当てはめたもの）
  loadError: '', // 出題を出せない理由（C-04）
  config: emptyConfig(),
  selected: null,
  pumpNote: '', // ポンプで汲めなかった理由（選んでいるサイフォンの窓に出す）
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
  contStart: null, // 連続プレイを始めたときのレベルの記録（記録更新の判定に使う）
  contRecord: null, // 終わったときの記録の更新（continuousRecordChange）
  partIntro: null, // 表示中の新しいパーツの説明（PART_INTROS の1つ）
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
const bucketsLeft = () => (stage().buckets ?? 0) - [...state.config.primed].filter(id => state.config.connected.has(id) && !state.config.pumped.has(id)).length;
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
  // 同じ面の編集・実行・結果では、案内を読める高さを固定する。
  $('app').classList.toggle('with-guide', isPractice() || guiding());
  state.asking = null;
  state.prediction = null;
  state.trials = 0;
  state.contAction = null;
  state.newFewest = false;
  if (state.mode === 'select') lastSelectIndex = index;
  state.stageCueUntil = !state.titleOpen && !state.loadError ? performance.now() + STAGE_CUE_WAIT_MS + STAGE_CUE_MS : 0;
  renderAll();
  openPartIntro();
}

// 新しいパーツの初出説明（T-08）。そのパーツを初めて見る面で一度だけ、挿絵つきの窓を出す。
// 窓を出している間は開始の合図を止め、閉じてから700ms待って合図を始める（handoff-to-claude.md 4章）
function openPartIntro() {
  const intro = !state.titleOpen && !state.loadError ? partIntroFor(stage()) : null;
  if (!intro || tutorial.partSeen(intro.part)) return;
  state.partIntro = intro;
  state.stageCueUntil = 0;
  renderAll();
  openSheet(intro.title, `${partPicture(intro.part, intro.alt)}${intro.lines.map(line => `<p class="part-intro-text">${phraseMarkup(line)}</p>`).join('')}`,
    '<button type="button" class="primary" data-sheet="close">やってみる</button>');
  const sheet = $('sheet');
  sheet.classList.add('part-intro');
  sheet.querySelector('.sheet-card').insertAdjacentHTML('afterbegin', '<button type="button" class="close" data-sheet="close" aria-label="説明を閉じる">×</button>');
}
function finishPartIntro() {
  if (!state.partIntro) return;
  tutorial.seePart(state.partIntro.part);
  state.partIntro = null;
  $('sheet').classList.remove('part-intro');
  state.stageCueUntil = performance.now() + STAGE_CUE_WAIT_MS + STAGE_CUE_MS;
  renderAll();
}

// ---- 編集：配管をつなぐ・外す・太さ・呼び水（F-002、F-005、F-008） ----
function tapPipe(id) {
  const c = candidate(id);
  const cfg = state.config;
  audio.unlock();
  audio.cue(cfg.connected.has(id) ? 'tap' : 'wire'); // つなぐときは前作の結線と同じ2音、それ以外は操作音
  state.pumpNote = '';
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
  cfg.pumped.delete(id);
  delete cfg.thickness[id];
  state.selected = null;
}

// ---- 実行と再生 ----
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
  // 時間割りは上限5秒に収める（visual-timing.js の playbackPlan）
  const { towers, settle1, closeAt, closeMs, settleAt } = playbackPlan(st, first, gated, timing.riseMs);
  state.run = { start: performance.now(), towers, settle1, closeAt, closeMs, settleAt, gated, open: levelsOf(first), closed: levelsOf(last), timing, timers: [] };
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
          audio.glide(frequencyForLevel(a.level, scale), frequencyForLevel(b.level, scale), { duration: closeMs / 1000 });
        }
      }
    });
    later(settleAt, () => settleSound(last));
  }
  later(settleAt + (evaluation.outcome === 'ng' ? timing.jingleNgMs : timing.jingleMs), () => audio.jingle(evaluation.outcome));
  later(settleAt + resultCardDelay(evaluation.outcome, timing), showResult);
  renderAll();
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
    const cont = state.continuous;
    state.contAction = cont.record(ev.outcome);
    // 面をクリアするたびに保存し、途中で閉じても残す。更新の表示は終わったときに、始めた時点の記録と比べて出す
    if (ev.outcome !== 'ng') modeBook.offerContinuous(cont.level.id, cont.cleared);
    if (state.contAction === 'complete') modeBook.offerAllClear(cont.level.id, cont.ng);
    state.contRecord = state.contAction === 'gameover' || state.contAction === 'complete' ? continuousRecordChange(state.contStart, cont) : null;
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
    for (const s of state.evaluation.states) for (const id of s.broken) { state.config.primed.delete(id); state.config.pumped.delete(id); }
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
      const p = ease((elapsed - run.closeAt) / run.closeMs);
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
function boardAnimating(now = performance.now()) {
  if (state.titleOpen) return false;
  return state.phase !== 'edit' ||
    (!reducedMotionQuery.matches && practiceStep()?.target.startsWith('pipe:'));
}
function stageCueAnimating(now = performance.now()) {
  return !state.titleOpen && now < state.stageCueUntil;
}
function drawStageCue(now = performance.now()) {
  const opacity = stageCueOpacity(state.stageCueUntil, now, reducedMotionQuery.matches);
  $('cond').style.setProperty('--stage-cue', opacity.toFixed(3));
  $('board').style.setProperty('--stage-cue', opacity.toFixed(3));
}
function loop() {
  cancelAnimationFrame(frame);
  const tick = now => {
    // 条件の合図だけならSVGを作り直さない。光っている間も管のタップ先を保持する。
    drawStageCue(now);
    const moving = boardAnimating(now);
    if (moving && now - lastDraw >= 32) { lastDraw = now; drawBoard(); }
    if (moving || stageCueAnimating(now)) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

function drawBoard() {
  const now = performance.now();
  const viewBox = boardViewBox(state.layout, stage(), matchMedia('(orientation: portrait) and (max-width: 1023px)').matches);
  if ($('board').getAttribute('viewBox') !== viewBox) $('board').setAttribute('viewBox', viewBox);
  drawStageCue(now);
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
    startCue: 0, // 札の光はSVGを描き直さず、上のCSS変数で更新する。
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
  const goal = `毎秒 ${st.outlets.map(o => `<span class="nw">${o.label}に <b>${targetText(o.target)}</b></span>`).join('・')} 届ける`;
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
        <span class="name">${textMarkup(`${isPrac ? '' : `${st.number} `}${st.title}`)}</span><span class="sub">${textMarkup(sub)}</span>${mode === 'select' ? '<span class="caret" aria-hidden="true">∨</span>' : ''}</button>
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
  const cont = new ContinuousRun('beginner', CONTINUOUS_STAGES);
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
    const bucketBadge = stage().buckets ? `<span class="bucket-badge${left ? '' : ' empty'}" aria-label="桶の残り ${left}個（全部で${stage().buckets}個）">桶 残り <b>${left}</b> / ${stage().buckets}</span>` : '';
    parts.push(`<div class="chooser-head"><h3>サイフォン</h3>${bucketBadge}</div>`);
    parts.push(`<p class="chooser-note">${phraseMarkup(c.pump
      ? `壁を越える管は、|中に空気がたまっていて|流れません。|グラス${c.pump}の水位が|入口（高さ${c.siphon.inlet}）以上なら、|手押しポンプで|呼び水ができます。|ポンプは何度でも使えて、|桶は減りません。`
      : '壁を越える管は、|中に空気がたまっていて|流れません。|桶の水で満たす（呼び水）と|流れ始めます。')}</p>`);
  } else if (c.adjustable) {
    parts.push('<div class="chooser-head"><h3>太さを選ぶ</h3></div>');
    parts.push(`<p class="chooser-note">${phraseMarkup('太いほど水が流れやすく、|たくさん運びます。')}</p>`);
  }
  if (c.adjustable) {
    parts.push(`<div class="chooser-row"><span>太さ</span>${c.adjustable.map(t => `<button type="button" class="chip${cfg.thickness[c.id] === t ? ' on' : ''}" data-thick="${t}" aria-label="${THICK_NAME[t]} 数字${t}" aria-pressed="${cfg.thickness[c.id] === t}">${THICK_NAME[t]}<small class="chip-number">${t}</small></button>`).join('')}</div>`);
  }
  if (c.siphon) {
    const primed = cfg.primed.has(c.id);
    const bucketButton = stage().buckets
      ? `<button type="button" class="chip" data-prime="on" ${bucketsLeft() > 0 ? '' : 'disabled'}>桶で呼び水をする</button>${bucketsLeft() > 0 ? '' : '<span class="note-inline">桶が残っていません</span>'}`
      : '';
    // ポンプ（F-007）：押したときに、今のつなぎ方で落ち着いた水位を計算して汲めるか決める（2026-11-04 発案者が選択）
    const pumpButton = c.pump ? '<button type="button" class="chip" data-pump="on">ポンプで呼び水をする</button>' : '';
    parts.push(`<div class="chooser-row">${primed
      ? `<button type="button" class="chip on" data-prime="off">呼び水を取り消す${c.pump ? (cfg.pumped.has(c.id) ? '（ポンプ）' : '（桶）') : ''}</button>`
      : pumpButton + bucketButton}</div>`);
    if (!primed && state.pumpNote) parts.push(`<p class="chooser-note pump-note" role="status">${phraseMarkup(state.pumpNote)}</p>`);
  }
  return `<div class="chooser">${parts.join('')}<div class="chooser-row chooser-actions"><button type="button" class="chip" data-remove="1">この配管を外す</button><button type="button" class="chip" data-close="1">閉じる</button></div></div>`;
}

// かっこ書き（前に付く数値ごと）を1かたまりにして、途中で折り返さない。
// 文の折り返しは CSS の word-break: auto-phrase で文節ごとにするが、対応していないブラウザでもかっこは崩さない
function keepTogether(text) {
  return textMarkup(text);
}

function outletsHtml(st, outlets) {
  return outlets.map(o => {
    const label = st.outlets.find(x => x.id === o.id).label;
    return deliveryMarkup(label, o);
  }).join('');
}

function renderPanel() {
  const panel = $('panel');
  const st = stage();
  $('pipe-key').classList.toggle('legend-guide', practiceStep()?.target === 'badges');
  $('board-aux').replaceChildren();
  if (state.phase === 'edit') {
    const n = state.config.connected.size;
    panel.innerHTML = `
      ${state.loadError ? `<p class="warn" role="alert">${textMarkup(state.loadError)}</p>` : practiceStep() ? `<p class="hint guide">${guideMessage(practiceStep().text)}</p>` : guiding() ? `<p class="hint guide">${guideMessage(lessonFor(st).intro)}</p>` : `<p class="hint">${textMarkup(st.hint)}</p>`}
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
      <p class="hint running">${textMarkup(state.run?.gated ? '水が流れています。落ち着いたら水門を閉じます…' : '水が流れています…')}</p>
      <div class="actions"><button type="button" class="ghost" id="stop">停止</button></div>`;
    return;
  }
  const ev = state.evaluation;
  const gated = ev.states.length > 1;
  const head = ev.outcome === 'perfect' ? '100点' : ev.outcome === 'clear' ? 'クリア' : 'NG';
  const outlets = gated
    ? ev.states.map(s => `<li class="state-head">${textMarkup(stateTitle[s.name])}</li>${outletsHtml(st, s.outlets)}`).join('')
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
          <h4>毎秒の量 ＝ 高さの差 ÷ 管の数字</h4><ul class="calc">${li(e.steps)}</ul>
          ${e.balances.length ? `<h4>グラスでは、毎秒入る量 ＝ 毎秒出る量</h4><ul class="calc">${li(e.balances)}</ul>` : ''}
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
  const modeCopy = state.mode === 'select' && ev.outcome !== 'ng' && !isPractice()
    ? `試行 ${state.trials} 回（この面の最少 ${modeBook.fewest(stage().id) ?? state.trials} 回）`
    : state.mode === 'continuous' && cont
      ? finished ? ''
      : cont.level.limit === null ? `連続プレイ（${cont.level.name}）：${cont.cleared} 面クリア・NG ${cont.ng} 回`
      : `連続プレイ（${cont.level.name}）：${cont.cleared} 面クリア・NG 残り ${cont.left} 回`
      : '';
  // 連続プレイの終わり：GAME OVER／ALL CLEAR の見出しと、クリアした面数・記録の更新（2026-11-03 発案者）
  const crown = '<svg viewBox="0 0 20 15" width="16" height="12" aria-hidden="true"><path d="M2 12 L1 3 6 6 10 0 14 6 19 3 18 12 Z M2 14 H18" fill="currentColor"/></svg>';
  const rec = finished ? state.contRecord : null;
  const allClearText = ng => (ng === null ? '' : `（NG ${ng} 回）`);
  const recordText = !finished ? ''
    : rec ? (rec.from === null ? `初めての記録 ${rec.to} 面${allClearText(rec.toNg)}` : `前回の最高 ${rec.from} 面${allClearText(rec.fromNg)} → ${rec.to} 面${allClearText(rec.toNg)}`)
    : `${cont.level.name}の最高 ${modeBook.bestContinuous(cont.level.id) ?? 0} 面${allClearText(modeBook.allClearNg(cont.level.id))}`;
  const contSummary = finished ? `<div class="cont-summary">
        <p class="cont-count">${phraseMarkup(`${cont.level.name}|${cont.cleared} / ${cont.stageCount} 面クリア`)}</p>
        ${act === 'complete' ? `<p class="cont-sub">${textMarkup(`NG ${cont.ng} 回・${cont.stageCount}面は ${displayScore(ev.score).replace(/\.00$/, '')} 点`)}</p>` : ''}
        ${rec ? `<span class="newbest">${crown} 記録更新</span>` : ''}
        <p class="cont-record">${textMarkup(recordText)}</p>
      </div>` : '';
  // 連続プレイの終わりは、見出しの「結果」を GAME OVER／ALL CLEAR に書き換え、大きな点数・NGの字は出さない（2026-11-03 発案者）
  const hero = ev.outcome === 'ng' ? '<span class="result-ng-word">NG</span>' : `${displayScore(ev.score).replace(/\.00$/, '')}<small>点</small>`;
  const modeLine = textMarkup(modeCopy) + (state.mode === 'select' && state.newFewest ? '<span class="newbest">最少</span>' : '');
  // 結果は下の欄に重ねるトーストで出し、下の欄は編集中と同じ高さ（案内＋ボタン1行）に保つ。
  // 欄が伸びると盤面が縮むため（2026-11-01 発案者）。閉じたトーストは「結果」で開き直す
  panel.innerHTML = `
    <p class="hint">${textMarkup(`グラスを${swipeVerb}と、そのグラスの音を聞き直せます。`)}</p>
    <div class="actions">
      <button type="button" class="ghost" id="show-result" aria-expanded="${!state.resultClosed}">結果</button>
      ${retryButton}
      ${nextButton}
    </div>`;
  state.resultHtml = `
    <div class="result ${ev.outcome}">
      <div class="result-head">
        <span class="badge" role="status">${finished ? (act === 'gameover' ? 'GAME OVER' : 'ALL CLEAR') : `結果${ev.outcome === 'ng' ? '' : `<small>${ev.outcome === 'perfect' ? 'PERFECT' : head}</small>`}`}</span>
        <button type="button" class="close" id="result-close" aria-label="結果を閉じる">×</button>
        ${finished ? '' : `<div class="result-hero">
          ${ev.outcome === 'perfect' ? '<svg class="laurels" viewBox="0 0 200 76" aria-hidden="true"><defs><g id="laurel"><path d="M48 68 Q17 50 29 12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M29 15 Q15 3 25 0 Q34 2 29 15 M26 28 Q8 20 13 12 Q24 11 26 28 M28 41 Q8 39 10 28 Q23 26 28 41 M35 54 Q13 58 12 46 Q24 39 35 54 M48 66 Q24 74 23 62 Q35 53 48 66 M29 18 Q46 6 42 21 Q37 29 29 30 M28 33 Q46 22 44 35 Q40 43 31 44 M34 48 Q51 38 50 51 Q46 59 40 59" fill="currentColor"/></g></defs><use href="#laurel"/><use href="#laurel" transform="translate(200 0) scale(-1 1)"/></svg>' : ''}
          <span class="score">${hero}</span>
        </div>`}
        ${state.newBest ? '<span class="newbest"><svg viewBox="0 0 20 15" width="16" height="12" aria-hidden="true"><path d="M2 12 L1 3 6 6 10 0 14 6 19 3 18 12 Z M2 14 H18" fill="currentColor"/></svg> 最高点</span>' : ''}
        <span class="used">${textMarkup(usedText)}</span>
      </div>
      ${isPractice() ? `<p class="guide-answer">${guideMessage(practiceResultText(ev.outcome))}</p>` : ''}
      ${state.prediction ? `<p class="guide-answer">${guideMessage(answerLine(state.prediction.question, state.prediction.picked))}</p>` : ''}
      ${contSummary}
      ${modeLine ? `<p class="mode-line">${modeLine}</p>` : ''}
      ${state.saveMessage ? `<p class="warn">${textMarkup(state.saveMessage)}</p>` : ''}
      <div class="result-metrics"><ul class="outlets">${outlets}</ul><div class="minimum"><span>満点の本数</span><b>${state.analysis.perfectCount}<small>本</small></b>${st.theme === 'buckets' ? `<span>桶 ${state.analysis.perfectBuckets}</span>` : ''}</div></div>
      <p class="swipe-note">${textMarkup(`グラスを${swipeVerb}と、そのグラスの音を聞き直せます。`)}</p>
      ${explainHtml}
      <details id="detail" ${state.details ? 'open' : ''}><summary>くわしい記録${gated ? '（水門を閉じたとき）' : ''}</summary>
        <div class="table-wrap"><table><thead><tr><th>グラス</th><th>水位</th><th>目盛り</th><th>毎秒の出入り</th></tr></thead><tbody>${towerRows}</tbody></table></div>
        <div class="table-wrap"><table><thead><tr><th>配管</th><th>毎秒の量</th><th>水位の差</th><th>管の数字</th></tr></thead><tbody>${pipeRows}</tbody></table></div>
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
    <p class="chooser-note">${textMarkup(q.text)}<br>${textMarkup('選んでから水が流れます。')}</p>
    <div class="chooser-row">${q.choices.map(c => `<button type="button" class="chip" data-predict="${c.value}">毎秒${textMarkup(c.text)} 届く</button>`).join('')}</div>
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
  updates?.refreshControls();
  if (boardAnimating() || stageCueAnimating()) loop();
  else cancelAnimationFrame(frame);
}

// ---- 調整用の設定（試作） ----
function openTuning() {
  const sheet = $('sheet');
  const v = state.timing;
  sheet.innerHTML = `
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="tune-title">
      <h2 id="tune-title">タイミングの調整（試作用）</h2>
      <p class="note">${phraseMarkup('グラスハープの余韻に合わせて|決めるための仮の設定です。|この端末にだけ保存し、|次に水を流したときから使います。|100点では、|虹を見せてから結果を出す時間を|優先します。')}</p>
      <form id="tune-form">
        ${TIMING_FIELDS.map(([key, label, min, max, step]) => `
          <label class="field" for="tune-${key}"><span>${textMarkup(label)}</span>
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
    $('tune-status').innerHTML = saveTiming(next) ? phraseMarkup('保存しました。|次に水を流したときから使います。') : phraseMarkup('この端末には保存できませんでした。|開いている間だけ使います。');
  });
  $('tune-reset').addEventListener('click', () => {
    state.timing = { ...DEFAULT_TIMING };
    saveTiming(state.timing);
    audio.setLatency(state.timing.latencyMs);
    audio.timbre = state.timing.timbre;
    openTuning();
    $('tune-status').innerHTML = textMarkup('初期値に戻しました。');
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
    if (e.target.closest('#review') && state.phase === 'edit') { state.review = true; $('app').classList.add('with-guide'); renderAll(); }
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
    else if (btn.dataset.prime === 'off') { state.config.primed.delete(state.selected); state.config.pumped.delete(state.selected); }
    else if (btn.dataset.pump) {
      const r = pumpCheck(stage(), state.config, state.selected);
      if (!r.ok) {
        // 汲めないときは窓を開いたまま理由を出す（流していないので、連続プレイのNGにも数えない）
        state.pumpNote = r.level === null
          ? `今のつなぎ方では、|グラス${r.tower}に水が来ません。|先にグラス${r.tower}へ水を入れましょう。`
          : `今のつなぎ方では、|グラス${r.tower}の水位が${fmt(r.level)}で、|入口の高さ${r.inlet.toString()}に届きません。|先に水位を上げましょう。`;
        renderAll();
        return;
      }
      state.config.primed.add(state.selected);
      state.config.pumped.add(state.selected);
    }
    else if (btn.dataset.remove) removePipe(state.selected);
    else if (!btn.dataset.close) return;
    state.selected = null;
    state.pumpNote = '';
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
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (state.partIntro && !$('sheet').hidden) closeSheet();
    else closeResult();
  });
  reducedMotionQuery.addEventListener('change', () => {
    drawBoard();
    if (boardAnimating() || stageCueAnimating()) loop();
    else cancelAnimationFrame(frame);
  });
  let layoutFrame = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      // 高さだけの変更でもPCの詰め方が変わるので、条件を測り直す。
      fitConditionHeight();
      renderPanel();
      drawBoard();
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
  $('title-message').innerHTML = textMarkup(message);
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
  state.continuous = mode === 'continuous' ? new ContinuousRun(level, CONTINUOUS_STAGES) : null;
  if (state.continuous) state.contStart = { best: modeBook.bestContinuous(level), allClearNg: modeBook.allClearNg(level) };
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
    <h2 id="sheet-title">${textMarkup(title)}</h2>${body}<div class="actions">${actions}</div></div>`;
  sheet.hidden = false;
}
function closeSheet() { $('sheet').hidden = true; finishPartIntro(); }

function openMenu() {
  openSheet('メニュー', `<div class="menu-grid">
    <button type="button" class="ghost" data-sheet="title">タイトルへ</button>
    <button type="button" class="ghost" data-sheet="records">記録</button>
    <button type="button" class="ghost" data-sheet="parts">パーツの説明</button>
    <button type="button" class="ghost" data-sheet="howto">遊び方と概要</button>
    <button type="button" class="ghost" data-sheet="update-check">更新を確認</button>
    <button type="button" class="ghost" data-sheet="tune">調整（試作用）</button>
  </div>`);
}

function openRecords() {
  const rows = [PRACTICE, ...STAGES].map(s => {
    const best = bestOfStage(s);
    const few = modeBook.fewest(s.id);
    return `<tr><td>${s.id === PRACTICE.id ? '練習' : s.number}</td><td>${s.title}</td><td>${best ? `${displayScore(best)} 点` : '―'}</td><td>${few ? `${few} 回` : '―'}</td></tr>`;
  }).join('');
  const cont = LEVELS.map(l => `<li>${phraseMarkup(`${l.name}（${l.note}）：|${modeBook.bestContinuous(l.id) === null ? 'まだ記録がありません' : `最高 ${modeBook.bestContinuous(l.id)} 面クリア`}`)}</li>`).join('');
  openSheet('記録', `<h3 class="sheet-sub">連続プレイ</h3><ul class="plain">${cont}</ul>
    <h3 class="sheet-sub">${phraseMarkup('面ごと|（最高点・|クリアまでの最少の試行回数）')}</h3>
    <div class="table-wrap"><table><thead><tr><th>面</th><th>名前</th><th>最高点</th><th>最少試行</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

function openLevels() {
  const items = LEVELS.map(l => {
    const best = modeBook.bestContinuous(l.id);
    return `<button type="button" class="ghost level" data-level="${l.id}"><b>${l.name}</b><span>${l.note}${best === null ? '' : `・最高 ${best} 面`}</span></button>`;
  }).join('');
  openSheet('連続プレイ', `<p class="note">${phraseMarkup('お試し1面から30面まで|順に進みます。|クリアできなかった回（NG）が|上限を超えるとゲームオーバー。|部分点のクリアでも次へ進めます。')}</p><div class="level-list">${items}</div>`,
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

// 手動確認はメニューから。上下の更新ボタンは、準備済みの新しい版を適用する（F-022）。
async function checkUpdate() {
  const show = message => {
    if (state.titleOpen) renderTitle(message);
    else openSheet('更新の確認', `<p>${textMarkup(message)}</p>`);
  };
  try {
    if (!updates) { show('この画面では更新を確かめられません（開発用の画面です）。'); return; }
    show('更新を確認しています。');
    const info = await updates.check();
    show(updateMessage(info));
  } catch {
    show('更新を確かめられませんでした。通信できる場所でもう一度お試しください。');
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
    else if (k === 'resume') { closeTitle(); openPartIntro(); }
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
    else if (k === 'update-check') checkUpdate();
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
let updates = null;
function updateMessage(info) {
  return info?.status === 'ready' ? '新しい版を使えます。「更新する」を押してください。'
    : info?.status === 'checking' ? '更新を確認中です。準備ができると更新の案内を表示します。'
    : info?.status === 'unavailable' ? '更新を確かめられませんでした。時間を置いてもう一度お試しください。'
    : `いまの版 v${APP_VERSION} が最新です。`;
}
function syncUpdateUI(info = updates?.state) {
  const ready = info?.status === 'ready';
  const titleButton = document.querySelector('[data-title="update"]');
  $('update-notice').hidden = !ready;
  titleButton.hidden = !ready;
  $('update-apply').disabled = titleButton.disabled = state.phase === 'running';
  const sheet = $('sheet');
  if (sheet && !sheet.hidden && sheet.querySelector('#sheet-title')?.textContent === '更新の確認') {
    const copy = sheet.querySelector('.sheet-card > p');
    if (copy) copy.innerHTML = textMarkup(updateMessage(info));
  }
}
function setupOffline() {
  syncUpdateUI();
  if (!document.querySelector('meta[name="aqua-offline"]') || !('serviceWorker' in navigator)) return;
  updates = createUpdateManager({
    serviceWorker: navigator.serviceWorker, currentVersion: APP_VERSION,
    onChange: syncUpdateUI, canApply: () => state.phase !== 'running',
    reload: () => location.reload()
  });
  $('update-apply').onclick = document.querySelector('[data-title="update"]').onclick = () => updates.apply();
  updates.start().catch(() => { /* 登録できない環境では、通信ありでそのまま遊べる */ });
}

bind();
// 起動はタイトル画面から（前作と同じ）。初めての人には「チュートリアル」を目立たせる
selectStage(0);
renderTitle();
// 書体の読み込みで文字の幅が変わるので、読み込み後にも測り直す
document.fonts?.ready.then(() => { fitConditionHeight(); renderResultToast(); });
setupOffline();
