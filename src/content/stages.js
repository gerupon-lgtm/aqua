// 面の定義（1〜54面）。お試し1〜6は固定の出題。7〜30面は
// vary（変えてよい数値の範囲）から scripts/generate-challenges.js で検査済みの出題を8つずつ作り、challenges.js から抽選する。
// vary：spring 泉の高さの候補、thinnessAll／thinness[配管] 細さの候補、maxTarget 指定量の上限、
//       minPerfect 満点の本数の下限、mustUse 満点で必ず使う配管、minBuckets 満点で使う桶の下限、minPumps 満点で使うポンプの下限、minDrains 満点で開ける排水口の下限、mustGate 満点で水門を閉じると届く量が変わる、
//       chord 満点で3和音が鳴る出題（true ならすべて、数なら系統ごとのその数だけ）、chordFamilies 和音の出題を置く系統の数（既定2）、distinctShapes 2系統のつなぎ方の形を変える、
//       distinctTargets 同じ系統の中で給水塔の高さと届ける量が同じ出題を重ねない、seed 乱数の種。
// mayBreak：サイフォンが切れるつなぎ方を出題に含めてよい面（31〜36面。満点のつなぎ方は切れない）。
// 出題のある面では、ここにある細さ・指定量は使われない（出題の値で置き換える）。
// 数値は試作用に、すべてのつなぎ方を調べて「満点が1通り・部分点あり・クリアでは水のあるグラスが目盛りに乗る」を
// 満たすものを選んだ（tests/play.test.js で確かめる）。本番の出題の生成と各面8つの出題（T-04）はまだ。
// 高さは文字列の分数。x は盤面の横位置（0〜10）。thinness は配管の細さ（1 太・2 中・3 細）。
// depth は地面の下を通る深さの段（重なりを避けるための描き分け）。set は面のまとまりの名前。

import { PUMP_STAGES } from './stages-pump.js';
import { DRAIN_STAGES } from './stages-drain.js';
import { LOOP_STAGES } from './stages-loop.js';
import { FINAL_STAGES } from './stages-final.js';

