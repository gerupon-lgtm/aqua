// 31〜36面「高さを直して呼び水」（T-14、F-007）。手押しポンプと、切れるサイフォン。
// 観点は25〜30面と同じく「桶の数 → 本数」（要件5.7）。ポンプは何度でも使え、桶に数えない。
// ポンプはグラスAに置き、A→B のサイフォンの呼び水に使う。汲めるのは、Aの水位がサイフォンの入口以上のときだけ（要件5.2）。
// 汲めても、流したあとにAの水位が入口より下がればサイフォンは切れる（mayBreak：切れるつなぎ方を出題に含めてよい。満点は切れない）。
// 桶も1つ持てるので、同じつなぎ方を桶で呼び水しても届く（部分点）。ポンプで済ませると満点
// 壁はAの噴水盤とBのグラスの間（x 6.45）。Aの噴水盤（右へ張り出す）と重ならない位置
const PUMP_WALLS = [{ x: 6.45, height: '7' }];
const TOWERS = [{ id: 'A', x: 4.3 }, { id: 'B', x: 7.4 }];
const siphonAB = inlet => ({ id: 'ABs', a: 'A', b: 'B', thinness: '1', siphon: { crest: '8', inlet }, pump: 'A' });
const common = { version: 1, set: '高さを直して呼び水', theme: 'buckets', mayBreak: true, spring: { id: 'S', x: 1.1, height: '6' }, towers: TOWERS };

export const PUMP_STAGES = [
  {
    // 入門：Aには出口がないので、Aへ水を入れればポンプで汲める。桶でも呼び水できるが、ポンプなら桶を使わずに済む
    ...common,
    id: 'T31',
    version: 2,
    number: 31,
    buckets: 1,
    title: 'ポンプで呼び水',
    hint: 'サイフォンをつないだあと、もう一度タップして「ポンプで呼び水をする」。グラスAの水位が入口の高さ以上なら汲めます。',
    walls: PUMP_WALLS,
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      siphonAB('2')
    ],
    vary: { spring: ['4', '5', '6'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, minPumps: 1, seed: 31031 }
  },
  {
    // 先に水位を上げる：Aにも噴水盤があるので、細い道1本ではAの水位が入口に届かず、ポンプで汲めない。
    // 道を足してAの水位を上げてから汲む
    ...common,
    id: 'T32',
    version: 2,
    number: 32,
    buckets: 1,
    title: '先に水位を上げる',
    hint: 'ポンプは、グラスAの水位がサイフォンの入口に届いているときだけ汲めます。先にAの水位を上げましょう。',
    walls: PUMP_WALLS,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      siphonAB('2')
    ],
    vary: { spring: ['4', '5', '6', '7', '8', '9', '10'], thinnessAll: ['1', '2', '3'], maxTarget: 8, minPerfect: 2, minPumps: 1, seed: 32032 }
  },
  {
    // 桶を使わずに：泉とAの間にも壁がある。泉からは桶のサイフォンか地面の下の道、Aから先はポンプ。桶が少ないほど良い答え
    ...common,
    id: 'T33',
    version: 2,
    number: 33,
    buckets: 1,
    title: '桶を使わずに',
    hint: '桶でもポンプでも呼び水ができます。ポンプは桶に数えません。同じ量なら、桶が少ないほど良い答えです。',
    walls: [{ x: 2.75, height: '7' }, ...PUMP_WALLS],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SAs', a: 'S', b: 'A', thinness: '1', siphon: { crest: '8', inlet: '1' } },
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      siphonAB('2'),
      { id: 'SB', a: 'S', b: 'B', thinness: '3', depth: 3 }
    ],
    vary: { spring: ['4', '5', '6'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, minPumps: 1, seed: 33033 }
  },
  {
    // 二つの噴水盤：Aにも噴水盤がある。Aへ入れる道を選び、Aの水位を入口より上に保ったまま、ポンプでBへも届ける
    ...common,
    id: 'T34',
    version: 2,
    number: 34,
    buckets: 1,
    title: '二つの噴水盤とポンプ',
    hint: 'グラスAの噴水盤にも届けながら、Aの水位をサイフォンの入口より上に保ちます。',
    walls: [{ x: 2.75, height: '7' }, ...PUMP_WALLS],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SAs', a: 'S', b: 'A', thinness: '1', siphon: { crest: '8', inlet: '1' } },
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      siphonAB('2'),
      { id: 'SB', a: 'S', b: 'B', thinness: '3', depth: 3 }
    ],
    vary: { spring: ['4', '5', '6', '7', '8', '9', '10'], thinnessAll: ['1', '2', '3'], maxTarget: 8, minPerfect: 2, minPumps: 1, seed: 34034 }
  },
  {
    // 太さで水位を保つ：太さを選べる道で、Aの水位を入口より上に保ちながら、両方の噴水盤へ届ける
    ...common,
    id: 'T35',
    version: 2,
    number: 35,
    buckets: 1,
    title: '切れないように',
    hint: 'サイフォンが流れ始めると、グラスAの水位が下がります。太さを選んで、入口より下がらないようにします。',
    walls: PUMP_WALLS,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '2', adjustable: ['1', '2', '3'], depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      siphonAB('2')
    ],
    vary: { spring: ['4', '5', '6', '7', '8', '9', '10'], thinnessAll: ['1', '2', '3'], maxTarget: 8, minPerfect: 2, minPumps: 1, seed: 35035 }
  },
  {
    // まとめ：桶・ポンプ・地面の下の道を組み合わせて、桶と本数を少なくする
    ...common,
    id: 'T36',
    version: 2,
    number: 36,
    buckets: 1,
    title: '呼び水のまとめ',
    hint: '先に水位を上げてからポンプで呼び水。桶と配管を少なくします。',
    walls: [{ x: 2.75, height: '7' }, ...PUMP_WALLS],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SAs', a: 'S', b: 'A', thinness: '1', siphon: { crest: '8', inlet: '1' } },
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      siphonAB('3')
    ],
    vary: { spring: ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], thinnessAll: ['1', '2', '3'], maxTarget: 8, minPerfect: 2, minPumps: 1, seed: 36036 }
  }
];
