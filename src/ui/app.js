// 試作の画面のまとめ役：編集中 → 実行中 → 結果表示中 → 停止で編集中（要件5.3）
import { STAGES } from '../content/stages.js';
import { analyzeStage, evaluate } from '../logic/play.js';
import { onScale, tickSide, tickDistance, frequencyForLevel, DEFAULT_SCALE } from '../logic/pitch.js';
import { displayScore } from '../logic/score.js';
import { explain, formatAmount } from '../logic/explain.js';
import { GlassAudio, DEFAULT_LATENCY_MS, TIMBRES } from './audio.js';
import { renderBoard, layoutFor, towerAt, VIEW_W, VIEW_H } from './board.js';

const APP_VERSION = '0.3.0';
const TIMING_KEY = 'aqua-notes.prototype-timing.v1';
// 結果の間合い（試作の仮の値）。秒数はグラスハープの余韻に合わせて試作で決める（要件NF-002・Q-04）
const DEFAULT_TIMING = Object.freeze({ riseMs: 1300, chordMs: 2600, jingleMs: 1000, cardClearMs: 1800, cardNgMs: 1800, semitones: 5, latencyMs: DEFAULT_LATENCY_MS, timbre: 'fm2' });
const TIMING_FIELDS = [
  ['latencyMs', '音の準備の余裕（音が途切れるときは大きく）', 0, 300, 10],
  ['riseMs', '水面が上がる時間', 400, 3000, 100],
  ['chordMs', '落ち着いた音の長さ（余韻を含む）', 800, 6000, 100],
  ['jingleMs', '落ち着いてからジングルまで', 0, 4000, 100],
  ['cardClearMs', '落ち着いてから結果まで（クリア）', 0, 5000, 100],
  ['cardNgMs', '落ち着いてから結果まで（NG）', 0, 5000, 100],
  ['semitones', '1目盛りあたりの半音の数', 1, 7, 1]
];

const $ = id => document.getElementById(id);
const audio = new GlassAudio();
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

