// 自由作成の見本（F-018）。初期版は2つ：泉・グラス・出口だけの「基本」と、サイフォンと桶を使う形（T-07 の3回目で追加）。
// 回路の形は src/logic/free.js の先頭を参照
const pipe = (id, a, b, thinness = '1', extra = {}) => ({ id, a, b, thinness, crest: null, gate: false, ...extra });

export const FREE_SAMPLES = Object.freeze([
  {
    id: 'basic',
    name: '基本',
    note: '給水塔からグラスA、グラスBへ。2つの噴水盤に水が分かれて届きます。',
    circuit: () => ({
      spring: { height: '8' },
      towers: [{ id: 'A', slot: 0, outlet: { height: '0' } }, { id: 'B', slot: 1, outlet: { height: '0' } }],
      pipes: [pipe('SA', 'S', 'A'), pipe('AB', 'A', 'B', '2')],
      primed: []
    })
  }
]);
