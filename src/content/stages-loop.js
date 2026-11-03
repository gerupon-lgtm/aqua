// 43〜48面「一周して戻る」（T-14）。給水塔が2つ（左 S・右 T）と、逆向きの流れ。
// 左右の給水塔は水位が決まった点で、高さの違う2つをつなぐと、高い方から低い方へ水が流れる（低い給水塔へも水が戻る）。
// 配管の流れの向きは計算で決まり、盤面では管の中の白い点の動きで見せる（要件13章「逆向きの流れ」、構想：輪をたどると高さが元に戻る）。
// 観点は本数（要件5.7）。給水塔の高さは出題ごとに変わる（vary の spring・spring2）。
// vary の bothSprings：満点が左右両方の給水塔を使う。intoSpring2：満点で右の給水塔へ水が流れ込む（逆向き）
const SPRINGS = { spring: { id: 'S', x: 1.1, height: '8', label: '左の給水塔' }, spring2: { id: 'T', x: 8.8, height: '4', label: '右の給水塔' } };
const TOWERS2 = [{ id: 'A', x: 3.6 }, { id: 'B', x: 6.0 }];
const common = { version: 1, set: '一周して戻る', ...SPRINGS };
const vary = (seed, more = {}) => ({ spring: ['6', '8', '9', '10', '12'], spring2: ['2', '3', '4', '6'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, seed, ...more });

export const LOOP_STAGES = [
  {
    // 入門：左右の給水塔から、真ん中のグラスへ。両方から入れると多く届く
    ...common,
    id: 'T43',
    number: 43,
    title: '二つの給水塔',
    hint: '給水塔が二つあります。どちらからも水を入れられます。高さの違う給水塔の水は、グラスで合わさります。',
    towers: [{ id: 'A', x: 4.8 }],
    outlets: [{ id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'TA', a: 'T', b: 'A', thinness: '1', depth: 1 },
      { id: 'TA2', a: 'T', b: 'A', thinness: '1', depth: 2 }
    ],
    vary: vary(43043, { spring2: ['4', '6', '8', '9', '10'], bothSprings: true })
  },
  {
    // 低い給水塔へ戻る：グラスの水位が右の給水塔より高いと、水は右の給水塔へ流れ込む。
    // 満点では、Aから右の給水塔へ直接つなぐ管（TA）で水を逃がし、Aの水位（届く量）を下げる
    ...common,
    id: 'T44',
    number: 44,
    title: '低い給水塔へ戻る',
    hint: 'グラスの水位が右の給水塔より高いと、水は給水塔へ逆に流れ込みます。管の中の白い点の動きを見ましょう。',
    towers: TOWERS2,
    outlets: [{ id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'TA', a: 'T', b: 'A', thinness: '1', depth: 3 }
    ],
    vary: vary(44044, { intoSpring2: true })
  },
  {
    // 向きの変わる管：AとBのあいだの管は、つなぎ方で流れの向きが変わる
    ...common,
    id: 'T45',
    number: 45,
    title: '向きの変わる管',
    hint: 'グラスAとBのあいだの管は、両側の水位の高い方から低い方へ流れます。つなぎ方で向きが変わります。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'TA', a: 'T', b: 'A', thinness: '1', depth: 3 }
    ],
    vary: vary(45045)
  },
  {
    // 一周する輪：左の給水塔→A→B→右の給水塔とたどると、高さの差の合計は二つの給水塔の高さの差になる
    ...common,
    id: 'T46',
    number: 46,
    title: '一周する輪',
    hint: '左の給水塔からグラスをたどって右の給水塔まで行くと、途中の高さの差を足した合計は、二つの給水塔の高さの差になります。',
    towers: TOWERS2,
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB2', a: 'T', b: 'B', thinness: '1', depth: 2 }
    ],
    vary: vary(46046, { bothSprings: true })
  },
  {
    // 高い口と二つの給水塔：口の高い噴水盤には、水位が口を越えた分だけ届く
    ...common,
    id: 'T47',
    number: 47,
    title: '高い口と二つの給水塔',
    hint: '口の高い噴水盤には、水位が口を越えた分だけ届きます。どちらの給水塔から入れるかを選びます。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '2', conductance: '1', target: '2', label: '高い噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '低い噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'TA', a: 'T', b: 'A', thinness: '1', depth: 3 }
    ],
    vary: vary(47047)
  },
  {
    // まとめ：二つの給水塔と二つの噴水盤。流れの向きを読み、少ない本数で届ける
    ...common,
    id: 'T48',
    number: 48,
    title: '一周して戻るのまとめ',
    hint: '二つの給水塔のどちらから入れ、どちらへ戻すかを読んで、少ない配管で届けます。',
    towers: TOWERS2,
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB', a: 'T', b: 'B', thinness: '1', depth: 1 },
      { id: 'TB2', a: 'T', b: 'B', thinness: '1', depth: 2 },
      { id: 'TA', a: 'T', b: 'A', thinness: '2', depth: 3 }
    ],
    vary: vary(48048)
  }
];
