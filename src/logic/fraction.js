// 分数（分子・分母は BigInt）。計算と比較はすべてここを通す（logic-design 2章）。
// 浮動小数点は描画と発音の直前に toNumber() で使うだけにする。

function gcdBig(a, b) {
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b) [a, b] = [b, a % b];
  return a;
}

export class Fraction {
  constructor(num, den = 1n) {
    num = BigInt(num);
    den = BigInt(den);
    if (den === 0n) throw new Error('分母が0の分数は作れません。');
    if (den < 0n) { num = -num; den = -den; }
    const g = gcdBig(num, den) || 1n;
    this.num = num / g;
    this.den = den / g;
    Object.freeze(this);
  }

  static of(value) {
    if (value instanceof Fraction) return value;
    if (typeof value === 'bigint') return new Fraction(value);
    if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) throw new Error(`整数でない数 ${value} は文字列の分数で渡してください。`);
      return new Fraction(BigInt(value));
    }
    if (typeof value === 'string') {
      const m = /^\s*(-?\d+)\s*(?:\/\s*(\d+))?\s*$/.exec(value);
      if (!m) throw new Error(`分数として読めません：${value}`);
      return new Fraction(BigInt(m[1]), m[2] === undefined ? 1n : BigInt(m[2]));
    }
    throw new Error('分数にできない値です。');
  }

  add(o) { o = Fraction.of(o); return new Fraction(this.num * o.den + o.num * this.den, this.den * o.den); }
  sub(o) { o = Fraction.of(o); return new Fraction(this.num * o.den - o.num * this.den, this.den * o.den); }
  mul(o) { o = Fraction.of(o); return new Fraction(this.num * o.num, this.den * o.den); }
  div(o) {
    o = Fraction.of(o);
    if (o.num === 0n) throw new Error('0で割ることはできません。');
    return new Fraction(this.num * o.den, this.den * o.num);
  }
  neg() { return new Fraction(-this.num, this.den); }

  cmp(o) {
    o = Fraction.of(o);
    const d = this.num * o.den - o.num * this.den;
    return d > 0n ? 1 : d < 0n ? -1 : 0;
  }
  eq(o) { return this.cmp(o) === 0; }
  lt(o) { return this.cmp(o) < 0; }
  gt(o) { return this.cmp(o) > 0; }
  sign() { return this.num > 0n ? 1 : this.num < 0n ? -1 : 0; }
  isZero() { return this.num === 0n; }
  isInteger() { return this.den === 1n; }

  // 小さい側へ切り捨てた整数（負の数でも床関数）
  floor() {
    let q = this.num / this.den;
    if (this.num % this.den !== 0n && this.num < 0n) q -= 1n;
    return q;
  }

  toNumber() { return Number(this.num) / Number(this.den); }
  toString() { return this.den === 1n ? `${this.num}` : `${this.num}/${this.den}`; }
  toJSON() { return this.toString(); }
}

export const frac = value => Fraction.of(value);
export const ZERO = new Fraction(0n);
export const ONE = new Fraction(1n);

export function minFraction(a, b) { return a.cmp(b) <= 0 ? a : b; }
