// 試作のお試し3面。数値は手計算で決めた仮の面で、出題の生成・検査（T-04）はまだ通していない。
// 高さは文字列の分数。x は盤面の横位置（0〜10）。thinness は水路の細さ（1 太・2 中・3 細）。
// depth は地面の下を通る深さの段（重なりを避けるための描き分け）。

export const STAGES = [
  {
    id: 'T1',
    number: 1,
    title: 'まっすぐ届ける',
    hint: '水路をタップしてつなぎ、「水を流す」を押します。',
    spring: { id: 'S', x: 1.1, height: '6' },
    towers: [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.2 }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 3 }
    ]
  },
  {
    id: 'T2',
    number: 2,
    title: '分かれる水',
    hint: '2本の細い水路は、1本の太い水路と同じだけ運べるでしょうか。',
    spring: { id: 'S', x: 1.4, height: '6' },
    towers: [{ id: 'A', x: 6.4 }],
    outlets: [{ id: 'O1', tower: 'A', height: '0', conductance: '1', target: '3', label: '噴水盤' }],
    candidates: [
      { id: 'P1', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'P2', a: 'S', b: 'A', thinness: '2', depth: 2 },
      { id: 'P3', a: 'S', b: 'A', thinness: '2', depth: 3 }
    ]
  },
  {
    id: 'T3',
    number: 3,
    title: '二つの噴水盤',
    hint: '左右の噴水盤に、同じだけ水を届けます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.4 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '4', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '4', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 3 }
    ]
  }
];
