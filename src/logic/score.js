// 採点（logic-design 5.3・5.4、要件5.7）
import { Fraction, ONE, minFraction } from './fraction.js';

const HUNDRED = new Fraction(100n);
const BELOW_PERFECT = new Fraction(9999n, 100n);

// 点数 = 50 + 50 × min(満点の本数 ÷ 使った本数, 1)。100点は満点の1通りだけ
export function pipeScore({ used, perfectCount, isPerfect }) {
  if (isPerfect) return HUNDRED;
  if (!Number.isSafeInteger(used) || used < 1) throw new Error('使った本数が正しくありません。');
  const ratio = minFraction(new Fraction(BigInt(perfectCount), BigInt(used)), ONE);
  const score = new Fraction(50n).add(new Fraction(50n).mul(ratio));
  return score.cmp(HUNDRED) >= 0 ? BELOW_PERFECT : score;
}

// 表示は小数2けた（前作の displayScore と同じく切り捨て）
export function displayScore(score) {
  const hundredths = (score.num * 100n) / score.den;
  return `${hundredths / 100n}.${(hundredths % 100n).toString().padStart(2, '0')}`;
}

// 各出口が指定量どおりか（完全一致）
export function outletVerdict(flow, target) {
  const c = flow.cmp(target);
  return c === 0 ? 'exact' : c < 0 ? 'short' : 'over';
}
