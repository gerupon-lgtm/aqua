// グラスハープ風の音（試作）。Web Audio だけで作る。
// 音色・余韻の長さは試作で詰める（要件Q-04）。停止・消音・面の切り替えのときだけ音を止め、
// 自動で進むときは余韻を途中で切らない（要件NF-002）。

// 音切れ対策は前作に合わせる：音声出力へ準備の余裕（latencyHint）を初期値30ミリ秒で要求し、調整できるようにする
// （前作 prism 0.63.0 の点検記録 audio-default-30ms）。残響は短い1チャンネルにして処理を軽くする。
export const DEFAULT_LATENCY_MS = 30;

// 音色。glass は正弦波を重ねる加算合成（今の音）、fm1・fm2 は比較用のFM合成
// ratio：変調波の高さの倍率、peak・rest：立ち上がりと余韻での変調の深さ（基本の高さに対する比）
export const TIMBRES = [
  ['glass', '加算合成'],
  ['fm1', 'FM合成（倍率1：明るい）'],
  ['fm2', 'FM合成（倍率2：うつろ）初期値']
];
const FM_TIMBRES = {
  fm1: { ratio: 1, peak: 0.9, rest: 0.12 },
  fm2: { ratio: 2, peak: 0.7, rest: 0.08 }
};

// 操作音。押したことが分かる仕組み（ボタンは1音、配管をつなぐと2音、グラスの音の間は鳴らさない）は前作 prism に合わせ、
// 音そのものはこの作品に合わせて柔らかくする（2026-11-01 発案者）：正弦波の水滴のような短い音で、少し下から音程が上がり、
// 軽く残響を通す。行は [MIDI, 開始の秒, 音量]
const UI_DECAY = 0.22;
const UI_CUES = {
  tap: [[84, 0, 0.05]],
  wire: [[84, 0, 0.045], [91, 0.075, 0.05]]
};

export class GlassAudio {
  constructor({ latencyMs = DEFAULT_LATENCY_MS } = {}) {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.voices = new Set();
    this.latencyMs = latencyMs;
    this.timbre = 'fm2';
    this.towerUntil = 0; // グラスの音（水面・和音・なぞり）が鳴り終わる時刻。それまで操作音は鳴らさない（前作の鐘と同じ扱い）
    this.uiVoices = new Set();
  }

  // 準備の余裕を変えるときは、鳴っている音を止めて出力を作り直す（次の操作で準備する）
  setLatency(ms) {
    if (ms === this.latencyMs) return;
    this.latencyMs = ms;
    if (!this.ctx) return;
    this.stopAll();
    const old = this.ctx;
    this.ctx = null;
    old.close().catch(() => {});
  }

  // スマホは操作の中でしか音を始められないので、最初のタップで準備する
  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      try { this.ctx = new Ctx({ latencyHint: this.latencyMs / 1000 }); }
      catch { this.ctx = new Ctx(); }
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 3;
      const dry = this.ctx.createGain();
      dry.gain.value = 0.8;
      const wet = this.ctx.createGain();
      wet.gain.value = 0.35;
      const reverb = this.ctx.createConvolver();
      reverb.buffer = this.#impulse(1.4);
      this.bus = this.ctx.createGain();
      this.bus.connect(dry).connect(comp);
      this.bus.connect(reverb).connect(wet).connect(comp);
      comp.connect(this.master).connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  get now() { return this.ctx ? this.ctx.currentTime : 0; }

  setMuted(muted) {
    this.muted = muted;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(muted ? 0 : 0.9, t, 0.03);
    if (muted) this.stopAll();
  }

