// 結果の解説：なぜこうなったか、どこを見直すか、100点へどう近づくか。短い文で示す。
// 答えのつなぎ方そのものは書かず、計算の理由と見直す観点を示す。法則の名前は出さない（要件3.1）。
import { Fraction, frac, ZERO } from './fraction.js';
import { onScale, DEFAULT_SCALE } from './pitch.js';

export function formatAmount(f) {
  return f.isInteger() ? f.toString() : `${f.toString()}（約${f.toNumber().toFixed(2)}）`;
}

// 鳴っている音の高さの種類。2つ以上のときだけ「和音」と呼ぶ（同じ高さの重なりや単音は和音と言わない）
export function soundKind(result) {
  const levels = new Set(Object.values(result.towers).filter(t => t.state === 'water').map(t => t.level.toString()));
  return levels.size >= 2 ? 'chord' : levels.size === 1 ? 'single' : 'none';
}

// stage：面の定義、ev：evaluate() の結果、analysis：analyzeStage() の結果
export function explain(stage, connectedIds, ev, analysis, scale = DEFAULT_SCALE) {
  const connected = new Set(connectedIds);
  const r = ev.result;
  const H = frac(stage.spring.height);
  const name = id => (id === stage.spring.id ? '泉' : `塔${id}`);
  const levelOf = id => (id === stage.spring.id ? H : r.towers[id]?.level ?? null);
  const pipes = stage.candidates.filter(c => connected.has(c.id));
  const outletOf = id => stage.outlets.find(o => o.id === id);

  // 計算：流れる量 ＝ 高さの差 ÷ 細さ
  const steps = [];
  for (const c of pipes) {
    const p = r.pipes[c.id];
    if (!p.wet) { steps.push(`${name(c.a)}–${name(c.b)}：水が来ていない`); continue; }
    let [hi, lo] = [c.a, c.b];
    if (p.flow.sign() < 0) [hi, lo] = [lo, hi];
    const diff = levelOf(hi).sub(levelOf(lo));
    steps.push(diff.isZero()
      ? `${name(c.a)}–${name(c.b)}：高さが同じ（${formatAmount(levelOf(c.a))}）で流れない`
      : `${name(hi)} ${formatAmount(levelOf(hi))} → ${name(lo)} ${formatAmount(levelOf(lo))}：差 ${formatAmount(diff)} ÷ 細さ ${c.thinness} ＝ ${formatAmount(diff.div(frac(c.thinness)))}`);
  }
  for (const o of stage.outlets) {
    const t = r.towers[o.tower];
    const thin = new Fraction(1n).div(frac(o.conductance));
    steps.push(t.state === 'empty'
      ? `塔${o.tower}が空なので、${o.label}に届かない`
      : `塔${o.tower} ${formatAmount(t.level)} → ${o.label} ${o.height}：差 ${formatAmount(t.level.sub(frac(o.height)))} ÷ 細さ ${thin} ＝ ${formatAmount(r.outlets[o.id].flow)}`);
  }
  // 分かれ道（塔）では、入る量と出る量が同じ
  const balances = stage.towers
    .filter(t => r.towers[t.id].state === 'water' && !r.towers[t.id].inflow.isZero())
    .map(t => `塔${t.id}：入る ${formatAmount(r.towers[t.id].inflow)} ＝ 出る ${formatAmount(r.towers[t.id].outflow)}`);

  const advice = [];
  const still = pipes.filter(c => r.pipes[c.id].wet && r.pipes[c.id].flow.isZero());
  const empty = stage.towers.filter(t => r.towers[t.id].state === 'empty');
  const offScale = stage.towers.filter(t => r.towers[t.id].state === 'water' && !onScale(r.towers[t.id].level, scale));
  const kind = soundKind(r);

  let summary;
  if (ev.outcome === 'ng') {
    const wrong = ev.outlets.filter(o => o.verdict !== 'exact');
    summary = wrong.map(o => {
      const label = outletOf(o.id).label;
      if (o.flow.isZero()) return `${label}に水が届いていません。`;
      return `${label}：${formatAmount(o.flow)}（指定 ${o.target}）。${o.verdict === 'short' ? '足りません' : '多すぎます'}。`;
    }).join('');
    for (const o of wrong) {
      const tower = outletOf(o.id).tower;
      if (r.towers[tower].state === 'empty') advice.push(`塔${tower}が空です。泉からつながっているか見直しましょう。`);
    }
    if (wrong.some(o => o.verdict === 'short' && !o.flow.isZero())) advice.push('流れにくさを減らすと増えます（太く・近く・並べる）。');
    if (wrong.some(o => o.verdict === 'over')) advice.push('流れにくさを増やすと減ります（細く・遠く・本数を減らす）。');
    if (wrong.some(o => o.verdict === 'over') && wrong.some(o => o.verdict === 'short')) advice.push('水は流れやすい道へ多く分かれます。');
    still.forEach(c => advice.push(`${name(c.a)}–${name(c.b)}は両端の高さが同じで、流れていません。`));
    if (offScale.length) advice.push(`目盛りからずれた塔があり、${kind === 'chord' ? '和音が濁りました' : '音がずれました'}。`);
  } else if (ev.outcome === 'clear') {
    summary = `クリア。満点は ${analysis.perfectCount} 本、今は ${ev.used} 本です。`;
    still.forEach(c => advice.push(`${name(c.a)}–${name(c.b)}は流れていないので、外せます。`));
    // 途中の塔を通る道：細さが足し算になる
    for (const t of stage.towers) {
      const around = pipes.filter(c => c.a === t.id || c.b === t.id);
      if (r.towers[t.id].state !== 'water' || stage.outlets.some(o => o.tower === t.id) || around.length !== 2) continue;
      if (around.some(c => r.pipes[c.id].flow.isZero())) continue;
      const sum = around.reduce((s, c) => s.add(frac(c.thinness)), ZERO);
      advice.push(`塔${t.id}を通ると細さは足し算（${around.map(c => c.thinness).join('＋')}＝${sum}）。細さ ${sum} の1本で代われないか探してみましょう。`);
    }
    // 同じ所を結ぶ水路を並べる：流れやすさ（1÷細さ）が足し算になる
    const groups = new Map();
    for (const c of pipes) {
      const key = [c.a, c.b].sort().join('|');
      groups.set(key, [...(groups.get(key) ?? []), c]);
    }
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const ease = group.reduce((s, c) => s.add(new Fraction(1n).div(frac(c.thinness))), ZERO);
      advice.push(`並べた水路は、細さ ${new Fraction(1n).div(ease)} の1本と同じ働きです。1本で済まないか探してみましょう。`);
    }
    if (!advice.length) advice.push('同じ働きを1本でできる水路を探してみましょう。');
  } else {
    summary = '100点。いちばん少ない本数で届けました。';
    if (!offScale.length && kind === 'chord') advice.push('どの塔も目盛りに乗り、澄んだ和音になりました。');
    else if (!offScale.length && kind === 'single') advice.push('塔の水面が目盛りに乗りました。');
  }
  if (empty.length && ev.outcome !== 'ng') advice.push(`${empty.map(t => `塔${t.id}`).join('・')}はつながっていないので空です。`);
  return { summary, steps, balances, advice };
}
