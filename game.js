export function makeQuestion(level, random = Math.random) {
  const int = max => Math.floor(random() * max) + 1;
  const max = Math.min(1000, 5 + level * 5);
  const ops = level < 3 ? ['+'] : level < 5 ? ['+', '−'] : level < 8 ? ['+', '−', '×'] : ['+', '−', '×', '÷'];
  const op = ops[Math.floor(random() * ops.length)];
  let a = int(max), b = int(max);
  if (op === '−' && a < b) [a, b] = [b, a];
  if (op === '×' || op === '÷') { a = int(Math.min(30, level + 2)); b = int(Math.min(20, level + 2)); }
  if (op === '÷') return { text: `${a * b} ÷ ${b}`, answer: a };
  return { text: `${a} ${op} ${b}`, answer: op === '+' ? a + b : op === '−' ? a - b : a * b };
}
export function advance(state, correct) {
  if (!correct) return { ...state, streak: 0 };
  const progress = state.progress + 1;
  return { level: state.level + (progress === 5 ? 1 : 0), progress: progress % 5,
    score: state.score + state.level * 10, streak: state.streak + 1 };
}