const state = {
  stageIndex: 0,
  connected: new Set(),
  phase: 'edit',
  analysis: null,
  layout: null,
  evaluation: null,
  run: null,
  prevLevels: new Map(),
  best: new Map(),
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

function selectStage(index) {
  stopRun();
  state.stageIndex = index;
  state.connected = new Set();
  state.prevLevels = new Map();
  state.analysis = analyzeStage(stage());
  state.layout = layoutFor(stage());
  state.evaluation = null;
  state.details = false;
  state.explain = false;
  renderAll();
}

// ---- 実行と再生 ----
function hopDistances(st, connected) {
  const dist = new Map([[st.spring.id, 0]]);
  const queue = [st.spring.id];
  while (queue.length) {
    const here = queue.shift();
    for (const c of st.candidates) {
      if (!connected.has(c.id)) continue;
      const next = c.a === here ? c.b : c.b === here ? c.a : null;
      if (next && !dist.has(next)) { dist.set(next, dist.get(here) + 1); queue.push(next); }
    }
  }
  return dist;
}

function startRun() {
  audio.unlock();
  const st = stage();
  const timing = { ...state.timing };
  const evaluation = evaluate(st, [...state.connected], state.analysis, { ...DEFAULT_SCALE, semitonesPerStep: timing.semitones });
  state.evaluation = evaluation;
  const hops = hopDistances(st, state.connected);
  const towers = st.towers.map(t => {
    const r = evaluation.result.towers[t.id];
    const delay = r.state === 'water' ? (hops.get(t.id) - 1) * 420 : 0;
    return { id: t.id, delay, duration: timing.riseMs, target: r.state === 'water' ? r.level.toNumber() : null };
  });
  const settleAt = Math.max(500, ...towers.filter(t => t.target !== null).map(t => t.delay + t.duration));
  state.run = { start: performance.now(), towers, settleAt, timing, timers: [], settled: false, flowStarted: new Set() };
  state.phase = 'running';

  const scale = { ...DEFAULT_SCALE, semitonesPerStep: timing.semitones };
  const top = frequencyForLevel(0, scale);
  const t0 = audio.now;
  for (const t of towers) {
    if (t.target === null) continue;
    audio.glide(top, frequencyForLevel(evaluation.result.towers[t.id].level, scale), { at: t0 + t.delay / 1000, duration: t.duration / 1000 });
  }
  const later = (ms, fn) => state.run.timers.push(setTimeout(fn, ms));
  later(settleAt, () => {
    state.run.settled = true;
    // 同じ高さの塔は1つの音として鳴らす（重ねると音量だけが増えるため）
    const levels = [...new Set(st.towers.map(t => evaluation.result.towers[t.id]).filter(r => r.state === 'water').map(r => r.level.toString()))];
    const freqs = levels.map(l => frequencyForLevel(l, scale));
    if (freqs.length) audio.chord(freqs, { length: timing.chordMs / 1000 });
  });
  if (evaluation.outcome !== 'ng') later(settleAt + timing.jingleMs, () => audio.jingle(evaluation.outcome));
  later(settleAt + (evaluation.outcome === 'ng' ? timing.cardNgMs : timing.cardClearMs), showResult);
  for (const o of st.outlets) later(Math.min(settleAt, 600), () => state.run?.flowStarted.add(o.id));
  renderAll();
  loop();
}

function showResult() {
  if (!state.run) return;
  state.phase = 'result';
  const ev = state.evaluation;
  if (ev.outcome !== 'ng') {
    const prev = state.best.get(stage().id);
    if (!prev || ev.score.cmp(prev) > 0) state.best.set(stage().id, ev.score);
  }
  renderAll();
}

function stopRun() {
  if (state.run) {
    for (const id of state.run.timers) clearTimeout(id);
    if (state.evaluation) {
      state.prevLevels = new Map(Object.entries(state.evaluation.result.towers).map(([id, t]) => [id, t.level ? t.level.toNumber() : null]));
    }
  }
  audio.stopAll();
  state.run = null;
  state.phase = 'edit';
  state.details = false;
  state.explain = false;
}

function currentLevels(now) {
  const levels = new Map();
  for (const t of stage().towers) levels.set(t.id, null);
  if (!state.run) return levels;
  const elapsed = now - state.run.start;
  for (const t of state.run.towers) {
    if (t.target === null) continue;
    const p = Math.max(0, Math.min(1, (elapsed - t.delay) / t.duration));
    const eased = 1 - (1 - p) ** 3;
    levels.set(t.id, state.run.settled ? t.target : t.target * eased);
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
  renderBoard($('board'), {
    stage: stage(),
    layout: state.layout,
    connected: state.connected,
    phase: state.phase,
    levels: currentLevels(now),
    settled: !!state.run?.settled,
    evaluation: state.phase === 'edit' ? null : state.evaluation,
    prevLevels: state.prevLevels,
    time: now,
    reducedMotion: reducedMotionQuery.matches,
    highlight: state.highlight,
    flowStarted: state.run?.flowStarted,
    onScale: level => onScale(level, scale),
    tickDistance: level => tickDistance(level, scale)
  });
}

function renderTabs() {
  $('stage-tabs').innerHTML = STAGES.map((s, i) => {
    const best = state.best.get(s.id);
    const mark = best ? (displayScore(best) === '100.00' ? '★' : '●') : '';
    return `<button type="button" class="tab${i === state.stageIndex ? ' current' : ''}" data-stage="${i}" aria-label="お試し${s.number}${best ? ` 最高${displayScore(best)}点` : ''}" ${state.phase === 'running' ? 'disabled' : ''}>${s.number}<span class="mark">${mark}</span></button>`;
  }).join('');
}

function renderCondition() {
  const st = stage();
  const targets = st.outlets.map(o => `<span class="target"><span class="dot"></span>${o.label}に <b>${o.target}</b></span>`).join('');
  $('cond').innerHTML = `
    <div class="cond-title"><span class="eyebrow">お試し ${st.number}</span><span class="name">${st.title}</span></div>
    <div class="cond-row">${targets}<span class="count">つないだ水路 <b>${state.connected.size}</b> 本</span></div>`;
}

const fmt = formatAmount;
const verdictText = { exact: 'ちょうど', short: '足りない', over: '多い' };
const sideText = { on: '目盛りに乗っている', above: '目盛りより少し上', below: '目盛りより少し下' };

function renderPanel() {
  const panel = $('panel');
  const st = stage();
  if (state.phase === 'edit') {
    panel.innerHTML = `
      <p class="hint">${st.hint}</p>
      <div class="actions">
        <button type="button" class="ghost" id="clear-wires" ${state.connected.size ? '' : 'disabled'}>配線クリア</button>
        <button type="button" class="primary" id="run" ${state.connected.size ? '' : 'disabled'}>水を流す</button>
      </div>`;
    return;
  }
  if (state.phase === 'running') {
    panel.innerHTML = `
      <p class="hint running">水が流れています…</p>
      <div class="actions"><button type="button" class="ghost" id="stop">停止</button></div>`;
    return;
  }
  const ev = state.evaluation;
  const head = ev.outcome === 'perfect' ? '100点' : ev.outcome === 'clear' ? 'クリア' : 'NG';
  const outlets = ev.outlets.map(o => {
    const label = st.outlets.find(x => x.id === o.id).label;
    return `<li class="${o.verdict}"><span>${label}</span><span class="v">${verdictText[o.verdict]}</span><span class="amount">届いた <b>${fmt(o.flow)}</b>・指定 ${o.target}</span></li>`;
  }).join('');
  const scale = scaleNow();
  const towerRows = st.towers.map(t => {
    const r = ev.result.towers[t.id];
    if (r.state === 'empty') return `<tr><td>塔${t.id}</td><td colspan="3">空（泉につながっていない）</td></tr>`;
    return `<tr><td>塔${t.id}</td><td>${fmt(r.level)}</td><td>${sideText[tickSide(r.level, scale)]}</td><td>入る ${fmt(r.inflow)} ／ 出る ${fmt(r.outflow)}</td></tr>`;
  }).join('');
  const pipeRows = st.candidates.filter(c => state.connected.has(c.id)).map(c => {
    const p = ev.result.pipes[c.id];
    return `<tr><td>${c.a}–${c.b}</td><td>${fmt(p.flow)}</td><td>${fmt(p.diff)}</td><td>${c.thinness}</td></tr>`;
  }).join('');
  const swipeVerb = coarsePointer ? '指でなぞる' : 'マウスでなぞる';
  const li = items => items.map(t => `<li>${t}</li>`).join('');
  let explainHtml = '';
  if (state.explain) {
    const e = explain(st, [...state.connected], ev, state.analysis, scale);
    const adviceTitle = ev.outcome === 'ng' ? '見直すところ' : ev.outcome === 'clear' ? '100点をめざすには' : '';
    explainHtml = `
      <section class="explain" aria-labelledby="explain-title">
        <h3 id="explain-title">${e.summary}</h3>
        ${e.advice.length ? `${adviceTitle ? `<h4>${adviceTitle}</h4>` : ''}<ul>${li(e.advice)}</ul>` : ''}
        <details><summary>計算を見る</summary>
          <h4>流れる量 ＝ 高さの差 ÷ 細さ</h4><ul class="calc">${li(e.steps)}</ul>
          ${e.balances.length ? `<h4>塔では、入る量 ＝ 出る量</h4><ul class="calc">${li(e.balances)}</ul>` : ''}
        </details>
      </section>`;
  }
  panel.innerHTML = `
    <div class="result ${ev.outcome}" role="status">
      <div class="result-head"><span class="badge">${head}</span><span class="score">${ev.outcome === 'ng' ? '' : `${displayScore(ev.score)} 点`}</span>
        <span class="used">水路 ${ev.used} 本${ev.outcome === 'clear' ? `（満点は ${state.analysis.perfectCount} 本）` : ''}</span></div>
      <ul class="outlets">${outlets}</ul>
      <p class="swipe">塔を${swipeVerb}と、その塔の音を聞き直せます。</p>
      ${explainHtml}
      <details id="detail" ${state.details ? 'open' : ''}><summary>くわしい記録</summary>
        <div class="table-wrap"><table><thead><tr><th>塔</th><th>水位</th><th>目盛り</th><th>流れ</th></tr></thead><tbody>${towerRows}</tbody></table></div>
        <div class="table-wrap"><table><thead><tr><th>水路</th><th>流れる量</th><th>水位の差</th><th>細さ</th></tr></thead><tbody>${pipeRows}</tbody></table></div>
      </details>
    </div>
    <div class="actions">
      <button type="button" class="ghost" id="explain" aria-expanded="${state.explain}">${state.explain ? '解説を閉じる' : '解説'}</button>
      <button type="button" class="ghost" id="stop">停止してつなぎ直す</button>
      ${ev.outcome !== 'ng' && state.stageIndex < STAGES.length - 1 ? '<button type="button" class="primary" id="next">次の面へ</button>' : ''}
    </div>`;
}

function renderAll() {
  renderTabs();
  renderCondition();
  renderPanel();
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
    state.timing = next;
    next.timbre = form.elements.timbre.value;
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
  // 保存せずに、選んだ音色で2つの塔の和音と単音を鳴らして比べる
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
  const r = state.evaluation.result.towers[id];
  state.highlight = { id, until: performance.now() + 450 };
  if (r.state !== 'water') return;
  audio.unlock();
  audio.tone(frequencyForLevel(r.level, scaleNow()), { gain: 0.2, attack: 0.08, hold: 0.35, release: 1.8 });
}

function bind() {
  document.addEventListener('pointerdown', () => audio.unlock(), { once: true });
  $('stage-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-stage]');
    if (b && !b.disabled) selectStage(Number(b.dataset.stage));
  });
  $('panel').addEventListener('click', e => {
    const id = e.target.closest('button')?.id;
    if (id === 'run') startRun();
    else if (id === 'stop') { stopRun(); renderAll(); }
    else if (id === 'clear-wires') { state.connected.clear(); renderAll(); }
    else if (id === 'next') selectStage(state.stageIndex + 1);
    else if (id === 'explain') {
      state.explain = !state.explain;
      renderPanel();
      if (state.explain) document.querySelector('.explain')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  $('panel').addEventListener('toggle', e => { if (e.target.id === 'detail') state.details = e.target.open; }, true);
  const svg = $('board');
  svg.addEventListener('click', e => {
    if (state.phase !== 'edit') return;
    const pipe = e.target.closest('[data-pipe]')?.dataset.pipe;
    if (!pipe) return;
    if (state.connected.has(pipe)) state.connected.delete(pipe); else state.connected.add(pipe);
    renderAll();
  });
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
    $('sound').textContent = audio.muted ? '音 オフ' : '音 オン';
    $('sound').setAttribute('aria-pressed', String(!audio.muted));
  });
  $('tune').addEventListener('click', openTuning);
  $('version').textContent = `v${APP_VERSION}`;
  $('board').setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
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
