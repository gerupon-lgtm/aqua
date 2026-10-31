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

export class GlassAudio {
  constructor({ latencyMs = DEFAULT_LATENCY_MS } = {}) {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.voices = new Set();
    this.latencyMs = latencyMs;
    this.timbre = 'fm2';
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
    const voice = { env, oscs };
    this.voices.add(voice);
    oscs[0].onended = () => this.voices.delete(voice);
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
    const voice = { env, oscs };
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
    const voice = { env, oscs: [osc] };
    this.voices.add(voice);
    osc.onended = () => this.voices.delete(voice);
  }

  // 落ち着いた和音。塔がいっせいに鳴る
  chord(freqs, { at = this.now, length = 2.6 } = {}) {
    const gain = 0.2 / Math.max(1, Math.sqrt(freqs.length));
    freqs.forEach((f, i) => this.tone(f, { at: at + i * 0.012, gain, attack: 0.12, hold: length * 0.35, release: length * 0.65 }));
  }

  // 結果のジングル（試作の仮の旋律）。NGには鳴らさない（要件5.6）
  jingle(kind, { at = this.now } = {}) {
    const notes = kind === 'perfect' ? [84, 88, 91, 96, 100] : [84, 88, 91];
    notes.forEach((midi, i) => {
      const f = 440 * 2 ** ((midi - 69) / 12);
      this.tone(f, { at: at + i * 0.16, gain: 0.11, attack: 0.02, hold: 0.08, release: i === notes.length - 1 ? 1.6 : 0.7 });
    });
  }

  // 停止・消音・面の切り替えのときだけ、鳴っている音を素早く止める
  stopAll() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const v of this.voices) {
      v.env.gain.cancelScheduledValues(t);
      v.env.gain.setTargetAtTime(0.0001, t, 0.03);
      for (const o of v.oscs) { try { o.stop(t + 0.2); } catch { /* 既に止まっている */ } }
    }
    this.voices.clear();
  }
}
