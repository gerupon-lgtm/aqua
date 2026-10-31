// 水位と音（logic-design 5.1・5.2）。判定は分数の完全一致。
// 目盛りの間隔・基準・1目盛りあたりの半音数は試作値（LD-03）。
import { Fraction, frac } from './fraction.js';

export const DEFAULT_SCALE = Object.freeze({
  step: frac(1),        // 目盛りの間隔 s（高さ）
  base: frac(0),        // 基準の水位 L0
  topMidi: 96,          // 水位 L0 の音（C7）。水が多いほど低くなる
  semitonesPerStep: 5   // 1目盛りあたりの半音数（試作値。等間隔の目盛りと平均律は保つ）
});

// 目盛りの番号 n = (v − L0) ÷ s
export function scalePosition(level, scale = DEFAULT_SCALE) {
  return Fraction.of(level).sub(scale.base).div(scale.step);
}

export function onScale(level, scale = DEFAULT_SCALE) {
  return scalePosition(level, scale).isInteger();
}

// 一番近い目盛りに対して、水面が上か下か。ちょうど真ん中は「上」
export function tickSide(level, scale = DEFAULT_SCALE) {
  const n = scalePosition(level, scale);
  if (n.isInteger()) return 'on';
  const part = n.sub(new Fraction(n.floor()));
  return part.cmp(new Fraction(1n, 2n)) <= 0 ? 'above' : 'below';
}

// 目盛りからのずれ（0〜0.5、表示の揺れの大きさに使う）
export function tickDistance(level, scale = DEFAULT_SCALE) {
  const n = scalePosition(level, scale);
  const part = n.sub(new Fraction(n.floor())).toNumber();
  return Math.min(part, 1 - part);
}

export function midiForLevel(level, scale = DEFAULT_SCALE) {
  return scale.topMidi - scalePosition(level, scale).toNumber() * scale.semitonesPerStep;
}

// 平均律、ラ＝440Hz を MIDI 番号 69 とする
export function frequencyForMidi(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function frequencyForLevel(level, scale = DEFAULT_SCALE) {
  return frequencyForMidi(midiForLevel(level, scale));
}
