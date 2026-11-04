// 37〜42面「音を調える」（T-14、F-009）。排水口：グラスから地面へ水を捨てる口。開け具合は閉・半分・全開の3段。
// 観点は「排水口で捨てる水の少なさ → 本数」（要件5.7）。判定は噴水盤へ届く量だけで、捨てた水は判定に使わない。
// 太さを選べる配管とは役目を分ける（構想：太さは「分け方を調える」、排水口は「水位（音）を調える」）。
// このため37〜42面には太さを選べる配管を置かない。排水口を開けると、そのグラスの水位が下がり、つながった全体の水位と届く量が変わる
const common = { version: 1, set: '音を調える', theme: 'drain', spring: { id: 'S', x: 1.1, height: '8' } };
const vary = (seed, more = {}) => ({ spring: ['4', '5', '6', '7', '8', '9', '10', '11', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, minDrains: 1, seed, ...more });

export const DRAIN_STAGES = [
  {
    // 入門：Aを通ってBの噴水盤へ。配管だけでは届く量が多すぎるので、Aの排水口で水位を下げる
    ...common,
    id: 'T37',
    version: 2,
    number: 37,
    title: '排水口で調える',
    hint: 'グラスの下の排水口をタップすると、閉・半分・全開を選べます。開けると水が地面へ捨てられ、水位が下がります。',
    towers: [{ id: 'A', x: 4.2 }, { id: 'B', x: 7.4 }],
    drains: [{ id: 'D1', tower: 'A' }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'SA3', a: 'S', b: 'A', thinness: '1', depth: 3 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 }
    ],
    vary: vary(37037, { spring: ['6', '7', '8', '9', '10', '11', '12'], maxTarget: 8 })
  },
  {
    // 捨てる水を少なく：近道の太い管で多く入れて捨てるより、細い道で入れて捨てる水を減らす方が良い答え
    ...common,
    id: 'T38',
    version: 3,
    number: 38,
    title: '捨てる水を少なく',
    hint: '同じ量を届けるなら、排水口で捨てる水が少ないほど良い答えです。',
    towers: [{ id: 'A', x: 4.2 }, { id: 'B', x: 7.4 }],
    drains: [{ id: 'D1', tower: 'A' }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3 }
    ],
    vary: vary(38038)
  },
  {
    // 真ん中で調える：噴水盤のないBの排水口が、両側のAとCの噴水盤の両方に響く
    ...common,
    id: 'T39',
    version: 2,
    number: 39,
    title: '真ん中の排水口',
    hint: '真ん中のグラスBの排水口を開けると、Bだけでなく、つながったグラスAとCの水位も変わります。',
    towers: [{ id: 'A', x: 3.6 }, { id: 'B', x: 6.4 }, { id: 'C', x: 8.4 }],
    drains: [{ id: 'D1', tower: 'B' }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'C', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 2 },
      { id: 'AC', a: 'A', b: 'C', thinness: '2', depth: 3 }
    ],
    vary: vary(39039, { spring: ['6', '7', '8', '9', '10', '11', '12'], maxTarget: 8 })
  },
  {
    // 高い口と排水口：口の高い噴水盤は、水位が口を越えた分だけ出る。排水口で水位を口の近くまで下げる
    ...common,
    id: 'T40',
    version: 3,
    number: 40,
    title: '高い口と排水口',
    hint: '口の高い噴水盤には、水位が口を越えた分だけ届きます。排水口で水位を調えます。',
    towers: [{ id: 'A', x: 4.2 }, { id: 'B', x: 7.4 }],
    drains: [{ id: 'D1', tower: 'A' }],
    outlets: [
      { id: 'O1', tower: 'A', height: '2', conductance: '1', target: '2', label: '高い噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '低い噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3 }
    ],
    vary: vary(40040)
  },
  {
    // 二つの排水口：どちらを開けるかで、捨てる水の量が変わる
    ...common,
    id: 'T41',
    version: 2,
    number: 41,
    title: 'どちらを開けるか',
    hint: '排水口が二つあります。どちらを開けても届く量を合わせられますが、捨てる水の量が違います。',
    towers: [{ id: 'A', x: 3.6 }, { id: 'B', x: 6.4 }, { id: 'C', x: 8.4 }],
    drains: [{ id: 'D1', tower: 'A' }, { id: 'D2', tower: 'B' }],
    outlets: [{ id: 'O1', tower: 'C', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 2 }
    ],
    vary: vary(41041)
  },
  {
    // まとめ：二つの噴水盤と二つの排水口。配管と排水口を合わせて、捨てる水と本数を少なくする
    ...common,
    id: 'T42',
    version: 2,
    number: 42,
    title: '音を調えるのまとめ',
    hint: '配管の選び方と排水口の段を合わせて、捨てる水と配管を少なくします。',
    towers: [{ id: 'A', x: 3.6 }, { id: 'B', x: 6.4 }, { id: 'C', x: 8.4 }],
    drains: [{ id: 'D1', tower: 'A' }, { id: 'D2', tower: 'B' }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'C', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 2 },
      { id: 'AC', a: 'A', b: 'C', thinness: '2', depth: 3 }
    ],
    vary: vary(42042)
  }
];
