// チュートリアル（F-019、screens.md S-09）。お試し1〜6面の中で、面ごとに1つの理屈を水の精霊が教える。
// 初めて遊ぶときは、流す前に「届く量」を予想してもらい、流したあとに実際の数字で答え合わせをする（2026-11-01 発案者）。
// 案内は初めての1回だけ。あとは「ふりかえり」で見直せる。スキップすると以後は自動で出さない（前作と同じ）
import { frac } from '../logic/fraction.js';
import { formatAmount } from '../logic/explain.js';

export const TUTORIAL_KEY = 'aqua-tutorial-v1';

// 面ごとの教え（精霊の言葉）と、予想の問いで聞く状態。下の欄の案内（3行まで）に収まる長さにする
export const LESSONS = {
  T1: { intro: '水は高いところから低いところへ流れます。流れる量＝高さの差÷管の数字。縦につなぐと数字は足し算です。' },
  T2: { intro: '配管を並べてつなぐと、通り道が増えて流れやすくなります。中の管2本と、太の管1本を比べてみましょう。' },
  T3: { intro: 'グラスに入った水は、入った分だけ出ていきます。水は分かれて、両方の噴水盤へ届きます。' },
  T4: { intro: '水位と口の高さの差を、出口の管の数字で割ります。口より低い水位では流れません。' },
  T5: { intro: '近道と回り道があります。同じ量を届けられるなら、配管の本数が少ないほど高い点になります。' },
  T6: { intro: '水門は流したあと自動で閉じます。道が1本減ると、水の分かれ方が変わります。' }
};

export const lessonFor = stage => LESSONS[stage?.id] ?? null;

// 予想の問い。今のつなぎ方で最初の噴水盤に届く量を、3つの選択肢から選ぶ。
// 届かないつなぎ方（量0）では問いを出さない（何も起きないことを予想しても理屈は学べないため）
// 水門のある面は、開いているとき（最初の状態）を聞く。
// 正解がいつも真ん中にならないよう、まちがいの選択肢は候補から2つを選び、小さい順に並べる
export function buildQuestion(stage, ev, random = Math.random) {
  if (!lessonFor(stage)) return null;
  const outlet = ev.states[0].outlets[0];
  if (!outlet || outlet.flow.sign() <= 0) return null;
  const label = stage.outlets.find(o => o.id === outlet.id).label;
  const answer = outlet.flow;
  const pool = [answer.div(frac(2)), answer.mul(frac(2)), answer.add(frac(1)), answer.sub(frac(1)), answer.mul(frac('3/2')), answer.mul(frac('2/3'))]
    .filter((c, i, all) => c.sign() > 0 && !c.eq(answer) && all.findIndex(x => x.eq(c)) === i);
  const wrong = [];
  while (wrong.length < 2 && pool.length) wrong.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  const choices = [answer, ...wrong].sort((a, b) => a.cmp(b));
  return {
    text: `${ev.states.length > 1 ? '水門が開いているとき、' : ''}${label}に届く量は？`,
    label,
    answer,
    choices: choices.map(c => ({ value: c.toString(), text: formatAmount(c) }))
  };
}

// 答え合わせの一文（結果のトーストに出す）
export function answerLine(question, picked) {
  const actual = formatAmount(question.answer);
  if (frac(picked).eq(question.answer)) return `予想どおり！ ${question.label}に ${actual} 届きました。下の解説で計算を確かめましょう。`;
  return `予想は ${formatAmount(frac(picked))}、実際は ${actual} でした。下の解説で、どこで差が出たか確かめましょう。`;
}

// 記録（D-08）：面ごとの完了と、全体のスキップ。保存できない端末でも遊べるよう、失敗は無視する
export class TutorialBook {
  constructor(storage) {
    this.storage = storage;
    this.data = { done: {}, skipped: false };
    try {
      const saved = JSON.parse(storage?.getItem(TUTORIAL_KEY) || 'null');
      if (saved && typeof saved === 'object') this.data = { done: { ...(saved.done ?? {}) }, skipped: Boolean(saved.skipped) };
    } catch { /* 読めないときは初めての扱い */ }
  }
  #save() { try { this.storage?.setItem(TUTORIAL_KEY, JSON.stringify(this.data)); } catch { /* 保存できなくても続ける */ } }
  // その面で案内を出すか（ふりかえりで開き直したときは、記録にかかわらず出す）
  active(stage, review = false) { return Boolean(lessonFor(stage)) && (review || (!this.data.skipped && !this.data.done[stage.id])); }
  complete(stage) { this.data.done[stage.id] = true; this.#save(); }
  skip() { this.data.skipped = true; this.#save(); }
}

// 練習面（画面の見方と操作の案内）。お試し1面の前に置き、精霊が部品を1つずつ光らせて説明する（2026-11-01 発案者）。
// お試し面の予想の問いは、ここで読み方を覚えてから解く。出題の生成・検査の対象（STAGES）には入れない
export const PRACTICE = {
  id: 'P0',
  version: 1,
  number: 0,
  set: '練習',
  title: '画面の見方',
  hint: '配管をタップしてつなぎ、「水を流す」を押します。',
  spring: { id: 'S', x: 1.4, height: '4' },
  towers: [{ id: 'A', x: 5.6 }],
  outlets: [{ id: 'O1', tower: 'A', height: '0', conductance: '1', target: '2', label: '噴水盤' }],
  candidates: [
    { id: 'P1', a: 'S', b: 'A', thinness: '1', depth: 1 },
    { id: 'P2', a: 'S', b: 'A', thinness: '3', depth: 2 }
  ]
};

// 練習面の手順。target は光らせる場所（spring・tower・basin・badges・pipe:ID・run）。
// until は次へ進む条件：next（「次へ」を押す）、connect:ID（その配管をつなぐ）、run（「水を流す」を押す）
export const PRACTICE_STEPS = [
  { target: 'spring', until: 'next', text: '左は給水塔です。水が高さ4まで入っていて、ここから流れ出します。' },
  { target: 'tower', until: 'next', text: 'グラスの目盛り1つが高さ1です。左の数字と見比べます。水が多いほど低い音です。' },
  { target: 'basin', until: 'next', text: '「必要量2」が届けたい量。水位と金色の目印を見比べます。線の先の丸い札は出口の管の太さです。' },
  { target: 'badges', until: 'next', text: '下の凡例を見ましょう。太は1、中は2、細は3。同じ高さの差なら、小さい数字ほど多く流れます。' },
  { target: 'pipe:P1', until: 'connect:P1', text: '光っている「太」の配管をタップして、つなぎましょう。' },
  { target: 'run', until: 'run', text: '届く量＝高さの差÷管の数字の合計。4÷(1＋出口の1)＝2。「水を流す」を押しましょう。' }
];

export const practiceResultText = outcome => (outcome === 'ng'
  ? '必要量と違う量が届きました。「配管を見直す」で、「太」の配管だけをつないでみましょう。'
  : '噴水盤に2届きました。結果の「解説」で計算を確かめ、「次へ」でお試し1へ進みましょう。');
