// 出題の検査（logic-design 7.2、C-04）。生成スクリプト・テスト・アプリで同じものを使い、
// 判定はプレイと同じ計算（play.js）で行う（C-02）。
import { frac } from './fraction.js';
import { analyzeStage, allConfigs, judge, configKey } from './play.js';
import { DEFAULT_SCALE, midiForLevel } from './pitch.js';

// 音域の下限（C2）。水が多いほど低い音になるので、泉の高さが上がりすぎると下に外れる
export const MIN_MIDI = 36;

// 戻り値：{ ok, problems: [理由], analysis }
export function checkChallenge(stage, scale = DEFAULT_SCALE) {
  const problems = [];
  const a = analyzeStage(stage, scale);
  if (!a.perfect) problems.push('満点のつなぎ方がない');
  else if (!a.unique) problems.push('満点のつなぎ方が1通りではない');
  if (a.perfect && !a.clears.some(c => c.key !== a.perfectKey)) problems.push('部分点でクリアできるつなぎ方がない');
  const offScale = a.clears.find(c => !c.allOnScale);
  if (offScale) problems.push(`${offScale.key || '（なし）'} で音階に乗らないグラスがある`);

  // 範囲：水位はグラスの高さ（泉の高さ）以下、音は音域の中
  const H = frac(stage.spring.height);
  for (const c of a.clears) {
    const j = judge(stage, c.config, scale);
    const towers = j.states.flatMap(s => Object.values(s.result.towers)).filter(t => t.state === 'water');
    if (towers.some(t => t.level.cmp(H) > 0)) { problems.push(`${c.key} で水位がグラスの高さを超える`); break; }
    if (towers.some(t => midiForLevel(t.level, scale) < MIN_MIDI)) { problems.push(`${c.key} で音が音域より低い`); break; }
  }

  // サイフォン：切れない配置の面（初期版の25〜30面）では、どのつなぎ方でも切れない
  if (stage.candidates.some(c => c.siphon)) {
    for (const config of allConfigs(stage)) {
      const j = judge(stage, config, scale);
      if (j.states.some(s => s.broken.size)) { problems.push(`${configKey(config)} でサイフォンが切れる`); break; }
    }
  }
  return { ok: problems.length === 0, problems, analysis: a };
}
