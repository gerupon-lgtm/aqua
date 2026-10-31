// 試作の面。お試し1〜4と、水門（お試し6面目）、太さを変えられる水路（13面）、サイフォンと桶（25面）の先行版。
// 数値は試作用に、すべてのつなぎ方を調べて「満点が1通り・部分点あり・クリアでは水のあるグラスが目盛りに乗る」を
// 満たすものを選んだ（tests/play.test.js で確かめる）。本番の出題の生成と各面8つの出題（T-04）はまだ。
// 高さは文字列の分数。x は盤面の横位置（0〜10）。thinness は水路の細さ（1 太・2 中・3 細）。
// depth は地面の下を通る深さの段（重なりを避けるための描き分け）。set は面のまとまりの名前。

export const STAGES = [
  {
    id: 'T1',
    version: 1,
    number: 1,
    set: 'お試し',
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
    version: 1,
    number: 2,
    set: 'お試し',
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
    version: 1,
    number: 3,
    set: 'お試し',
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
  },
  {
    // 口の高い受け皿（2026-11-01 発案者の案：受け皿が中央にあり、両横から流れ込む）。
    // 受け皿の口の高さは 3。グラスの水位が口より上の分だけ出る。片側からだけでは足りず、左右の両方から入れると満点。
    // 中の水路2本は太い1本と同じだけ運ぶので、遠回りの2本でも届く（部分点）
    id: 'T4',
    version: 1,
    number: 4,
    set: 'お試し',
    title: '高い受け皿',
    hint: '受け皿の口が高い位置にあります。グラスの水位が口より上がった分だけ、水が出ます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 4.6 }, { id: 'B', x: 8.4 }],
    outlets: [{ id: 'O1', tower: 'A', height: '3', conductance: '1', target: '3', label: '高い受け皿' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'BA', a: 'B', b: 'A', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'SB2', a: 'S', b: 'B', thinness: '2', depth: 3 },
      { id: 'SB3', a: 'S', b: 'B', thinness: '2', depth: 4 }
    ]
  },
  {
    id: 'T6',
    version: 1,
    number: 6,
    set: 'お試し',
    title: '水門を閉じても',
    hint: '水門は、開いた状態のあと自動で閉じます。どちらの状態でも指定どおりに届けましょう。',
    spring: { id: 'S', x: 1.1, height: '6' },
    towers: [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.2 }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: { open: '3', closed: '2' }, label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '2', depth: 1 },
      { id: 'SB2', a: 'S', b: 'B', thinness: '2', depth: 2 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 3, gate: true }
    ]
  },
  {
    id: 'T13',
    version: 1,
    number: 13,
    set: '流れを調える',
    title: '太さで分ける',
    hint: '太さを変えられる水路は、つないだあとにもう一度タップして太さを選びます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.4 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '2', adjustable: ['3', '2', '1'], depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '3', depth: 3 }
    ]
  },
  {
    id: 'T25',
    version: 1,
    number: 25,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 2,
    title: '壁の向こうへ',
    hint: '壁を越える管はサイフォンです。つないだあとにもう一度タップして、桶で呼び水をします。',
    spring: { id: 'S', x: 1.1, height: '6' },
    walls: [{ x: 2.75, height: '7' }, { x: 5.9, height: '7' }],
    towers: [{ id: 'A', x: 4.3 }, { id: 'B', x: 7.4 }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', siphon: { crest: '8', inlet: '1' } },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', siphon: { crest: '8', inlet: '1' } },
      { id: 'SB', a: 'S', b: 'B', thinness: '3', depth: 3 }
    ]
  }
];