  #impulse(seconds) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = this.ctx.createBuffer(1, length, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * 0.6 * (1 - i / length) ** 3.2;
    return buffer;
  }

  // 1つの音。ガラスの縁をこする音に寄せて、柔らかい立ち上がりと長い余韻にする
  tone(freq, { at = this.now, gain = 0.16, attack = 0.09, hold = 0.6, release = 2.2 } = {}) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(gain, at + attack);
    env.gain.setValueAtTime(gain, at + attack + hold);
    env.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
    env.connect(this.bus);
    const end = at + attack + hold + release + 0.05;
    const fm = FM_TIMBRES[this.timbre];
    if (fm) {
      this.#fmVoice(freq, fm, env, { at, attack, hold, release, end });
      return;
    }
    const partials = [[1, 1], [1.0016, 0.55], [2.0, 0.14]];
    const oscs = partials.map(([ratio, level]) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(env);
      osc.start(at);
      osc.stop(end);
      return osc;
    });
    const voice = { env, oscs, at };
    this.voices.add(voice);
    oscs[0].onended = () => this.voices.delete(voice);
  }

  // グラスの音として鳴らす（操作音より優先する）
  towerTone(freq, options = {}) {
    const at = options.at ?? this.now;
    const { attack = 0.09, hold = 0.6, release = 2.2 } = options;
    this.towerUntil = Math.max(this.towerUntil, at + attack + hold + release);
    this.tone(freq, { ...options, at });
  }

  // 操作音：ボタンを押したとき（tap）、配管をつないだとき（wire）。グラスの音が鳴っている間は鳴らさない
  cue(kind) {
    if (!this.ctx || this.muted || this.now < this.towerUntil) return;
    if (this.ctx.state !== 'running') {
      // 最初のタップでは音の準備がまだ終わっていないことがある。準備ができたら、少しの遅れまでなら鳴らす
      const asked = performance.now();
      this.ctx.resume().then(() => { if (performance.now() - asked < 400) this.#playCue(kind); }).catch(() => {});
      return;
    }
    this.#playCue(kind);
  }

  #playCue(kind) {
    if (this.muted || this.now < this.towerUntil) return;
    // 続けて押したときは、前の操作音を素早く止めてから鳴らす
    this.#fade([...this.uiVoices], 0.01);
    this.uiVoices.clear();
    const start = this.now + 0.005;
    for (const [midi, offset, volume] of UI_CUES[kind]) this.#uiNote(440 * 2 ** ((midi - 69) / 12), start + offset, volume);
  }

  #uiNote(freq, at, gain) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.94, at);
    osc.frequency.exponentialRampToValueAtTime(freq, at + 0.03);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(gain, at + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, at + UI_DECAY);
    osc.connect(env).connect(this.bus);
    osc.start(at);
    osc.stop(at + UI_DECAY + 0.02);
    const voice = { env, oscs: [osc], at };
    this.uiVoices.add(voice);
    this.voices.add(voice);
    osc.onended = () => { this.uiVoices.delete(voice); this.voices.delete(voice); };
  }

  // 鳴っている音を、今の音量から短く下げて止める。
  // 予定を消すだけだと、余韻の途中の音が元の大きさに戻って、別の音が鳴ったように聞こえる
  #fade(voices, seconds) {
    const t = this.ctx.currentTime;
    const end = t + seconds;
    for (const v of voices) {
      const g = v.env.gain;
      if (v.at > t) {
        // まだ鳴り始めていない音は、鳴らさずに止める
        g.cancelScheduledValues(0);
        g.setValueAtTime(0, t);
      } else if (typeof g.cancelAndHoldAtTime === 'function') {
        g.cancelAndHoldAtTime(t);
        g.linearRampToValueAtTime(0, end);
      } else {
        const held = g.value;
        g.cancelScheduledValues(t);
        g.setValueAtTime(held, t);
        g.linearRampToValueAtTime(0, end);
      }
      for (const o of v.oscs) { try { o.stop(Math.max(end, v.at) + 0.01); } catch { /* 既に止まっている */ } }
    }
  }

  // FM合成（比較用）。変調の深さを立ち上がりで強くし、余韻に向けて弱めて、明るさが引いていくようにする。
  // 少しずらした2つ目の搬送波で、加算合成と同じゆっくりしたうなりを残す
  #fmVoice(freq, fm, env, { at, attack, hold, release, end }) {
    const ctx = this.ctx;
    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = freq * fm.ratio;
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(0, at);
    depth.gain.linearRampToValueAtTime(freq * fm.peak, at + attack);
    depth.gain.exponentialRampToValueAtTime(freq * fm.rest, at + attack + hold + release * 0.6);
    mod.connect(depth);
    const oscs = [mod];
    for (const [detune, level] of [[1, 1], [1.0016, 0.5]]) {
      const car = ctx.createOscillator();
      car.type = 'sine';
      car.frequency.value = freq * detune;
      depth.connect(car.frequency);
      const g = ctx.createGain();
      g.gain.value = level;
      car.connect(g).connect(env);
      oscs.push(car);
    }
    for (const o of oscs) { o.start(at); o.stop(end); }
    const voice = { env, oscs, at };
    this.voices.add(voice);
    oscs[1].onended = () => this.voices.delete(voice);
  }

  // 水面が上がる間の控えめな音。上がるにつれて下がる
  glide(fromFreq, toFreq, { at = this.now, duration = 1.3, gain = 0.035 } = {}) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fromFreq, at);
    osc.frequency.exponentialRampToValueAtTime(toFreq, at + duration);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(gain, at + 0.15);
    env.gain.setValueAtTime(gain, at + duration - 0.1);
    env.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.35);
    osc.connect(env).connect(this.bus);
    osc.start(at);
    osc.stop(at + duration + 0.4);
    this.towerUntil = Math.max(this.towerUntil, at + duration + 0.35);
    const voice = { env, oscs: [osc], at };
    this.voices.add(voice);
    osc.onended = () => this.voices.delete(voice);
  }

  // 落ち着いた和音。グラスがいっせいに鳴る
  chord(freqs, { at = this.now, length = 2.6 } = {}) {
    const gain = 0.2 / Math.max(1, Math.sqrt(freqs.length));
    freqs.forEach((f, i) => this.towerTone(f, { at: at + i * 0.012, gain, attack: 0.12, hold: length * 0.35, release: length * 0.65 }));
  }

  // 結果のジングル（試作の仮の旋律）。NGも専用の短いジングルを鳴らす（前作 prism の failure と同じ、下がる3音を
  // この作品の音域へ1オクターブ上げたもの。要件5.6）。行は [MIDI, 開始の秒]
  jingle(kind, { at = this.now } = {}) {
    const notes = kind === 'perfect' ? [[84, 0], [88, 0.16], [91, 0.32], [96, 0.48], [100, 0.64]]
      : kind === 'ng' ? [[76, 0], [72, 0.25], [69, 0.52]]
      : [[84, 0], [88, 0.16], [91, 0.32]];
    notes.forEach(([midi, offset], i) => {
      const f = 440 * 2 ** ((midi - 69) / 12);
      const last = i === notes.length - 1;
      this.tone(f, { at: at + offset, gain: kind === 'ng' ? 0.1 : 0.11, attack: 0.02, hold: kind === 'ng' ? 0.14 : 0.08, release: last ? 1.6 : 0.7 });
    });
  }

  // 停止・消音・面の切り替えのときだけ、鳴っている音を素早く止める
  // 操作音は止めない（押したボタンの操作音が、その操作で止まらないように。前作の preserveTap と同じ）
  stopAll() {
    if (!this.ctx) return;
    this.#fade([...this.voices].filter(v => !this.uiVoices.has(v)), 0.04);
    for (const v of [...this.voices]) if (!this.uiVoices.has(v)) this.voices.delete(v);
    this.towerUntil = 0;
  }
}