export const STAGES = [
  {
    id: 'T1',
    version: 1,
    number: 1,
    set: 'お試し',
    title: 'まっすぐ届ける',
    hint: '配管をタップしてつなぎ、「水を流す」を押します。',
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
    hint: '2本の細い配管は、1本の太い配管と同じだけ運べるでしょうか。',
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
    // 口の高い噴水盤（2026-11-01 発案者の案：噴水盤が中央にあり、両横から流れ込む。旧名「高い受け皿」、2026-11-04 改名）。
    // 噴水盤の口の高さは 3。グラスの水位が口より上の分だけ出る。片側からだけでは足りず、左右の両方から入れると満点。
    // 中の配管2本は太い1本と同じだけ運ぶので、遠回りの2本でも届く（部分点）
    id: 'T4',
    version: 1,
    number: 4,
    set: 'お試し',
    title: '高い噴水盤',
    hint: '噴水盤の口が高さ3にあります。出口の管は太1なので、グラスの水位が口より上がった分が、そのまま毎秒出ます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 4.6 }, { id: 'B', x: 8.4 }],
    outlets: [{ id: 'O1', tower: 'A', height: '3', conductance: '1', target: '3', label: '高い噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'BA', a: 'B', b: 'A', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'SB2', a: 'S', b: 'B', thinness: '2', depth: 3 },
      { id: 'SB3', a: 'S', b: 'B', thinness: '2', depth: 4 }
    ]
  },
  {
    // お試し5：回り道（太い2本）と近道（中1本）が同じだけ運ぶ。少ない本数の近道が満点、回り道は部分点
    id: 'T5',
    version: 1,
    number: 5,
    set: 'お試し',
    title: '近道と回り道',
    hint: 'グラスを通る回り道と、まっすぐの近道があります。いちばん少ない本数で届けます。',
    spring: { id: 'S', x: 1.1, height: '6' },
    towers: [{ id: 'A', x: 4.4 }, { id: 'B', x: 7.4 }],
    outlets: [{ id: 'O1', tower: 'B', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '2', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 3 }
    ]
  },
  {
    id: 'T6',
    version: 1,
    number: 6,
    set: 'お試し',
    title: '水門を閉じても',
    hint: '水門は、開いた状態のあと自動で閉じます。どちらの状態でも、必要量を届けましょう。',
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
    id: 'T7',
    version: 1,
    number: 7,
    set: '分けて届ける',
    title: '二つの噴水盤へ',
    hint: '二つの噴水盤に、それぞれ必要な量を届けます。どのグラスを通すかで、分かれ方が変わります。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 4.2 }, { id: 'B', x: 7.4 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '2', depth: 2 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '2', depth: 3 }
    ],
    vary: { spring: ['6', '8', '9', '10', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, seed: 7007 }
  },
  {
    id: 'T8',
    version: 1,
    number: 8,
    set: '分けて届ける',
    title: '間のグラスを通って',
    hint: '真ん中のグラスには噴水盤がありません。水の通り道として使えます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 3.6 }, { id: 'B', x: 6.4 }, { id: 'C', x: 8.4 }],
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
    vary: { spring: ['6', '8', '9', '10', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, seed: 8008 }
  },
  {
    id: 'T9',
    version: 1,
    number: 9,
    set: '分けて届ける',
    title: '奥の二つへ',
    hint: '左のグラスには噴水盤がありません。奥の二つの噴水盤に届けます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.4
      },
      {
        id: 'B',
        x: 5.6
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '中の噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AC',
        a: 'A',
        b: 'C',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 9009
    }
  },
  {
    id: 'T10',
    // 版2（2026-11-04 要件 v0.12）：満点の答えで3つのグラスが3和音（長・短）を鳴らす出題だけにした。
    // 3つの水位が違う値になるよう、A–C の管を2本・B–C の管を2本にした（同じ水位のグラスがないと、部分点の答えが作りにくいため）
    // 版3（2026-11-05 要件 v0.13）：この並びで和音が鳴る組み合わせは系統ごとに1通りしかなく、8問が2通りに重なったため、
    // 和音の出題は各系統1問だけにし、残りは届ける量の違う普段の出題にした
    version: 3,
    number: 10,
    set: '分けて届ける',
    title: '三つの噴水盤',
    hint: '三つの噴水盤に、それぞれ必要な量を届けます。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 2.9 }, { id: 'B', x: 5.6 }, { id: 'C', x: 8.4 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '0', conductance: '1', target: '2', label: '中の噴水盤' },
      { id: 'O3', tower: 'C', height: '0', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'BC2', a: 'B', b: 'C', thinness: '1', depth: 4 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 4 },
      { id: 'AC', a: 'A', b: 'C', thinness: '1', depth: 2 },
      { id: 'AC2', a: 'A', b: 'C', thinness: '1', depth: 3 }
    ],
    // 給水塔の高さは版1と同じ範囲（和音の出題は12でだけ見つかる）
    vary: { spring: ['6', '8', '9', '10', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, chord: 1, distinctTargets: true, distinctShapes: true, seed: 10010 }
  },
  {
    id: 'T11',
    version: 1,
    number: 11,
    set: '分けて届ける',
    title: '二本ずつの道',
    hint: '同じグラスの間に、道が二本ずつあります。並べてつなぐと、たくさん運べます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB2',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 11011
    }
  },
  {
    id: 'T12',
    version: 1,
    number: 12,
    set: '分けて届ける',
    title: '分けて届けるのまとめ',
    hint: 'これまでの道をすべて使えます。いちばん少ない本数で届ける道を探します。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.2
      },
      {
        id: 'B',
        x: 5.9
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SC',
        a: 'S',
        b: 'C',
        thinness: '1',
        depth: 3
      },
      {
        id: 'AC',
        a: 'A',
        b: 'C',
        thinness: '1',
        depth: 4
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 12012
    }
  },
  {
    id: 'T13',
    version: 2,
    number: 13,
    set: '流れを調える',
    title: '太さで分ける',
    hint: '太さを変えられる配管は、つないだあとにもう一度タップして太さを選びます。',
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
    ],
    vary: { spring: ['6', '8', '9', '10', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, mustUse: ['SA'], seed: 1313 }
  },
  {
    id: 'T14',
    version: 1,
    number: 14,
    set: '流れを調える',
    title: '二本の太さ',
    hint: '太さを選べる配管が二本あります。両方の噴水盤がちょうどになる太さを探します。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 14014
    }
  },
  {
    id: 'T15',
    version: 1,
    number: 15,
    set: '流れを調える',
    title: '奥で分ける',
    hint: '左のグラスから先で、二つの噴水盤に分けます。分かれ道の太さを調えます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.4
      },
      {
        id: 'B',
        x: 5.6
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '中の噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AC',
        a: 'A',
        b: 'C',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 2
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 15015
    }
  },
  {
    id: 'T16',
    version: 1,
    number: 16,
    set: '流れを調える',
    title: '並べるか、太くするか',
    hint: '細い道を二本並べるのと、一本を太くするのは、同じ働きになることがあります。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 16016
    }
  },
  {
    id: 'T17',
    version: 1,
    number: 17,
    set: '流れを調える',
    title: '遠くまで調える',
    hint: '真ん中のグラスは通り道です。両端の噴水盤の量を、太さで調えます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.2
      },
      {
        id: 'B',
        x: 5.9
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'SC',
        a: 'S',
        b: 'C',
        thinness: '1',
        depth: 2
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 17017
    }
  },
  {
    id: 'T18',
    version: 1,
    number: 18,
    set: '流れを調える',
    title: '流れを調えるのまとめ',
    hint: '太さを選べる配管が三本あります。少ない本数で、ちょうどにします。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '2',
        adjustable: [
          '3',
          '2',
          '1'
        ],
        depth: 3
      }
    ],
    vary: {
      spring: ['6', '7', '8', '9', '10', '11', '12'],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 8,
      minPerfect: 2,
      seed: 18018
    }
  },
  {
    id: 'T19',
    version: 1,
    number: 19,
    set: '低い出口、高い出口',
    title: '高い噴水盤',
    hint: '左の噴水盤は口が高さ2にあります。出口の管は太1なので、水位が口より上がった分が、そのまま毎秒出ます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '2',
        conductance: '1',
        target: '2',
        label: '高い噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '低い噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 19019
    }
  },
  {
    id: 'T20',
    version: 1,
    number: 20,
    set: '低い出口、高い出口',
    title: '奥ほど高い',
    hint: '奥の噴水盤ほど口が高くなっています。奥まで水位を保って届けます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 4.2
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '1',
        conductance: '1',
        target: '2',
        label: '手前の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '3',
        conductance: '1',
        target: '2',
        label: '奥の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SB2',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 20020
    }
  },
  {
    id: 'T21',
    version: 1,
    number: 21,
    set: '低い出口、高い出口',
    title: '高さの違う両端',
    hint: '両端の噴水盤は、口の高さが違います。真ん中のグラスは通り道です。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.2
      },
      {
        id: 'B',
        x: 5.9
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '2',
        conductance: '1',
        target: '2',
        label: '高い噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '0',
        conductance: '1',
        target: '2',
        label: '低い噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AC',
        a: 'A',
        b: 'C',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 21021
    }
  },
  {
    id: 'T22',
    version: 1,
    number: 22,
    set: '低い出口、高い出口',
    title: '高い口と低い口',
    hint: '中の噴水盤は口が高く、右の噴水盤は低い位置にあります。左のグラスは通り道です。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 3.4 }, { id: 'B', x: 5.6 }, { id: 'C', x: 8.4 }],
    outlets: [
      { id: 'O1', tower: 'B', height: '3', conductance: '1', target: '2', label: '高い噴水盤' },
      { id: 'O2', tower: 'C', height: '0', conductance: '1', target: '2', label: '低い噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'AC', a: 'A', b: 'C', thinness: '1', depth: 3 }
    ],
    vary: { spring: ['6', '8', '9', '10', '12'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, seed: 22022 }
  },
  {
    id: 'T23',
    // 版2（2026-11-04 要件 v0.12）：満点の答えで3つのグラスが3和音（長・短）を鳴らす出題だけにした。
    // 3つの水位が違う値になるよう、給水塔–A の管を2本にし、A–C の管を足した（同じ水位のグラスがないと、部分点の答えが作りにくいため）
    // 版3（2026-11-05 要件 v0.13）：和音の出題は1問だけ（Aマイナーの系統）にし、残りは届ける量の違う普段の出題にした（10面と同じ理由）。
    // C メジャーの系統（BC・SA・SB）は、つなぎ方の形の都合で中身が3通りしか作れず4問そろわないため使わない
    version: 3,
    number: 23,
    set: '低い出口、高い出口',
    title: '三つの高さ',
    hint: '三つの噴水盤の口は、それぞれ高さが違います。ちょうど届けると、3つのグラスが和音を鳴らします。',
    spring: { id: 'S', x: 1.1, height: '8' },
    towers: [{ id: 'A', x: 2.9 }, { id: 'B', x: 5.6 }, { id: 'C', x: 8.4 }],
    outlets: [
      { id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '左の噴水盤' },
      { id: 'O2', tower: 'B', height: '2', conductance: '1', target: '2', label: '中の噴水盤' },
      { id: 'O3', tower: 'C', height: '1', conductance: '1', target: '2', label: '右の噴水盤' }
    ],
    candidates: [
      { id: 'SA', a: 'S', b: 'A', thinness: '1', depth: 1 },
      { id: 'SA2', a: 'S', b: 'A', thinness: '1', depth: 3 },
      { id: 'AB', a: 'A', b: 'B', thinness: '1', depth: 1 },
      { id: 'BC', a: 'B', b: 'C', thinness: '1', depth: 1 },
      { id: 'AC', a: 'A', b: 'C', thinness: '1', depth: 3 },
      { id: 'SB', a: 'S', b: 'B', thinness: '1', depth: 2 },
      { id: 'SC', a: 'S', b: 'C', thinness: '1', depth: 4 }
    ],
    // 給水塔の高さは版1の範囲に、Aマイナーの出題が見つかる13を足した
    vary: { spring: ['6', '8', '9', '10', '12', '13'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, chord: 1, chordFamilies: 1, distinctTargets: true, distinctShapes: true, seed: 23023 }
  },
  {
    id: 'T24',
    version: 1,
    number: 24,
    set: '低い出口、高い出口',
    title: '高さのまとめ',
    hint: '口の高さが違う噴水盤に、いちばん少ない本数で届けます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    towers: [
      {
        id: 'A',
        x: 3.2
      },
      {
        id: 'B',
        x: 5.9
      },
      {
        id: 'C',
        x: 8.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '1',
        conductance: '1',
        target: '2',
        label: '低い噴水盤'
      },
      {
        id: 'O2',
        tower: 'C',
        height: '3',
        conductance: '1',
        target: '2',
        label: '高い噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'BC',
        a: 'B',
        b: 'C',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SC',
        a: 'S',
        b: 'C',
        thinness: '1',
        depth: 3
      },
      {
        id: 'AC',
        a: 'A',
        b: 'C',
        thinness: '1',
        depth: 4
      }
    ],
    vary: {
      spring: [
        '6',
        '8',
        '9',
        '10',
        '12'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      seed: 24024
    }
  },
  {
    id: 'T25',
    version: 2,
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
    ],
    // 泉は壁（高さ7）とサイフォンの山（8）より低い範囲で変える
    vary: { spring: ['4', '5', '6'], thinnessAll: ['1', '2', '3'], maxTarget: 6, minPerfect: 2, minBuckets: 1, seed: 2525 }
  },
  {
    id: 'T26',
    version: 1,
    number: 26,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 1,
    title: '壁の手前と向こう',
    hint: '壁を越える管はサイフォンです。桶で呼び水をすると流れます。地面の下の道と比べて選びます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    walls: [
      {
        x: 2.75,
        height: '7'
      }
    ],
    towers: [
      {
        id: 'A',
        x: 4.3
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SAs',
        a: 'S',
        b: 'A',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '4',
        '5',
        '6'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      minBuckets: 1,
      seed: 26026
    }
  },
  {
    id: 'T27',
    version: 1,
    number: 27,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 2,
    title: '二つの壁',
    hint: '壁が二つあります。桶は二つまでです。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    walls: [
      {
        x: 2.75,
        height: '7'
      },
      {
        x: 5.9,
        height: '7'
      }
    ],
    towers: [
      {
        id: 'A',
        x: 4.3
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SAs',
        a: 'S',
        b: 'A',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'ABs',
        a: 'A',
        b: 'B',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '4',
        '5',
        '6'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      minBuckets: 1,
      seed: 27027
    }
  },
  {
    id: 'T28',
    version: 1,
    number: 28,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 1,
    title: '一つの桶で',
    hint: '桶は一つだけです。どこで呼び水をするかを選びます。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    walls: [
      {
        x: 2.75,
        height: '7'
      }
    ],
    towers: [
      {
        id: 'A',
        x: 4.3
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'A',
        height: '0',
        conductance: '1',
        target: '2',
        label: '左の噴水盤'
      },
      {
        id: 'O2',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '右の噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SAs',
        a: 'S',
        b: 'A',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB2',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 2
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '4',
        '5',
        '6'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      minBuckets: 1,
      seed: 28028
    }
  },
  {
    id: 'T29',
    version: 1,
    number: 29,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 2,
    title: '桶を減らす',
    hint: '同じ量を届けるなら、桶は少ないほど良い答えです。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    walls: [
      {
        x: 2.75,
        height: '7'
      },
      {
        x: 5.9,
        height: '7'
      }
    ],
    towers: [
      {
        id: 'A',
        x: 4.3
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SAs',
        a: 'S',
        b: 'A',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'ABs',
        a: 'A',
        b: 'B',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '4',
        '5',
        '6'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      minBuckets: 1,
      seed: 29029
    }
  },
  {
    id: 'T30',
    version: 1,
    number: 30,
    set: '壁を越える',
    theme: 'buckets',
    buckets: 2,
    title: '壁を越えるのまとめ',
    hint: 'サイフォンと地面の下の道を組み合わせて、桶と本数を少なくします。',
    spring: {
      id: 'S',
      x: 1.1,
      height: '8'
    },
    walls: [
      {
        x: 2.75,
        height: '7'
      },
      {
        x: 5.9,
        height: '7'
      }
    ],
    towers: [
      {
        id: 'A',
        x: 4.3
      },
      {
        id: 'B',
        x: 7.4
      }
    ],
    outlets: [
      {
        id: 'O1',
        tower: 'B',
        height: '0',
        conductance: '1',
        target: '2',
        label: '噴水盤'
      }
    ],
    candidates: [
      {
        id: 'SAs',
        a: 'S',
        b: 'A',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'ABs',
        a: 'A',
        b: 'B',
        thinness: '1',
        siphon: {
          crest: '8',
          inlet: '1'
        }
      },
      {
        id: 'SA',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SA2',
        a: 'S',
        b: 'A',
        thinness: '1',
        depth: 2
      },
      {
        id: 'AB',
        a: 'A',
        b: 'B',
        thinness: '1',
        depth: 1
      },
      {
        id: 'SB',
        a: 'S',
        b: 'B',
        thinness: '1',
        depth: 3
      }
    ],
    vary: {
      spring: [
        '4',
        '5',
        '6'
      ],
      thinnessAll: [
        '1',
        '2',
        '3'
      ],
      maxTarget: 6,
      minPerfect: 2,
      minBuckets: 1,
      seed: 30030
    }
  },
  // 31〜36面（後続、T-14）は stages-pump.js
  ...PUMP_STAGES,
  // 37〜42面（後続、T-14）は stages-drain.js
  ...DRAIN_STAGES,
  // 43〜48面（後続、T-14）は stages-loop.js（給水塔が2つ）
  ...LOOP_STAGES,
  ...FINAL_STAGES
];
