// 出題の当てはめと抽選（logic-design 7.4。前作 prism の src/content/challenge-draw.js に合わせる）。
// お試し（1〜6面）は固定。それ以外は検査済みの出題（challenges.js）から、直前と違う系統を抽選する。

export const isTrial = stage => stage.number <= 6;

// 面の定義に、出題の数値（泉の高さ・細さ・指定量・桶の数）を当てはめる。候補の道とグラスの配置は変えない
export function applyValues(stage, values) {
  const s = structuredClone(stage);
  delete s.vary;
  if (values.spring) s.spring = { ...s.spring, height: values.spring };
  s.candidates = s.candidates.map(c => (values.thinness?.[c.id] ? { ...c, thinness: values.thinness[c.id] } : c));
  s.outlets = s.outlets.map(o => (values.targets?.[o.id] !== undefined ? { ...o, target: values.targets[o.id] } : o));
  if (values.buckets !== undefined) s.buckets = values.buckets;
  return s;
}

// 戻り値：遊ぶ面（出題を当てはめたもの）。stage.draw に { id, number, family, total } を付ける。
// 出題がない・版が合わないときは、出題せずに理由を投げる（C-04）
export function drawChallenge(stage, bank, { previousId = null, random = Math.random } = {}) {
  if (isTrial(stage)) return { ...structuredClone(stage), draw: null };
  if (!bank?.length) throw new Error(`${stage.number}面の検査済みの出題がありません。`);
  if (bank.some(item => item.baseVersion !== stage.version)) throw new Error(`${stage.number}面の出題と面の内容版が一致しません。`);
  const previous = bank.find(item => item.id === previousId);
  const choices = previous ? bank.filter(item => item.family !== previous.family) : bank;
  if (!choices.length) throw new Error(`${stage.number}面に、違う満点のつなぎ方の出題がありません。`);
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error('出題の抽選に失敗しました。');
  const selected = choices[Math.floor(value * choices.length)];
  const s = applyValues(stage, selected.values);
  s.draw = { id: selected.id, number: selected.number, family: selected.family, total: bank.length };
  s.expected = selected.expected;
  return s;
}
