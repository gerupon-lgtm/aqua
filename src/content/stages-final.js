// 49〜54面「総まとめ」（T-14）。新しい要素はなく、これまでの要素に水門をひとひねりとして加える（1面に2個まで、要件5.3）。
// 水門は、開いた状態のあと自動で閉じる（二つあるときは同時に閉じる）。どちらの状態でも指定量を届ける（6面と同じ）。
// 観点は面ごとに使う要素に合わせる（要件 Q-10）：排水口のある53面は捨てる水の少なさ→本数、ほかは本数。
// vary の mustGate：満点のつなぎ方で水門を閉じると届く量が変わる（水門が答えに効く）。
// 配管の並びは、出題が2系統×4そろうものを、配管の組み合わせを機械で調べて選んだ（2026-11-04）。
// 水門のある面では「本数の多い別解（部分点）」が開・閉の両方で同じ量になる必要があり、同じ両端の管を2本置く形が多い
const common = { version: 1, set: '総まとめ', spring: { id: 'S', x: 1.1, height: '8' } };
const TOWERS2 = [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.4 }];
const vary = (seed, more = {}) => ({ spring: ['6', '7', '8', '9', '10', '11', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, mustGate: true, seed, ...more });
const both = (open, closed) => ({ open, closed });

export const FINAL_STAGES = [
  {
    // 水門と二つの噴水盤：水門の管は開いた状態だけ水を運ぶ。閉じたあとも残る道で、両方の噴水盤へ届ける
    ...common,
    id: 'T49',
    version: 2,
    number: 49,
    title: '水門と二つの噴水盤',
    hint: '水門は、開いた状態のあと自動で閉じます。開いても閉じても、両方の噴水盤にちょうど届けます。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: both('3', '2'), label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: both('2', '1'), label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1, gate: true },
      { id: 'AB2', a: 'A', b: 'B', thinness: '1', depth: 2 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3 },
      { id: 'SB2', a: 'S', b: 'B', thinness: '1', depth: 4, gate: true }
    ],
    vary: vary(49049)
  },
  {
    // 二つの水門：グラスが三つ。水門は二つで、同時に閉じる。閉じたあとに残る道を考える
    ...common,
    id: 'T50',
    version: 2,
    number: 50,
    title: '二つの水門',
    hint: '水門が二つあります。二つは同時に閉じます。閉じたあとに残る道で、右の噴水盤へ届けます。',
    towers: [{ id: 'A', x: 3.6 }, { id: 'B', x: 5.9 }, { id: 'C', x: 8.2 }],
    outlets: [{ id: 'O1', tower: 'C', height: '0', conductance: '1', target: both('3', '2'), label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1, gate: true },
      { id: 'AC', a: 'A', b: 'C', thinness: '1', depth: 2, gate: true },
      { id: 'SC', a: 'S', b: 'C', thinness: '1', depth: 3 }
    ],
    vary: vary(50050)
  },
  {
    // 水門と高い口：水門を閉じて水位が下がると、口の高い噴水盤へ届く量は大きく減る
    ...common,
    id: 'T51',
    version: 2,
    number: 51,
    title: '水門と高い口',
    hint: '口の高い噴水盤には、水位が口を越えた分だけ届きます。水門を閉じて水位が下がったときも考えます。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '2', conductance: '1', target: both('3', '2'), label: '高い噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: both('2', '1'), label: '低い噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1, gate: true },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3, gate: true },
      { id: 'SB2', a: 'S', b: 'B', thinness: '1', depth: 4 }
    ],
    vary: vary(51051)
  },
  {
    // 水門と太さ：太さを選べる配管で、開いたときと閉じたときの両方をちょうどにする
    ...common,
    id: 'T52',
    version: 2,
    number: 52,
    title: '水門と太さ',
    hint: '太さを選べる配管があります。水門が開いても閉じても、ちょうどになる太さを探します。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: both('3', '2'), label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: both('2', '1'), label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '2', adjustable: ['3', '2', '1'], depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1, gate: true },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3, gate: true },
      { id: 'SB2', a: 'S', b: 'B', thinness: '1', depth: 4 }
    ],
    vary: vary(52052, { mustUse: ['SA'] })
  },
  {
    // 水門と排水口：排水口で捨てる水を少なくしながら、水門が閉じても届ける
    ...common,
    id: 'T53',
    version: 2,
    number: 53,
    title: '水門と排水口',
    theme: 'drain',
    hint: '排水口で捨てる水が少ないほど良い答えです。水門が閉じたときにも届くようにします。',
    towers: TOWERS2,
    drains: [{ id: 'D1', tower: 'A' }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: both('3', '2'), label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB2', a: 'A', b: 'B', thinness: '1', depth: 2, gate: true },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3, gate: true }
    ],
    vary: vary(53053, { minDrains: 1 })
  },
  {
    // 総まとめ：二つの給水塔と口の高い噴水盤に、水門を一つ
    ...common,
    id: 'T54',
    version: 2,
    number: 54,
    title: '総まとめ',
    hint: '二つの給水塔、口の高い噴水盤、水門。開いても閉じても、少ない配管で届けます。',
    spring: { id: 'S', x: 1.1, height: '8', label: '左の給水塔' },
    spring2: { id: 'T', x: 8.8, height: '4', label: '右の給水塔' },
    towers: [{ id: 'A', x: 4.2 }, { id: 'B', x: 6.3 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: both('3', '2'), label: '低い噴水盤' },
      { id: 'O2', tower: 'B', height: '2', conductance: '1', target: both('2', '1'), label: '高い噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2, gate: true },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'TA', a: 'T', b: 'A', thinness: '1', depth: 2 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3 }
    ],
    vary: vary(54054, { spring2: ['2', '3', '4', '6'] })
  }
];
