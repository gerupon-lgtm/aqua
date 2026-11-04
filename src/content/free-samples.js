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
  },
  {
    // お題：3つのグラスで C メジャーの和音（C6・E6・G6 ＝ 水位5・3・2）。給水塔11で、管の太さとつなぎ方を変えて印に合わせる。
    // 答えの一例：給水塔–A 太、給水塔–B 中、B–C 太、A–C 細（tests/free.test.js で確かめる）
    id: 'chord',
    name: '和音のお題',
    note: '3つのグラスの水位を印に合わせて、Cメジャーの和音を鳴らします。',
    goal: {
      id: 'chord-c-major',
      title: 'Cメジャーの和音',
      text: 'グラスA・B・Cの水位を金色の印に合わせて、Cメジャーの和音（C・E・G）を鳴らそう',
      targets: { A: '5', B: '3', C: '2' }
    },
    circuit: () => ({
      spring: { height: '11' },
      towers: [{ id: 'A', slot: 0, outlet: { height: '0' } }, { id: 'B', slot: 1, outlet: { height: '0' } }, { id: 'C', slot: 2, outlet: { height: '0' } }],
      pipes: [pipe('SA', 'S', 'A'), pipe('SB', 'S', 'B'), pipe('SC', 'S', 'C')],
      primed: []
    })
  }
]);
