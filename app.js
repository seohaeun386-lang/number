import { makeQuestion, advance } from './game.js';
const $ = id => document.getElementById(id);
let state = { level: 1, progress: 0, score: 0, streak: 0 };
let question = makeQuestion(1), sound = false, best = 0;
try { best = Number(localStorage.getItem('number-quest-best')) || 0; } catch {}
function render() {
  $('level').textContent = `LEVEL ${String(state.level).padStart(2, '0')}`;
  $('mode').textContent = state.level < 3 ? '덧셈 탐험' : state.level < 5 ? '덧셈 · 뺄셈 탐험' : state.level < 8 ? '곱셈 도전' : '사칙연산 마스터';
  $('progress-label').textContent = `${state.progress} / 5`;
  $('progress').style.width = `${state.progress * 20}%`;
  $('score').textContent = state.score.toLocaleString();
  $('streak').textContent = state.streak;
  $('best').textContent = `${best.toLocaleString()}점`;
  $('question').textContent = question.text;
}
function beep() {
  if (!sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.frequency.value = 660; gain.gain.setValueAtTime(.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .15);
    oscillator.start(); oscillator.stop(ctx.currentTime + .15);
    oscillator.onended = () => ctx.close();
  } catch {}
}
$('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  if ($('answer').value.trim() === '') return;
  const correct = Number($('answer').value) === question.answer;
  const previousLevel = state.level;
  state = advance(state, correct);
  $('feedback').className = correct ? 'good' : 'bad';
  if (correct) {
    best = Math.max(best, state.score);
    try { localStorage.setItem('number-quest-best', String(best)); } catch {}
    $('feedback').textContent = state.level > previousLevel ? `레벨 업! 레벨 ${state.level}에 도착했어요 ✨` : '정답이에요! 한 걸음 더 나아갔어요 ✨';
    question = makeQuestion(state.level); beep();
  } else $('feedback').textContent = '조금만 더 생각해 볼까요? 같은 문제에 다시 도전해요.';
  $('answer').value = ''; render(); $('answer').focus();
});
$('restart').addEventListener('click', () => {
  state = { level: 1, progress: 0, score: 0, streak: 0 }; question = makeQuestion(1);
  $('answer').value = ''; $('feedback').className = '';
  $('feedback').textContent = '새로운 모험을 시작해요! 최고 점수는 보관했어요.';
  render(); $('answer').focus();
});
$('sound').addEventListener('click', () => {
  sound = !sound; $('sound').textContent = `효과음 ${sound ? '켜짐' : '꺼짐'}`;
  $('sound').setAttribute('aria-pressed', String(sound));
});
render();
